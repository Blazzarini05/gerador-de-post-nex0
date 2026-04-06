import { useRef, useState, useCallback, useEffect } from "react";
import { Download, Play, ChevronLeft, ChevronRight, Layers, RotateCcw } from "lucide-react";
import html2canvas from "html2canvas";
import { ProjectState, SlideData, AnimationType, OutputFormat, OUTPUT_FORMAT_DIMS } from "../App";
import { T01DarkHeader } from "./templates/T01DarkHeader";
import { T02BottomText } from "./templates/T02BottomText";
import { T03BWEditorial } from "./templates/T03BWEditorial";
import { T04SquareSplit } from "./templates/T04SquareSplit";
import { T05MagazineWide } from "./templates/T05MagazineWide";
import { T06Minimal } from "./templates/T06Minimal";

// ── OKLCH to RGB conversion for html2canvas compatibility ─────────────────────
function convertOklchToRgb(oklch: string): string {
  const match = oklch.match(/oklch\(([\d.]+)\s+([\d.]+)\s+([\d.]+)\)/);
  if (!match) return oklch;

  const L = parseFloat(match[1]);
  const C = parseFloat(match[2]);
  const H = parseFloat(match[3]);

  // Simplified OKLCH to sRGB conversion (approximation)
  // For production, you'd want a proper color space conversion library
  const lightness = L * 255;
  const gray = Math.round(lightness);

  // Simple grayscale conversion for low chroma values
  if (C < 0.01) {
    return `rgb(${gray}, ${gray}, ${gray})`;
  }

  // Basic conversion for colored values
  const h = (H * Math.PI) / 180;
  const a = C * Math.cos(h);
  const b = C * Math.sin(h);

  const r = Math.round(Math.max(0, Math.min(255, lightness + a * 127)));
  const g = Math.round(Math.max(0, Math.min(255, lightness)));
  const b_val = Math.round(Math.max(0, Math.min(255, lightness + b * 127)));

  return `rgb(${r}, ${g}, ${b_val})`;
}

// Convert OKLCH colors in computed styles
function processElementForExport(element: HTMLElement) {
  const elementsToProcess = [element, ...Array.from(element.querySelectorAll('*'))];
  const originalStyles: Array<{ element: HTMLElement; style: string }> = [];

  elementsToProcess.forEach((el) => {
    if (!(el instanceof HTMLElement)) return;

    const computed = window.getComputedStyle(el);
    const inlineStyle: string[] = [];

    // Store original inline style
    originalStyles.push({ element: el, style: el.getAttribute('style') || '' });

    // Convert color properties
    const colorProps = ['color', 'backgroundColor', 'borderColor', 'borderTopColor', 'borderRightColor', 'borderBottomColor', 'borderLeftColor'];

    colorProps.forEach((prop) => {
      const value = computed.getPropertyValue(prop);
      if (value && value.includes('oklch')) {
        const converted = convertOklchToRgb(value);
        const cssProp = prop.replace(/([A-Z])/g, '-$1').toLowerCase();
        inlineStyle.push(`${cssProp}: ${converted}`);
      }
    });

    if (inlineStyle.length > 0) {
      const currentStyle = el.getAttribute('style') || '';
      el.setAttribute('style', currentStyle + '; ' + inlineStyle.join('; '));
    }
  });

  return () => {
    // Restore original styles
    originalStyles.forEach(({ element, style }) => {
      if (style) {
        element.setAttribute('style', style);
      } else {
        element.removeAttribute('style');
      }
    });
  };
}

interface Props {
  project: ProjectState;
  currentSlide: SlideData;
  onSetCurrentSlide: (index: number) => void;
}

// ── Template renderer ─────────────────────────────────────────────────────────
function renderTemplate(
  templateId: string,
  slide: SlideData,
  w: number,
  h: number,
  globalAnimation: AnimationType
) {
  switch (templateId) {
    case "t01-dark-header": return <T01DarkHeader data={slide} width={w} height={h} globalAnimation={globalAnimation} />;
    case "t02-bottom-text": return <T02BottomText data={slide} width={w} height={h} globalAnimation={globalAnimation} />;
    case "t03-bw-editorial": return <T03BWEditorial data={slide} width={w} height={h} globalAnimation={globalAnimation} />;
    case "t04-square-split": return <T04SquareSplit data={slide} width={w} height={h} globalAnimation={globalAnimation} />;
    case "t05-magazine-wide": return <T05MagazineWide data={slide} width={w} height={h} globalAnimation={globalAnimation} />;
    case "t06-minimal": return <T06Minimal data={slide} width={w} height={h} globalAnimation={globalAnimation} />;
    default: return null;
  }
}

