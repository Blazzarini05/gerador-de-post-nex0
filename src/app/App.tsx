import { useState, useCallback } from "react";
import { TemplateSelector } from "./components/TemplateSelector";
import { TemplateEditor } from "./components/TemplateEditor";
import { TemplatePreview } from "./components/TemplatePreview";
import { Header } from "./components/Header";
import type { ContentSlide } from "./data/contentLibrary";

export interface SlideData {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  tag?: string;
  overlayOpacity?: number; // 0-100 percentage
  imageScale?: number; // zoom % for background image (1.0–3.0)
  imageOffsetX?: number; // -100 to +100
  imageOffsetY?: number; // -100 to +100
  // Per-element text positioning and styling
  titleH?: number;          // 0–100, horizontal position of title
  titleV?: number;          // 0–100, vertical position of title
  titleFontScale?: number;  // 0.75–1.4 multiplier for title font size
  titleColor?: string;      // CSS color string
  titleAlign?: "left" | "center" | "right";
  subtitleH?: number;       // 0–100, horizontal position of subtitle
  subtitleV?: number;       // 0–100, vertical position of subtitle
  subtitleFontScale?: number;
  subtitleColor?: string;
  subtitleAlign?: "left" | "center" | "right";
}

export type TemplateId =
  | "t01-dark-header"
  | "t02-bottom-text"
  | "t03-bw-editorial"
  | "t04-square-split"
  | "t05-magazine-wide"
  | "t06-minimal";
export type OutputFormat = "9:16" | "4:5" | "1:1" | "16:9";

export const OUTPUT_FORMAT_DIMS: Record<OutputFormat, { w: number; h: number; label: string }> = {
  "9:16": { w: 1080, h: 1920, label: "Story 9:16" },
  "4:5": { w: 1080, h: 1350, label: "Feed 4:5" },
  "1:1": { w: 1080, h: 1080, label: "Post 1:1" },
  "16:9": { w: 1920, h: 1080, label: "Wide 16:9" },
};

export interface ProjectState {
  templateId: TemplateId | null;
  slides: SlideData[];
  currentSlideIndex: number;
  isCarousel: boolean;
  brandName: string;
  outputFormat: OutputFormat;
}

export const createDefaultSlide = (index: number = 0): SlideData => ({
  id: `slide-${Date.now()}-${index}`,
  title:
    index === 0
      ? "CADA FRAME\nÉ UMA\nDECISÃO."
      : `SLIDE ${index + 1}.`,
  subtitle:
    index === 0
      ? "Fotografia com direção de cena, leitura de luz e sensibilidade editorial. Festivais, corporativos, casamentos, bastidores."
      : "Edite este slide com seu conteúdo editorial.",
  imageUrl: "",
  tag: "NEXO",
  overlayOpacity: 70,
  imageScale: 1,
  imageOffsetX: 0,
  imageOffsetY: 0,
  titleH: 50,
  titleV: 10,
  titleFontScale: 1,
  titleColor: "rgba(255,255,255,1)",
  titleAlign: "center",
  subtitleH: 50,
  subtitleV: 85,
  subtitleFontScale: 1,
  subtitleColor: "rgba(255,255,255,0.75)",
  subtitleAlign: "center",
});

