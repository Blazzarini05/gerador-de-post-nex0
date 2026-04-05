import { useRef, useState, useCallback, useEffect } from "react";
import { Download, Play, ChevronLeft, ChevronRight, Layers } from "lucide-react";
import html2canvas from "html2canvas";
import { motion, AnimatePresence } from "motion/react";
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

// ── Animation variants (motion/react) ────────────────────────────────────────
function getAnimationVariants(type: AnimationType, speed: number) {
  const duration = speed;
  switch (type) {
    case "fade-in":
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration, ease: "easeOut" as const } },
      };
    case "slide-up":
      return {
        initial: { opacity: 0, y: 40 },
        animate: { opacity: 1, y: 0, transition: { duration, ease: [0.22, 1, 0.36, 1] as const } },
      };
    case "zoom-out":
      return {
        initial: { opacity: 0, scale: 1.1 },
        animate: { opacity: 1, scale: 1, transition: { duration: duration * 1.5, ease: "easeOut" as const } },
      };
    case "reveal":
      return {
        initial: { opacity: 0, clipPath: "inset(100% 0 0 0)" },
        animate: {
          opacity: 1,
          clipPath: "inset(0% 0 0 0)",
          transition: { duration, ease: [0.22, 1, 0.36, 1] as const },
        },
      };
    case "drift":
      return {
        initial: { opacity: 0, x: -30 },
        animate: { opacity: 1, x: 0, transition: { duration, ease: "easeOut" as const } },
      };
    default:
      return { initial: {}, animate: {} };
  }
}

// ── Template renderer ─────────────────────────────────────────────────────────
function renderTemplate(templateId: string, slide: SlideData, w: number, h: number) {
  switch (templateId) {
    case "t01-dark-header": return <T01DarkHeader data={slide} width={w} height={h} />;
    case "t02-bottom-text": return <T02BottomText data={slide} width={w} height={h} />;
    case "t03-bw-editorial": return <T03BWEditorial data={slide} width={w} height={h} />;
    case "t04-square-split": return <T04SquareSplit data={slide} width={w} height={h} />;
    case "t05-magazine-wide": return <T05MagazineWide data={slide} width={w} height={h} />;
    case "t06-minimal": return <T06Minimal data={slide} width={w} height={h} />;
    default: return null;
  }
}

// ── Template dims (derived from output format) ────────────────────────────────
function getTemplateInfo(outputFormat: OutputFormat) {
  const dims = OUTPUT_FORMAT_DIMS[outputFormat];
  const w = dims?.w ?? 540;
  const h = dims?.h ?? 960;
  const label = dims?.label ?? "Story 9:16";
  return { width: w * 2, height: h * 2, label, cssWidth: w, cssHeight: h };
}