// ── Template dims (derived from output format) ────────────────────────────────
function getTemplateInfo(outputFormat: OutputFormat) {
  const dims = OUTPUT_FORMAT_DIMS[outputFormat];
  const w = dims?.w ?? 540;
  const h = dims?.h ?? 960;
  const label = dims?.label ?? "Story 9:16";
  return { width: w, height: h, label, cssWidth: w, cssHeight: h };
}

export function TemplatePreview({ project, currentSlide, onSetCurrentSlide }: Props) {
  const previewRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isExportingVideo, setIsExportingVideo] = useState(false);
  const [exportingAll, setExportingAll] = useState(false);
  const [stageBounds, setStageBounds] = useState({ width: 0, height: 0 });
  const [animationReplayKey, setAnimationReplayKey] = useState(0);

  // Calculate optimal export scale based on the uploaded image's native resolution
  const getExportScale = useCallback(() => {
    if (!previewRef.current || !project.templateId) return 4;

    const info = getTemplateInfo(project.outputFormat);
    const templateCssWidth = info.width;

    const img = previewRef.current.querySelector('img') as HTMLImageElement | null;
    if (img && img.naturalWidth > 0) {
      const neededScale = Math.ceil(img.naturalWidth / templateCssWidth);
      return Math.max(2, Math.min(neededScale, 4));
    }

    return 2;
  }, [project.templateId, project.outputFormat]);


  // ── Export single slide ─────────────────────────────────────────────────
  const handleExport = useCallback(async () => {
    if (!previewRef.current || !project.templateId) return;
    setIsExporting(true);

    const parentMotionDiv = previewRef.current.parentElement as HTMLElement;
    const originalTransform = parentMotionDiv?.style.transform || "";
    let restore: (() => void) | null = null;

    try {
      if (parentMotionDiv) {
        parentMotionDiv.style.transform = "none";
      }

      restore = processElementForExport(previewRef.current);

      const images = previewRef.current.querySelectorAll('img');
      await Promise.all(
        Array.from(images).map((img) => {
          if (img.complete) return Promise.resolve();
          return new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve;
          });
        })
      );

      await new Promise((resolve) => setTimeout(resolve, 300));

      const exportNode = previewRef.current.firstElementChild as HTMLElement;
      if (!exportNode) throw new Error("No template element found");

      const finalScale = getExportScale();
      const canvas = await html2canvas(exportNode, {
        scale: finalScale,
        backgroundColor: "#0A0A0A",
        logging: false,
        useCORS: true,
        allowTaint: false,
        imageTimeout: 0,
        removeContainer: true,
        foreignObjectRendering: false,
        width: exportNode.offsetWidth,
        height: exportNode.offsetHeight,
        windowWidth: exportNode.offsetWidth,
        windowHeight: exportNode.offsetHeight,
      });

      const link = document.createElement("a");
      const slideLabel = project.isCarousel
        ? `-slide-${project.currentSlideIndex + 1}`
        : "";
      link.download = `versavisual-${project.templateId}${slideLabel}-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png", 1.0);
      link.click();
    } catch (error) {
      console.error("Export error:", error);
      alert("Erro ao exportar. Tente novamente ou escolha uma qualidade menor.");
    } finally {
      // Always restore styles and transform, even on error
      if (restore) restore();
      if (parentMotionDiv) {
        parentMotionDiv.style.transform = originalTransform;
      }
      setIsExporting(false);
    }
  }, [project, getExportScale]);

  const hasAnimation =
    project.animation !== "none" ||
    currentSlide.titleAnimation !== "none" ||
    currentSlide.subtitleAnimation !== "none" ||
    currentSlide.tagAnimation !== "none";

  const getVideoMimeType = () => {
    if (typeof MediaRecorder === "undefined") return null;
    const candidates = [
      "video/webm;codecs=vp9",
      "video/webm;codecs=vp8",
      "video/webm",
      "video/mp4;codecs=h264",
      "video/mp4",
    ];
    return candidates.find((type) => {
      try {
        return MediaRecorder.isTypeSupported(type);
      } catch {
        return false;
      }
    }) || null;
  };

  const createMediaRecorder = (stream: MediaStream, mimeType: string | null) => {
    if (!mimeType) return null;
    try {
      return new MediaRecorder(stream, {
        mimeType,
        videoBitsPerSecond: 12_000_000,
      });
    } catch (error) {
      console.warn("MediaRecorder init failed with bitrate for", mimeType, error);
    }

    try {
      return new MediaRecorder(stream, { mimeType });
    } catch (error) {
      console.warn("MediaRecorder init failed without bitrate for", mimeType, error);
    }

    try {
      return new MediaRecorder(stream);
    } catch (error) {
      console.warn("MediaRecorder init failed without explicit mimeType", error);
      return null;
    }
  };

  const replayAnimations = useCallback(() => {
    setAnimationReplayKey((prev) => prev + 1);
  }, []);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || typeof ResizeObserver === "undefined") return;

    const updateBounds = () => {
      const rect = stage.getBoundingClientRect();
      setStageBounds({
        width: rect.width,
        height: rect.height,
      });
    };

    updateBounds();
    const observer = new ResizeObserver(updateBounds);
    observer.observe(stage);

    return () => observer.disconnect();
  }, []);

  const supportedVideoMimeType = getVideoMimeType();
  const canExportVideo = Boolean(supportedVideoMimeType);

  useEffect(() => {
    if (!hasAnimation) return;

    const timeoutId = window.setTimeout(() => {
      replayAnimations();
    }, 80);

    return () => window.clearTimeout(timeoutId);
  }, [
    hasAnimation,
    replayAnimations,
    project.animation,
    project.currentSlideIndex,
    project.outputFormat,
    currentSlide.id,
    currentSlide.titleAnimation,
    currentSlide.subtitleAnimation,
    currentSlide.tagAnimation,
    currentSlide.titleAnimationDelay,
    currentSlide.subtitleAnimationDelay,
    currentSlide.tagAnimationDelay,
    currentSlide.titleAnimationDuration,
    currentSlide.subtitleAnimationDuration,
    currentSlide.tagAnimationDuration,
  ]);

  const handleExportVideo = useCallback(async () => {
    if (!previewRef.current || !project.templateId) return;
    const mimeType = supportedVideoMimeType;
    if (!mimeType) {
      alert("Seu navegador não suporta gravação de vídeo no formato usado pelo app.");
      return;
    }

    setIsExportingVideo(true);
    const parentMotionDiv = previewRef.current.parentElement as HTMLElement;
    const originalTransform = parentMotionDiv?.style.transform || "";
    let restore: (() => void) | null = null;
    let canvasAppended = false;
    let tempCanvas: HTMLCanvasElement | null = null;

    try {
      if (parentMotionDiv) {
        parentMotionDiv.style.transform = "none";
      }

      const images = previewRef.current.querySelectorAll('img');
      await Promise.all(
        Array.from(images).map((img) => {
          if (img.complete) return Promise.resolve();
          return new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve;
          });
        })
      );

      await new Promise((resolve) => setTimeout(resolve, 300));

      replayAnimations();
      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => resolve());
        });
      });
      await new Promise((resolve) => setTimeout(resolve, 120));

      const exportRoot = previewRef.current;
      if (!exportRoot) throw new Error("Preview root unavailable after animation replay");

      restore = processElementForExport(exportRoot);

      const getConnectedExportNode = () => {
        const node = previewRef.current?.firstElementChild;
        if (!(node instanceof HTMLElement) || !node.isConnected) {
          throw new Error("Template element unavailable for video export");
        }
        return node;
      };

      const exportNode = getConnectedExportNode();

      // Keep video export in an Instagram-friendly HD range so conversion
      // remains practical in-browser while preserving the intended aspect ratio.
      const videoScale = Math.min(1, 960 / Math.max(exportNode.offsetWidth, exportNode.offsetHeight));
      const finalScale = videoScale;
      const width = Math.max(2, Math.round(exportNode.offsetWidth * finalScale));
      const height = Math.max(2, Math.round(exportNode.offsetHeight * finalScale));
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      canvas.style.position = "fixed";
      canvas.style.top = "-9999px";
      canvas.style.left = "-9999px";
      canvas.style.opacity = "0";
      document.body.appendChild(canvas);
      canvasAppended = true;
      tempCanvas = canvas;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        if (canvasAppended && canvas.parentElement) canvas.parentElement.removeChild(canvas);
        throw new Error("Unable to get canvas context");
      }

      const fps = 12;
      const delays = [
        currentSlide.titleAnimationDelay ?? 0,
        currentSlide.subtitleAnimationDelay ?? 0,
        currentSlide.tagAnimationDelay ?? 0,
      ];
      const durations = [
        currentSlide.titleAnimationDuration ?? 1.1,
        currentSlide.subtitleAnimationDuration ?? 1.1,
        currentSlide.tagAnimationDuration ?? 0.9,
      ];
      const videoDuration = Math.max(...delays.map((delay, index) => delay + durations[index]), 1.8);
      const frameCount = Math.ceil(videoDuration * fps);

      const stream = canvas.captureStream(fps);
      const recorder = createMediaRecorder(stream, mimeType);
      if (!recorder) {
        throw new Error(`Não foi possível inicializar o MediaRecorder com ${mimeType}`);
      }
      const chunks: Blob[] = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size) chunks.push(event.data);
      };
      recorder.onerror = (event) => {
        console.error("MediaRecorder error:", event);
      };

      const recorderStopped = new Promise<void>((resolve) => {
        recorder.onstop = () => resolve();
      });

      recorder.start(100);
      for (let frame = 0; frame < frameCount; frame += 1) {
        const frameNode = getConnectedExportNode();
        const snapshot = await html2canvas(frameNode, {
          scale: finalScale,
          backgroundColor: "#0A0A0A",
          logging: false,
          useCORS: true,
          allowTaint: false,
          imageTimeout: 0,
          removeContainer: true,
          foreignObjectRendering: false,
          width: frameNode.offsetWidth,
          height: frameNode.offsetHeight,
          windowWidth: frameNode.offsetWidth,
          windowHeight: frameNode.offsetHeight,
        });

        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(snapshot, 0, 0, width, height);
        await new Promise<void>((resolve) => {
          requestAnimationFrame(() => resolve());
        });
        await new Promise((resolve) => setTimeout(resolve, 1000 / fps));
      }

      await new Promise((resolve) => setTimeout(resolve, 220));
      recorder.stop();
      await recorderStopped;
      stream.getTracks().forEach((track) => track.stop());
      if (canvasAppended) document.body.removeChild(canvas);

      const recordedBlob = new Blob(chunks, { type: mimeType });
      if (!recordedBlob.size) {
        throw new Error("Nenhum frame foi gravado pelo MediaRecorder.");
      }

      const url = URL.createObjectURL(recordedBlob);
      const link = document.createElement("a");
      const slideLabel = project.isCarousel ? `-slide-${project.currentSlideIndex + 1}` : "";
      const extension = mimeType.includes("mp4") ? "mp4" : "webm";
      link.download = `versavisual-${project.templateId}${slideLabel}-${Date.now()}.${extension}`;
      link.href = url;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
      console.error("Video export error:", error);
      alert("Falha ao exportar vídeo. Use PNG ou abra no Chrome/Edge para tentar novamente.");
    } finally {
      if (tempCanvas && tempCanvas.parentElement) {
        tempCanvas.parentElement.removeChild(tempCanvas);
      }
      if (restore) restore();
      if (parentMotionDiv) {
        parentMotionDiv.style.transform = originalTransform;
      }
      setIsExportingVideo(false);
    }
  }, [project, currentSlide, getExportScale, replayAnimations]);

  // ── Export all slides (carousel) ─────────────────────────────────────────
  const handleExportAll = useCallback(async () => {
    if (!previewRef.current || !project.templateId) return;
    setExportingAll(true);

    for (let i = 0; i < project.slides.length; i++) {
      const parentMotionDiv = previewRef.current!.parentElement as HTMLElement;
      const originalTransform = parentMotionDiv?.style.transform || "";
      let restore: (() => void) | null = null;

      try {
        onSetCurrentSlide(i);
        await new Promise((resolve) => setTimeout(resolve, 600)); // wait for render

        // Wait for all images to fully load
        const images = previewRef.current!.querySelectorAll('img');
        await Promise.all(
          Array.from(images).map((img) => {
            if (img.complete) return Promise.resolve();
            return new Promise((resolve) => {
              img.onload = resolve;
              img.onerror = resolve;
            });
          })
        );

        await new Promise((resolve) => setTimeout(resolve, 300));

        // Temporarily remove scaling from parent for clean capture
        if (parentMotionDiv) {
          parentMotionDiv.style.transform = "none";
        }

        // Process OKLCH colors before export
        restore = processElementForExport(previewRef.current!);

        const exportNode = previewRef.current!.firstElementChild as HTMLElement;
        if (!exportNode) continue;

        const finalScale = getExportScale();
        const canvas = await html2canvas(exportNode, {
          scale: finalScale,
          backgroundColor: "#0A0A0A",
          logging: false,
          useCORS: true,
          allowTaint: true,
          imageTimeout: 0,
          removeContainer: true,
          foreignObjectRendering: false,
          width: exportNode.offsetWidth,
          height: exportNode.offsetHeight,
          windowWidth: exportNode.offsetWidth,
          windowHeight: exportNode.offsetHeight,
        });

        const link = document.createElement("a");
        link.download = `versavisual-${project.templateId}-slide-${i + 1}.png`;
        link.href = canvas.toDataURL("image/png", 1.0);
        link.click();
        await new Promise((resolve) => setTimeout(resolve, 300));
      } catch (error) {
        console.error(`Export error on slide ${i + 1}:`, error);
      } finally {
        // Always restore styles and transform for each slide, even on error
        if (restore) restore();
        if (parentMotionDiv) {
          parentMotionDiv.style.transform = originalTransform;
        }
      }
    }

    setExportingAll(false);
  }, [project, onSetCurrentSlide, getExportScale]);

  if (!project.templateId) return null;

  const info = getTemplateInfo(project.outputFormat);
  const finalScale = getExportScale();
  const availableWidth = Math.max(stageBounds.width - 24, 220);
  const availableHeight = Math.max(stageBounds.height - 24, 220);
  const previewScale = Math.min(
    availableWidth / info.width,
    availableHeight / info.height,
    1
  );
  const exportPx = info
    ? `${Math.round(info.width * finalScale)}×${Math.round(info.height * finalScale)}px`
    : "";

  return (
    <div className="space-y-4 sm:space-y-5" id="export">
      {/* ── Top bar ───────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h3 className="text-xs sm:text-sm font-semibold tracking-[0.08em] uppercase text-[#0A0A0A]">
            Preview & Export
          </h3>
          <p className="text-[9px] sm:text-[10px] text-[#888] mt-0.5 tracking-wide">
            {info?.label} · {info?.width}×{info?.height}px
            {project.isCarousel && ` · ${project.slides.length} slides`}
          </p>
        </div>

        <div className="flex w-full flex-col gap-2 sm:flex-row sm:flex-wrap md:w-auto md:justify-end">
          <div className="rounded-2xl border border-[#E0E0E0] bg-white px-3 py-2 text-[9px] text-[#444]">
            Exportação automática em máxima qualidade
          </div>

          {hasAnimation && (
            <button
              onClick={replayAnimations}
              disabled={isExporting || isExportingVideo}
              className="vv-btn-ghost min-h-11 flex-1 sm:flex-initial"
            >
              <RotateCcw size={12} className="sm:w-[13px] sm:h-[13px]" />
              Replay
            </button>
          )}

          {/* Animation playback is handled per text element in the editor */}

          {/* Export current */}
          <button
            onClick={handleExport}
            disabled={isExporting || isExportingVideo}
            className="vv-btn min-h-11 flex-1 sm:flex-initial"
          >
            <Download size={12} className="sm:w-[13px] sm:h-[13px]" />
            {isExporting ? "Exportando..." : "PNG"}
          </button>

          {hasAnimation && (
            <button
              onClick={handleExportVideo}
              disabled={isExportingVideo || isExporting || !canExportVideo}
              className="vv-btn min-h-11 flex-1 sm:flex-initial"
              title={canExportVideo ? "Exportar vídeo" : "Vídeo não suportado neste navegador"}
            >
              <Play size={12} className="sm:w-[13px] sm:h-[13px]" />
              {isExportingVideo
                ? "Exportando..."
                : canExportVideo
                  ? "WEBM"
                  : "Vídeo indisponível"}
            </button>
          )}

          {/* Export all slides */}
          {project.isCarousel && (
            <button
              onClick={handleExportAll}
              disabled={exportingAll}
              className="vv-btn-secondary min-h-11 flex-1 sm:flex-initial"
            >
              <Layers size={12} className="sm:w-[13px] sm:h-[13px]" />
              {exportingAll ? "Exportando..." : `Todos (${project.slides.length})`}
            </button>
          )}
        </div>
      </div>

      {/* ── Preview stage ─────────────────────────────────────────────────── */}
      <div
        ref={stageRef}
        className="flex items-center justify-center overflow-hidden rounded-[28px] border border-[#E0E0E0] bg-[radial-gradient(circle_at_top,#ffffff_0%,#f1f1f1_50%,#e7e7e7_100%)] p-3 sm:p-5 lg:p-8"
        style={{ minHeight: "clamp(320px, 68vh, 820px)" }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: `${info.width}px`,
            height: `${info.height}px`,
            transform: `scale(${previewScale || 1})`,
            transformOrigin: "center center",
          }}
        >
          {/* Export target — always renders at native template dimensions (e.g. 540×960) */}
          <div
            ref={previewRef}
            className="flex-shrink-0"
            style={{
              width: `${info.width}px`,
              height: `${info.height}px`,
              overflow: "hidden",
            }}
          >
            <div key={`${currentSlide.id}-${project.outputFormat}-${animationReplayKey}`}>
              {renderTemplate(project.templateId, currentSlide, info.cssWidth, info.cssHeight, project.animation)}
            </div>
          </div>
        </div>
      </div>

      {/* ── Carousel navigation ───────────────────────────────────────────── */}
      {project.isCarousel && (
        <div className="bg-white rounded-xl border border-[#E0E0E0] p-3 sm:p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <p className="text-[9px] sm:text-[10px] tracking-[0.15em] sm:tracking-[0.18em] uppercase text-[#888] font-semibold">
              Slides do Carrossel
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onSetCurrentSlide(Math.max(0, project.currentSlideIndex - 1))}
                disabled={project.currentSlideIndex === 0}
                className="vv-btn-icon h-9 w-9"
              >
                <ChevronLeft size={14} />
              </button>
              <span className="text-[10px] sm:text-[11px] text-[#888] font-medium min-w-[45px] sm:min-w-[50px] text-center">
                {project.currentSlideIndex + 1} / {project.slides.length}
              </span>
              <button
                onClick={() =>
                  onSetCurrentSlide(
                    Math.min(project.slides.length - 1, project.currentSlideIndex + 1)
                  )
                }
                disabled={project.currentSlideIndex === project.slides.length - 1}
                className="vv-btn-icon h-9 w-9"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

          {/* Slide dots + thumbnails */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {project.slides.map((slide, i) => (
              <button
                key={slide.id}
                onClick={() => onSetCurrentSlide(i)}
                className={`flex-shrink-0 relative rounded-lg overflow-hidden border-2 transition-all
                  ${project.currentSlideIndex === i
                    ? "border-[#0A0A0A] shadow-md scale-[1.05]"
                    : "border-[#E0E0E0] hover:border-[#888]"
                  }`}
                style={{ width: "54px", height: "96px" }}
              >
                {slide.imageUrl ? (
                  <img
                    src={slide.imageUrl}
                    alt={`Slide ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-[#0A0A0A] flex items-center justify-center">
                    <span
                      className="font-[family-name:var(--font-display)] text-white"
                      style={{ fontSize: "10px" }}
                    >
                      {i + 1}
                    </span>
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 py-0.5">
                  <p className="text-[8px] text-white text-center">{i + 1}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Export info ───────────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-[#E0E0E0] p-4 flex items-start gap-3">
        <div className="w-8 h-8 bg-[#0A0A0A] rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
          <Download size={14} className="text-white" />
        </div>
        <div>
          <p className="text-[11px] font-semibold text-[#0A0A0A] mb-1">
            Exportação em máxima qualidade → {exportPx}
          </p>
          <p className="text-[11px] text-[#888] leading-relaxed">
            {hasAnimation
              ? "Exporta animação em WEBM quando há movimento, ou PNG estático para layouts sem animação."
              : "PNG nativo com escala automática para preservar a resolução original da imagem e manter nitidez no texto e overlay."}
            {project.isCarousel
              ? ` Exporta o slide atual ou todos os ${project.slides.length} slides individualmente.`
              : " Pronto para redes sociais com alta fidelidade editorial."}
          </p>
        </div>
      </div>
    </div>
  );
}