function App() {
  const [project, setProject] = useState<ProjectState>({
    templateId: null,
    slides: [createDefaultSlide(0)],
    currentSlideIndex: 0,
    isCarousel: false,
    brandName: "NEXO",
    outputFormat: "9:16",
  });

  const handleSelectTemplate = useCallback((id: TemplateId) => {
    setProject((prev) => ({ ...prev, templateId: id }));
  }, []);

  const handleUpdateSlide = useCallback((slideData: Partial<SlideData>) => {
    setProject((prev) => {
      const newSlides = [...prev.slides];
      newSlides[prev.currentSlideIndex] = {
        ...newSlides[prev.currentSlideIndex],
        ...slideData,
      };
      return { ...prev, slides: newSlides };
    });
  }, []);

  const handleSetCurrentSlide = useCallback((index: number) => {
    setProject((prev) => ({ ...prev, currentSlideIndex: index }));
  }, []);

  const handleSetSlideCount = useCallback((count: number) => {
    setProject((prev) => {
      const current = prev.slides;
      let newSlides = [...current];
      while (newSlides.length < count) {
        newSlides.push(createDefaultSlide(newSlides.length));
      }
      newSlides = newSlides.slice(0, count);
      return {
        ...prev,
        slides: newSlides,
        currentSlideIndex: Math.min(prev.currentSlideIndex, count - 1),
      };
    });
  }, []);

  const handleSetCarousel = useCallback((isCarousel: boolean) => {
    setProject((prev) => {
      if (isCarousel && prev.slides.length < 2) {
        return {
          ...prev,
          isCarousel,
          slides: [...prev.slides, createDefaultSlide(1)],
        };
      }
      return { ...prev, isCarousel };
    });
  }, []);

  const handleDuplicateSlide = useCallback(() => {
    setProject((prev) => {
      const current = prev.slides[prev.currentSlideIndex];
      const newSlide: SlideData = {
        ...current,
        id: `slide-${Date.now()}-dup`,
      };
      const newSlides = [
        ...prev.slides.slice(0, prev.currentSlideIndex + 1),
        newSlide,
        ...prev.slides.slice(prev.currentSlideIndex + 1),
      ];
      return {
        ...prev,
        slides: newSlides,
        currentSlideIndex: prev.currentSlideIndex + 1,
      };
    });
  }, []);

  const handleDeleteSlide = useCallback(() => {
    setProject((prev) => {
      if (prev.slides.length <= 1) return prev;
      const newSlides = prev.slides.filter(
        (_, i) => i !== prev.currentSlideIndex
      );
      return {
        ...prev,
        slides: newSlides,
        currentSlideIndex: Math.max(0, prev.currentSlideIndex - 1),
      };
    });
  }, []);

  const handleApplyCarousel = useCallback((contentSlides: ContentSlide[]) => {
    setProject((prev) => {
      const newSlides: SlideData[] = contentSlides.map((cs, i) => ({
        id: `slide-${Date.now()}-${i}`,
        title: cs.title,
        subtitle: cs.subtitle,
        imageUrl: prev.slides[i]?.imageUrl ?? "",
        tag: cs.tag ?? "NEXO",
        overlayOpacity: prev.slides[i]?.overlayOpacity ?? 70,
        imageScale: prev.slides[i]?.imageScale ?? 1,
        imageOffsetX: prev.slides[i]?.imageOffsetX ?? 0,
        imageOffsetY: prev.slides[i]?.imageOffsetY ?? 0,
        titleH: prev.slides[i]?.titleH ?? 50,
        titleV: prev.slides[i]?.titleV ?? 10,
        titleFontScale: prev.slides[i]?.titleFontScale ?? 1,
        titleColor: prev.slides[i]?.titleColor ?? "rgba(255,255,255,1)",
        titleAlign: prev.slides[i]?.titleAlign ?? "center",
        subtitleH: prev.slides[i]?.subtitleH ?? 50,
        subtitleV: prev.slides[i]?.subtitleV ?? 85,
        subtitleFontScale: prev.slides[i]?.subtitleFontScale ?? 1,
        subtitleColor: prev.slides[i]?.subtitleColor ?? "rgba(255,255,255,0.75)",
        subtitleAlign: prev.slides[i]?.subtitleAlign ?? "center",
      }));
      return {
        ...prev,
        isCarousel: newSlides.length > 1,
        slides: newSlides,
        currentSlideIndex: 0,
      };
    });
  }, []);

  // Group 3: handle multiple image files → create slides
  const handleMultipleImages = useCallback((files: FileList) => {
    const imageFiles = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (imageFiles.length === 0) return;

    setProject((prev) => {
      const currentSlide = prev.slides[prev.currentSlideIndex];
      const newSlides: SlideData[] = imageFiles.map((file, i) => ({
        ...currentSlide,
        id: `slide-${Date.now()}-${i}`,
        imageUrl: URL.createObjectURL(file),
        imageScale: 1,
        imageOffsetX: 0,
        imageOffsetY: 0,
      }));

      const baseSlides = [...prev.slides];
      // Replace from current index
      const insertAt = prev.currentSlideIndex;
      const combined = [
        ...baseSlides.slice(0, insertAt),
        ...newSlides,
        ...baseSlides.slice(insertAt + 1),
      ];

      return {
        ...prev,
        isCarousel: combined.length > 1,
        slides: combined,
        currentSlideIndex: insertAt,
      };
    });
  }, []);

  const currentSlide =
    project.slides[project.currentSlideIndex] || project.slides[0];

  return (
    <div className="min-h-screen bg-[#EBEBEB]">
      <Header />

      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8 lg:py-10">
        {/* Hero */}
        <div className="mb-8 sm:mb-10 lg:mb-12">
          <p className="text-[10px] tracking-[0.35em] uppercase text-[#888888] font-medium mb-3 sm:mb-4">
            NEXO · Studio de Conteúdo · v2.0
          </p>
          <h1
            className="font-[family-name:var(--font-display)] tracking-[0.04em] text-[#0A0A0A] leading-[0.92] uppercase mb-4 sm:mb-5"
            style={{ fontSize: "clamp(36px, 8vw, 88px)" }}
          >
            Studio de
            <br />
            Conteúdo
          </h1>
          <p className="text-sm sm:text-base font-light leading-[1.7] text-[#555] max-w-[540px]">
            Crie posts, stories e carrosséis com a identidade visual NEXO.
            Texto manual ou gerado por IA e exportação em alta qualidade.
          </p>
        </div>

        <TemplateSelector
          selectedTemplate={project.templateId}
          onSelectTemplate={handleSelectTemplate}
        />

        {project.templateId && (
          <div className="mt-8 sm:mt-10 lg:mt-14 grid grid-cols-1 min-[1280px]:grid-cols-[minmax(360px,430px)_minmax(0,1fr)] gap-6 lg:gap-8 items-start">
            <TemplateEditor
              project={project}
              currentSlide={currentSlide}
              onUpdateSlide={handleUpdateSlide}
              onSetCurrentSlide={handleSetCurrentSlide}
              onSetSlideCount={handleSetSlideCount}
              onSetCarousel={handleSetCarousel}
              onDuplicateSlide={handleDuplicateSlide}
              onDeleteSlide={handleDeleteSlide}
              onSetOutputFormat={(f) =>
                setProject((prev) => ({ ...prev, outputFormat: f }))
              }
              onApplyCarousel={handleApplyCarousel}
              onMultipleImages={handleMultipleImages}
            />
            <TemplatePreview
              project={project}
              currentSlide={currentSlide}
              onSetCurrentSlide={handleSetCurrentSlide}
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