export function TemplatePreview({ project, currentSlide, onSetCurrentSlide }: Props) {
  const previewRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportingAll, setExportingAll] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animKey, setAnimKey] = useState(0);
  const [exportQuality, setExportQuality] = useState<"auto" | 2 | 4>("auto");

  // Calculate optimal export scale based on the uploaded image's native resolution
  const getExportScale = useCallback(() => {
    if (exportQuality !== "auto") return exportQuality;
    if (!previewRef.current || !project.templateId) return 4;

    const info = getTemplateInfo(project.outputFormat);
    const templateCssWidth = info.width / 2; // e.g. 540

    // Find the first img in the template and get its natural (original file) dimensions
    const img = previewRef.current.querySelector('img') as HTMLImageElement | null;
    if (img && img.naturalWidth > 0) {
      // Scale so the exported pixel width >= the original photo's width
      const neededScale = Math.ceil(img.naturalWidth / templateCssWidth);
      return Math.max(2, Math.min(neededScale, 6)); // clamp between 2x and 6x
    }

    return 4; // fallback: 4x (2160p) when no image
  }, [exportQuality, project.templateId, project.outputFormat]);

  // Auto-play animation on template/slide change
  useEffect(() => {
    if (project.animation !== "none") {
      setIsAnimating(true);
      setAnimKey((k) => k + 1);
    }
  }, [project.currentSlideIndex, project.animation]);

  const handlePlayAnimation = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsAnimating(true);
      setAnimKey((k) => k + 1);
    }, 50);
  };

  // ── Export single slide ─────────────────────────────────────────────────
  const handleExport = useCallback(async () => {
    if (!previewRef.current || !project.templateId) return;
    setIsExporting(true);

    const parentMotionDiv = previewRef.current.parentElement as HTMLElement;
    const originalTransform = parentMotionDiv?.style.transform || "";
    let restore: (() => void) | null = null;

    try {
      // Temporarily remove scaling from parent for clean capture
      if (parentMotionDiv) {
        parentMotionDiv.style.transform = "none";
      }

      // Process OKLCH colors before export
      restore = processElementForExport(previewRef.current);

      // Wait for all images to fully load
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

      // Additional wait to ensure render is complete
      await new Promise((resolve) => setTimeout(resolve, 300));

      const exportNode = previewRef.current.firstElementChild as HTMLElement;
      if (!exportNode) throw new Error("No template element found");

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
  }, [project, exportQuality, getExportScale]);

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
  }, [project, exportQuality, onSetCurrentSlide, getExportScale]);

  if (!project.templateId) return null;

  const info = getTemplateInfo(project.outputFormat);
  const variants = getAnimationVariants(project.animation, project.animationSpeed);
  const currentScale = exportQuality === "auto" ? "Auto" : exportQuality;
  const displayScale = exportQuality === "auto" ? 4 : exportQuality;
  const exportPx = info ? `${info.width * displayScale / 2}×${info.height * displayScale / 2}px` : "";

  return (
    <div className="space-y-4 sm:space-y-5" id="export">
      {/* ── Top bar ───────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-start sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-xs sm:text-sm font-semibold tracking-[0.08em] uppercase text-[#0A0A0A]">
            Preview & Export
          </h3>
          <p className="text-[9px] sm:text-[10px] text-[#888] mt-0.5 tracking-wide">
            {info?.label} · {info?.width}×{info?.height}px
            {project.isCarousel && ` · ${project.slides.length} slides`}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
          {/* Quality toggle */}
          <div className="flex rounded-lg overflow-hidden border border-[#E0E0E0] flex-shrink-0">
            {(["auto", 2, 4] as const).map((q) => (
              <button
                key={String(q)}
                onClick={() => setExportQuality(q)}
                className={`px-2.5 sm:px-3 py-1.5 sm:py-2 text-[8px] sm:text-[9px] tracking-[0.12em] sm:tracking-[0.15em] uppercase font-semibold transition-all
                  ${exportQuality === q
                    ? "bg-[#0A0A0A] text-white"
                    : "bg-white text-[#666] hover:bg-[#F5F5F5]"
                  }`}
              >
                {q === "auto" ? "Full" : q === 2 ? "2× · 1080p" : "4× · 4K"}
              </button>
            ))}
          </div>

          {/* Animation playback */}
          {project.animation !== "none" && (
            <button
              onClick={handlePlayAnimation}
              className="px-3 sm:px-4 py-1.5 sm:py-2 bg-[#1A3A5C] text-white rounded-lg hover:bg-[#243E5E] transition-all flex items-center gap-1.5 text-[9px] sm:text-[10px] tracking-[0.12em] sm:tracking-[0.14em] uppercase font-semibold"
            >
              <Play size={11} className="sm:w-[12px] sm:h-[12px]" />
              <span className="hidden sm:inline">Play</span>
            </button>
          )}

          {/* Export current */}
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex-1 sm:flex-initial px-4 sm:px-5 py-2 sm:py-2.5 bg-[#0A0A0A] text-white rounded-lg hover:bg-[#1A1A1A] transition-all flex items-center justify-center gap-1.5 text-[9px] sm:text-[10px] tracking-[0.14em] sm:tracking-[0.16em] uppercase font-semibold disabled:opacity-50 shadow-md"
          >
            <Download size={12} className="sm:w-[13px] sm:h-[13px]" />
            {isExporting ? "Exportando..." : "PNG"}
          </button>

          {/* Export all slides */}
          {project.isCarousel && (
            <button
              onClick={handleExportAll}
              disabled={exportingAll}
              className="flex-1 sm:flex-initial px-3 sm:px-4 py-2 sm:py-2.5 bg-[#1A1A1A] text-white rounded-lg hover:bg-[#2A2A2A] transition-all flex items-center justify-center gap-1.5 text-[9px] sm:text-[10px] tracking-[0.12em] sm:tracking-[0.14em] uppercase font-semibold disabled:opacity-50"
            >
              <Layers size={12} className="sm:w-[13px] sm:h-[13px]" />
              {exportingAll ? "Exportando..." : `Todos (${project.slides.length})`}
            </button>
          )}
        </div>
      </div>

      {/* ── Preview stage ─────────────────────────────────────────────────── */}
      <div
        className="bg-[#141414] rounded-xl sm:rounded-2xl flex items-center justify-center overflow-hidden p-4 sm:p-6 lg:p-8"
        style={{ minHeight: "640px" }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={`${animKey}-${project.currentSlideIndex}`}
            {...(isAnimating && project.animation !== "none" ? variants : {})}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              /* Visual-only scaling — this wrapper scales the preview for display 
                 but the inner previewRef stays at native template size for export */
              width: `${info.width / 2}px`,
              height: `${info.height / 2}px`,
              transform: `scale(${Math.min(
                520 / (info.width / 2),
                680 / (info.height / 2)
              )})`,
              transformOrigin: "center center",
            }}
          >
            {/* Export target — always renders at native template dimensions (e.g. 540×960) */}
            <div
              ref={previewRef}
              className="shadow-2xl"
              style={{
                width: `${info.width / 2}px`,
                height: `${info.height / 2}px`,
                overflow: "hidden",
                flexShrink: 0,
              }}
            >
              {renderTemplate(project.templateId, currentSlide, info.cssWidth, info.cssHeight)}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Carousel navigation ───────────────────────────────────────────── */}
      {project.isCarousel && (
        <div className="bg-white rounded-xl border border-[#E0E0E0] p-3 sm:p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[9px] sm:text-[10px] tracking-[0.15em] sm:tracking-[0.18em] uppercase text-[#888] font-semibold">
              Slides do Carrossel
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onSetCurrentSlide(Math.max(0, project.currentSlideIndex - 1))}
                disabled={project.currentSlideIndex === 0}
                className="p-1.5 rounded-lg bg-[#F0F0F0] text-[#444] hover:bg-[#E0E0E0] disabled:opacity-30 transition-colors"
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
                className="p-1.5 rounded-lg bg-[#F0F0F0] text-[#444] hover:bg-[#E0E0E0] disabled:opacity-30 transition-colors"
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
            Export {exportQuality === "auto" ? "Full Quality" : `${exportQuality}×`} → {exportPx}
          </p>
          <p className="text-[11px] text-[#888] leading-relaxed">
            {exportQuality === "auto"
              ? "Modo Full: calcula automaticamente a escala para preservar a resolução original da foto de upload."
              : project.isCarousel
                ? `"PNG" exporta o slide atual. "Todos" exporta os ${project.slides.length} slides individualmente.`
                : "PNG em alta resolução pronto para Instagram, Stories e posts editoriais."}
            {" "}Imagens locais e Unsplash são exportadas com alta fidelidade (useCORS).
          </p>
        </div>
      </div>
    </div>
  );
}