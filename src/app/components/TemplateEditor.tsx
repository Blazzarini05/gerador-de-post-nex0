import { useState, useRef, useCallback } from "react";
import {
  Search,
  Upload,
  Sparkles,
  Film,
  Plus,
  Trash2,
  Copy,
  ChevronLeft,
  ChevronRight,
  X,
  RefreshCw,
  Layers,
  Droplet,
  BookOpen,
  LayoutGrid,
  Image as ImageIcon,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { ProjectState, SlideData, AnimationType, OutputFormat, TextPosition } from "../App";
import {
  CONTENT_CAROUSELS,
  CONTENT_SINGLES,
  type ContentSlide,
} from "../data/contentLibrary";

// ── AI Content Database — VERSAVISUAL 6 Pilares de Conteúdo ─────────────────
type StorySequence = Array<{ title: string; subtitle: string; progression: string }>;

const AI_CAROUSEL_STORIES: Record<string, StorySequence> = {
  "Portfólio": [
    {
      title: "CADA FRAME\nÉ UMA\nDECISÃO.",
      subtitle: "Fotografia com direção de cena, leitura de luz e sensibilidade editorial. Festivais, corporativos, casamentos, bastidores.",
      progression: "01 — Abertura · O que entregamos",
    },
    {
      title: "ONDE A CENA\nVIRA\nNARRATIVA.",
      subtitle: "Captação e produção de vídeo para eventos ao vivo, marcas e artistas com identidade.",
      progression: "02 — Desenvolvimento · O resultado",
    },
    {
      title: "IMAGEM SEM\nNARRATIVA É\nREGISTRO.",
      subtitle: "Narrativa com imagem é comunicação. É isso que diferencia um clique de uma história.",
      progression: "03 — Manifesto · O que nos move",
    },
    {
      title: "O FRAME\nQUE FALTA\nNO SEU FEED.",
      subtitle: "Produção completa. Do briefing ao frame final. Link na bio.",
      progression: "04 — CTA · Fechamento",
    },
  ],
  "Processo": [
    {
      title: "TUDO COMEÇA\nANTES DA\nCÂMERA LIGAR.",
      subtitle: "Alinhamento de briefing, roteiro, reconhecimento de locação e definição da linguagem visual.",
      progression: "01 — Pré-produção · Planejamento",
    },
    {
      title: "EM CAMPO\nCOM\nINTENÇÃO.",
      subtitle: "A equipe não age por instinto isolado — age coordenada, com papéis definidos e visão compartilhada.",
      progression: "02 — Execução · Operação em campo",
    },
    {
      title: "O RESULTADO\nÉ SEMPRE\nCOERENTE.",
      subtitle: "Porque o processo foi pensado antes do primeiro frame. Edição, tratamento de cor e entrega em formatos definidos.",
      progression: "03 — Pós-produção · Finalização",
    },
    {
      title: "DO BRIEFING\nAO FRAME\nFINAL.",
      subtitle: "Três camadas. Um processo. Resultados coerentes para cada plataforma e finalidade.",
      progression: "04 — Síntese · Visão completa",
    },
  ],
  "Narrativa": [
    {
      title: "A HISTÓRIA\nEXISTE ANTES\nDAS IMAGENS.",
      subtitle: "Construção de narrativas visuais para redes sociais e plataformas digitais com coerência.",
      progression: "01 — Conceito · Storymaking",
    },
    {
      title: "NÃO CHEGAMOS\nPARA REGISTRAR.\nPARA INTERPRETAR.",
      subtitle: "Cada evento tem uma verdade. Nossa missão é capturá-la sem filtros artificiais.",
      progression: "02 — Diferencial · Autenticidade",
    },
    {
      title: "MESTRIA NÃO\nSE IMPROVISA.",
      subtitle: "Se constrói quadro a quadro. Direção criativa e de cena da concepção visual ao posicionamento de câmera.",
      progression: "03 — Autoridade · Excelência",
    },
    {
      title: "NARRATIVA\nCOM IMAGEM É\nCOMUNICAÇÃO.",
      subtitle: "Posts, carrosséis, reels e sequências que comunicam com coerência e intenção editorial.",
      progression: "04 — Entrega · O que você recebe",
    },
  ],
  "Técnica": [
    {
      title: "CONTRALUZ\nCRIA DRAMA.",
      subtitle: "Luz lateral define volume. Cada escolha técnica tem propósito narrativo e estético.",
      progression: "01 — Iluminação · Decisões técnicas",
    },
    {
      title: "O ROTEIRO\nNÃO É\nBUROCRACIA.",
      subtitle: "É o mapa. Desenvolvimento de roteiros para vídeos institucionais, redes sociais e coberturas temáticas.",
      progression: "02 — Roteiro · Estrutura narrativa",
    },
    {
      title: "DIREÇÃO\nATIVA EM\nCAMPO.",
      subtitle: "Da concepção visual ao posicionamento de câmera. Operação multicâmera com equipe técnica integrada.",
      progression: "03 — Direção · Controle criativo",
    },
    {
      title: "CADA ESCOLHA\nTEM\nPROPÓSITO.",
      subtitle: "Cortes rápidos para energia. Movimentos lentos para contemplação. Câmera na mão para proximidade.",
      progression: "04 — Edição · Ritmo e intenção",
    },
  ],
  "Autoridade": [
    {
      title: "MESTRIA NÃO\nSE IMPROVISA.\nSE CONSTRÓI.",
      subtitle: "Quadro a quadro. Hub criativo onde direção, captação, narrativa e edição coexistem com intenção.",
      progression: "01 — Manifesto · Posicionamento",
    },
    {
      title: "NÃO SOMOS\nFREELANCER\nESCALADO.",
      subtitle: "Somos um processo estruturado. De Salvador ao São Paulo Corporate — onde a história acontece.",
      progression: "02 — Diferencial · Hub criativo",
    },
    {
      title: "FESTIVAIS.\nCORPORATIVOS.\nCASAMENTOS.\nCLIPES.",
      subtitle: "Mesma excelência, linguagens diferentes. Versatilidade com padrão.",
      progression: "03 — Versatilidade · Amplitude",
    },
    {
      title: "A VERSAVISUAL\nVAI ONDE A\nHISTÓRIA\nACONTECE.",
      subtitle: "Presença nacional. Pontes reais entre marcas, artistas e audiências. B2B com alma.",
      progression: "04 — Presença · Compromisso",
    },
  ],
  "Depoimento & Resultado": [
    {
      title: "RESULTADOS\nQUE FALAM\nPOR SI.",
      subtitle: "Prova social de eventos cobertos com presença completa — fotografia, vídeo, storymaking e direção integrados.",
      progression: "01 — Evidência · Números reais",
    },
    {
      title: "DO TRIO\nELÉTRICO AO\nEVENTO B2B.",
      subtitle: "Babado Novo, É o Tchan e o hall corporativo mais exigente do ano. A mesma equipe, a mesma precisão.",
      progression: "02 — Trajetória · Histórico",
    },
    {
      title: "CLIENTES QUE\nVIRAM\nPARCEIROS.",
      subtitle: "Quando a estética encontra a estratégia, o resultado permanece e a parceria se fortalece.",
      progression: "03 — Relacionamento · Fidelização",
    },
    {
      title: "PRODUÇÃO\nCOMPLETA.\nRESULTADO\nMENSURÁVEL.",
      subtitle: "Antes, durante e depois. Campanhas editoriais que geram conversas, conversões e reconhecimento.",
      progression: "04 — CTA · Próximo passo",
    },
  ],
};

// ── Animation config ─────────────────────────────────────────────────────────
const ANIMATIONS: Array<{
  id: AnimationType;
  label: string;
  description: string;
  icon: string;
}> = [
    { id: "none", label: "Estático", description: "Sem animação", icon: "⏹" },
    { id: "fade-in", label: "Fade In", description: "Aparece suavemente", icon: "🌅" },
    { id: "slide-up", label: "Slide Up", description: "Sobe com fade", icon: "⬆" },
    { id: "zoom-out", label: "Ken Burns", description: "Zoom out lento", icon: "🔭" },
    { id: "reveal", label: "Reveal", description: "Texto revelado", icon: "✨" },
    { id: "drift", label: "Drift", description: "Pan horizontal", icon: "🎬" },
  ];

// ── Props ─────────────────────────────────────────────────────────────────────
interface Props {
  project: ProjectState;
  currentSlide: SlideData;
  onUpdateSlide: (data: Partial<SlideData>) => void;
  onSetCurrentSlide: (index: number) => void;
  onSetSlideCount: (count: number) => void;
  onSetCarousel: (isCarousel: boolean) => void;
  onSetAnimation: (a: AnimationType) => void;
  onSetAnimationSpeed: (s: number) => void;
  onDuplicateSlide: () => void;
  onDeleteSlide: () => void;
  onSetOutputFormat: (format: OutputFormat) => void;
  onApplyCarousel: (slides: ContentSlide[]) => void;
}

type Tab = "texto" | "imagem" | "ia" | "biblioteca" | "animacao";

export function TemplateEditor({
  project,
  currentSlide,
  onUpdateSlide,
  onSetCurrentSlide,
  onSetSlideCount,
  onSetCarousel,
  onSetAnimation,
  onSetAnimationSpeed,
  onDuplicateSlide,
  onDeleteSlide,
  onSetOutputFormat,
  onApplyCarousel,
}: Props) {
  const [tab, setTab] = useState<Tab>("texto");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [aiCategory, setAiCategory] = useState("Portfólio");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSequence, setGeneratedSequence] = useState<StorySequence | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [bibMode, setBibMode] = useState<"carousel" | "single">("carousel");
  const [bibFilter, setBibFilter] = useState("Todos");
  const [expandedCarousel, setExpandedCarousel] = useState<string | null>(null);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleFileUpload = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    onUpdateSlide({
      imageUrl: url,
      imageScale: 1,
      imageOffsetX: 0,
      imageOffsetY: 0,
    });
  }, [onUpdateSlide]);

  const setImageOffset = useCallback(
    (dx: number, dy: number) => {
      onUpdateSlide({
        imageOffsetX: Math.max(
          -45,
          Math.min(45, (currentSlide.imageOffsetX ?? 0) + dx)
        ),
        imageOffsetY: Math.max(
          -45,
          Math.min(45, (currentSlide.imageOffsetY ?? 0) + dy)
        ),
      });
    },
    [currentSlide.imageOffsetX, currentSlide.imageOffsetY, onUpdateSlide]
  );

  const setImageScale = useCallback(
    (value: number) => {
      onUpdateSlide({
        imageScale: Math.max(0.8, Math.min(3, value)),
      });
    },
    [onUpdateSlide]
  );

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileUpload(file);
  };

  const handleSearchImage = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setSearchResults([]);
    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchQuery)}&per_page=9&client_id=kRvohNk5ba46S32TOaMo9J-slK3gP4IUhPkacGcfFNQ`
      );
      const json = await response.json();
      if (json.results) {
        const urls = json.results.map((r: any) => r.urls.regular);
        setSearchResults(urls);
      }
    } catch {
      console.error("Error fetching images");
    } finally {
      setIsSearching(false);
    }
  };

  const handleGenerateAI = () => {
    setIsGenerating(true);
    const sequence = AI_CAROUSEL_STORIES[aiCategory] || AI_CAROUSEL_STORIES["Fashion & Editorial"];

    setTimeout(() => {
      setGeneratedSequence(sequence);
      setIsGenerating(false);
    }, 1000);
  };

  const handleApplySingleContent = (index: number) => {
    if (!generatedSequence) return;
    const content = generatedSequence[index];
    onUpdateSlide({ title: content.title, subtitle: content.subtitle });
    setGeneratedSequence(null);
  };

  // ── Shared input style ────────────────────────────────────────────────────
  const inputClass =
    "w-full px-3.5 py-3 bg-[#F5F5F5] border border-[#E0E0E0] rounded-md text-[#0A0A0A] text-sm focus:outline-none focus:border-[#0A0A0A] focus:ring-1 focus:ring-[#0A0A0A] transition-colors";

  const labelClass =
    "block text-[10px] tracking-[0.18em] uppercase text-[#888888] mb-2 font-medium";

  const tabButtonClass =
    "flex-1 min-w-[68px] py-3 sm:py-3.5 text-[9px] sm:text-[10px] tracking-[0.14em] sm:tracking-[0.16em] uppercase font-semibold transition-all flex flex-col items-center justify-center gap-0.5";

  const softButtonClass =
    "vv-btn-ghost min-h-10";

  const iconButtonClass =
    "vv-btn-icon h-10 w-10";

  const chipButtonClass =
    "vv-btn-chip";

  return (
    <div className="bg-white rounded-[28px] border border-[#E0E0E0] overflow-hidden shadow-sm">
      {/* ── Tab bar ──────────────────────────────────────────────────────── */}
      <div className="bg-[#0A0A0A] flex">
        {(
          [
            { id: "texto", label: "Texto", icon: "Aa" },
            { id: "imagem", label: "Imagem", icon: "📷" },
            { id: "ia", label: "IA", icon: "✦" },
            { id: "biblioteca", label: "Biblioteca", icon: "≡" },
            { id: "animacao", label: "Anim.", icon: "▶" },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`${tabButtonClass}
              ${tab === t.id
                ? "bg-white text-[#0A0A0A]"
                : "text-[#555] hover:bg-[#111111] hover:text-[#CFCFCF]"
              }`}
          >
            <span className="text-sm sm:text-base leading-none">{t.icon}</span>
            <span className="hidden sm:inline">{t.label}</span>
          </button>
        ))}
      </div>

      {/* ── Carousel header ──────────────────────────────────────────────── */}
      <div className="border-b border-[#EBEBEB] px-4 sm:px-5 py-3 bg-[#FAFAFA] flex items-center justify-between gap-2 sm:gap-3 flex-wrap">
        <div className="flex items-center gap-2 sm:gap-2.5">
          <Layers size={13} className="text-[#888] sm:w-[14px] sm:h-[14px]" />
          <span className="text-[9px] sm:text-[10px] tracking-[0.15em] sm:tracking-[0.18em] uppercase text-[#888] font-medium">
            {project.isCarousel
              ? `Carrossel · ${project.currentSlideIndex + 1}/${project.slides.length}`
              : "Post Único"}
          </span>
        </div>
        <div className="flex w-full sm:w-auto items-center gap-2 flex-wrap sm:flex-nowrap">
          {/* Format toggle */}
          <select
            value={project.outputFormat || "9:16"}
            onChange={(e) => onSetOutputFormat(e.target.value as OutputFormat)}
            className="min-w-[112px] flex-1 sm:flex-none px-3 py-2 text-[9px] sm:text-[10px] bg-white border border-[#E0E0E0] rounded-xl text-[#444] focus:outline-none uppercase tracking-[0.1em] font-semibold"
            title="Formato de exportação"
          >
            <option value="9:16">Story 9:16</option>
            <option value="4:5">Feed 4:5</option>
            <option value="1:1">Post 1:1</option>
            <option value="16:9">Wide 16:9</option>
          </select>
          {/* Carousel toggle */}
          <button
            onClick={() => onSetCarousel(!project.isCarousel)}
            className={`min-h-10 px-3 sm:px-4 py-2 rounded-full text-[8px] sm:text-[9px] tracking-[0.15em] sm:tracking-[0.18em] uppercase font-semibold transition-all whitespace-nowrap
              ${project.isCarousel
                ? "bg-[#0A0A0A] text-white shadow-[0_12px_24px_rgba(10,10,10,0.12)]"
                : "bg-white border border-[#E0E0E0] text-[#888] hover:border-[#0A0A0A] hover:text-[#0A0A0A]"
              }`}
          >
            {project.isCarousel ? "Carrossel ✓" : "Ativar"}
          </button>
          {project.isCarousel && (
            <select
              value={project.slides.length}
              onChange={(e) => onSetSlideCount(Number(e.target.value))}
              className="min-h-10 px-3 py-2 text-[9px] sm:text-[10px] bg-white border border-[#E0E0E0] rounded-xl text-[#444] focus:outline-none"
            >
              {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                <option key={n} value={n}>
                  {n} slides
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* ── Slide tabs (carousel mode) ───────────────────────────────────── */}
      {project.isCarousel && (
        <div className="flex items-center gap-0 border-b border-[#EBEBEB] overflow-x-auto bg-[#F8F8F8]">
          {project.slides.map((_, i) => (
            <button
              key={i}
              onClick={() => onSetCurrentSlide(i)}
              className={`flex-shrink-0 px-4 py-2.5 text-[10px] tracking-[0.12em] uppercase font-semibold transition-all border-b-2
                ${project.currentSlideIndex === i
                  ? "border-[#0A0A0A] text-[#0A0A0A] bg-white"
                  : "border-transparent text-[#888] hover:text-[#444]"
                }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => {
              onSetSlideCount(project.slides.length + 1);
              onSetCurrentSlide(project.slides.length);
            }}
            className="flex-shrink-0 px-3 py-2.5 text-[#AAA] hover:text-[#0A0A0A] transition-colors"
          >
            <Plus size={13} />
          </button>
        </div>
      )}

      {/* ── Tab Content ──────────────────────────────────────────────────── */}
      <div className="p-4 sm:p-5 space-y-5">

        {/* ─── TEXTO TAB ─────────────────────────────────────────────────── */}
        {tab === "texto" && (
          <>
            <div>
              <label className={labelClass}>Título Principal</label>
              <textarea
                value={currentSlide.title}
                onChange={(e) => onUpdateSlide({ title: e.target.value })}
                className={`${inputClass} font-[family-name:var(--font-display)] resize-none`}
                style={{ fontSize: "22px", lineHeight: "1.1", letterSpacing: "0.02em" }}
                rows={3}
                placeholder={"TÍTULO EM\nCAIXA ALTA."}
              />
              <p className="text-[9px] text-[#AAA] mt-1.5">
                Use Enter para quebrar linhas. Tudo será convertido para maiúsculas no template.
              </p>
            </div>

            <div>
              <label className={labelClass}>Subtítulo / Corpo de Texto</label>
              <textarea
                value={currentSlide.subtitle}
                onChange={(e) => onUpdateSlide({ subtitle: e.target.value })}
                className={`${inputClass} resize-none`}
                rows={4}
                placeholder="Frase de apoio com a mensagem da marca..."
              />
            </div>

            <div>
              <label className={labelClass}>Tag / Label (opcional)</label>
              <input
                type="text"
                value={currentSlide.tag || ""}
                onChange={(e) => onUpdateSlide({ tag: e.target.value })}
                className={inputClass}
                placeholder="VERSA VISUAL · 2025 · etc..."
              />
            </div>

            {/* Text Position */}
            <div className="pt-3 border-t border-[#EBEBEB]">
              <label className={labelClass}>Posição do Texto</label>
              <div className="grid grid-cols-3 gap-2">
                {([
                  { pos: "top" as TextPosition, label: "Topo", icon: "▲" },
                  { pos: "center" as TextPosition, label: "Centro", icon: "●" },
                  { pos: "bottom" as TextPosition, label: "Base", icon: "▼" },
                ]).map(({ pos, label, icon }) => (
                  <button
                    key={pos}
                    onClick={() => onUpdateSlide({ textPosition: pos })}
                    className={`flex flex-col items-center gap-1 py-2.5 px-3 rounded-2xl border transition-all text-[10px] font-semibold tracking-[0.08em] uppercase
                      ${(currentSlide.textPosition ?? "bottom") === pos
                        ? "border-[#0A0A0A] bg-[#0A0A0A] text-white shadow-[0_12px_24px_rgba(10,10,10,0.12)]"
                        : "border-[#E0E0E0] bg-[#FAFAFA] text-[#555] hover:border-[#0A0A0A]"
                      }`}
                  >
                    <span className="text-sm leading-none">{icon}</span>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick presets */}
            <div className="pt-3 border-t border-[#EBEBEB]">
              <label className={labelClass}>Presets Rápidos</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { t: "CADA FRAME\nÉ UMA\nDECISÃO.", s: "Fotografia com direção de cena e sensibilidade editorial." },
                  { t: "MESTRIA NÃO\nSE IMPROVISA.", s: "Se constrói quadro a quadro. Hub criativo com intenção." },
                  { t: "A HISTÓRIA\nEXISTE ANTES\nDAS IMAGENS.", s: "Narrativa com imagem é comunicação." },
                ].map((p, i) => (
                  <button
                    key={i}
                    onClick={() => onUpdateSlide({ title: p.t, subtitle: p.s })}
                    className={chipButtonClass}
                  >
                    {p.t.split("\n")[0]}...
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ─── IMAGEM TAB ────────────────────────────────────────────────── */}
        {tab === "imagem" && (
          <>
            {project.isCarousel && (
              <div className="space-y-3 border-b border-[#EBEBEB] pb-4">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.18em] text-[#888] font-semibold mb-1">
                      Upload por slide
                    </p>
                    <p className="text-[9px] text-[#555] leading-relaxed max-w-xl">
                      Cada slide recebe sua imagem. Selecione o slide e carregue sua foto para mantê-la ligada ao frame correspondente.
                    </p>
                  </div>
                  <span className="text-[9px] uppercase tracking-[0.18em] text-[#0A0A0A] font-semibold">
                    {project.slides.length} imagens possíveis
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {project.slides.map((slide, index) => (
                    <button
                      key={slide.id}
                      type="button"
                      onClick={() => onSetCurrentSlide(index)}
                      className={`border rounded-[20px] overflow-hidden text-left transition-all ${project.currentSlideIndex === index
                          ? "border-[#0A0A0A] shadow-[0_12px_28px_rgba(10,10,10,0.12)] -translate-y-0.5"
                          : "border-[#E0E0E0] bg-[#FAFAFA] hover:border-[#888]"
                        }`}
                    >
                      <div className="relative h-24 bg-[#E8E8E8]">
                        {slide.imageUrl ? (
                          <img
                            src={slide.imageUrl}
                            alt={`Slide ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] uppercase tracking-[0.22em] text-[#777] font-semibold">
                            Slide {index + 1}
                          </div>
                        )}
                        <div className="absolute inset-x-0 bottom-0 bg-black/60 text-white text-[8px] uppercase tracking-[0.2em] px-2 py-1 flex items-center justify-between">
                          <span>Slide {index + 1}</span>
                          <span>{slide.imageUrl ? "Imagem" : "Sem imagem"}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className={labelClass}>Importar do Dispositivo</label>
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative w-full h-28 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all
                  ${dragOver
                    ? "border-[#0A0A0A] bg-[#F5F5F5]"
                    : "border-[#D0D0D0] bg-[#FAFAFA] hover:border-[#0A0A0A] hover:bg-[#F5F5F5]"
                  }`}
              >
                <Upload size={20} className="text-[#888] mb-1.5" />
                <p className="text-[11px] text-[#888] tracking-wide">
                  Arrastar & soltar ou <span className="text-[#0A0A0A] font-semibold">clique para selecionar</span>
                </p>
                <p className="text-[9px] text-[#AAA] mt-1">PNG, JPG, WEBP · até 20MB</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={handleFileInputChange}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>URL da Imagem</label>
              <input
                type="text"
                value={currentSlide.imageUrl}
                onChange={(e) => onUpdateSlide({ imageUrl: e.target.value })}
                className={inputClass}
                placeholder="https://..."
              />
            </div>

            <div className="border-t border-[#EBEBEB] pt-4 space-y-4">
              <div className="grid gap-3 sm:grid-cols-[1fr_minmax(160px,220px)] items-end">
                <div>
                  <label className={labelClass}>Posicionamento da imagem</label>
                  <div className="grid grid-cols-[auto_1fr_auto] gap-2 items-center">
                    <button
                      type="button"
                      onClick={() => setImageOffset(0, -5)}
                      className={softButtonClass}
                    >
                      Cima
                    </button>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setImageOffset(-5, 0)}
                        className={softButtonClass}
                      >
                        Esquerda
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageOffset(5, 0)}
                        className={softButtonClass}
                      >
                        Direita
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => setImageOffset(0, 5)}
                      className={softButtonClass}
                    >
                      Baixo
                    </button>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Zoom / Corte</label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setImageScale((currentSlide.imageScale ?? 1) - 0.1)}
                      className={softButtonClass}
                    >
                      -
                    </button>
                    <input
                      type="range"
                      min="0.8"
                      max="3"
                      step="0.05"
                      value={currentSlide.imageScale ?? 1}
                      onChange={(e) => setImageScale(Number(e.target.value))}
                      className="flex-1 accent-[#0A0A0A]"
                    />
                    <button
                      type="button"
                      onClick={() => setImageScale((currentSlide.imageScale ?? 1) + 0.1)}
                      className={softButtonClass}
                    >
                      +
                    </button>
                  </div>
                  <p className="text-[9px] text-[#888] mt-1">
                    Zoom: {(currentSlide.imageScale ?? 1).toFixed(2)}× • Use o corte para ajustar o enquadramento.
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-[#888] font-semibold mb-2">
                    Corpo do ajuste
                  </p>
                  <div className="rounded-xl border border-[#E0E0E0] overflow-hidden bg-[#F8F8F8] p-3">
                    <div className="flex items-center justify-between text-[9px] text-[#555]">
                      <span>Horizontal: {(currentSlide.imageOffsetX ?? 0).toFixed(0)}%</span>
                      <span>Vertical: {(currentSlide.imageOffsetY ?? 0).toFixed(0)}%</span>
                    </div>
                    <div className="mt-3 grid gap-2">
                      <div className="flex items-center justify-between text-[9px] text-[#888]">
                        <span>Esquerda / Direita</span>
                        <span>{(currentSlide.imageOffsetX ?? 0).toFixed(0)}%</span>
                      </div>
                      <input
                        type="range"
                        min="-45"
                        max="45"
                        step="1"
                        value={currentSlide.imageOffsetX ?? 0}
                        onChange={(e) => onUpdateSlide({ imageOffsetX: Number(e.target.value) })}
                        className="accent-[#0A0A0A]"
                      />
                      <div className="flex items-center justify-between text-[9px] text-[#888]">
                        <span>Topo / Base</span>
                        <span>{(currentSlide.imageOffsetY ?? 0).toFixed(0)}%</span>
                      </div>
                      <input
                        type="range"
                        min="-45"
                        max="45"
                        step="1"
                        value={currentSlide.imageOffsetY ?? 0}
                        onChange={(e) => onUpdateSlide({ imageOffsetY: Number(e.target.value) })}
                        className="accent-[#0A0A0A]"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-[#888] font-semibold mb-2">
                    Status de upload
                  </p>
                  <div className="rounded-xl border border-[#E0E0E0] bg-[#F8F8F8] p-3 text-[11px] leading-relaxed text-[#444]">
                    <p className="font-semibold mb-2">Slide {project.currentSlideIndex + 1}</p>
                    <p>{currentSlide.imageUrl ? "Imagem vinculada ao slide atual." : "Nenhuma imagem carregada para este slide."}</p>
                    <p className="mt-2 text-[10px] text-[#888]">
                      Ao alternar slides, o editor mantém a correspondência entre Slide e Imagem.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-[#EBEBEB] pt-4">
              <div className="flex items-center gap-2 mb-2">
                <Droplet size={14} className="text-[#0A0A0A]" />
                <label className={labelClass + " !mb-0"}>
                  Overlay Escuro · {currentSlide.overlayOpacity ?? 70}%
                </label>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={currentSlide.overlayOpacity ?? 70}
                onChange={(e) => onUpdateSlide({ overlayOpacity: Number(e.target.value) })}
                className="w-full accent-[#0A0A0A]"
              />
              <div className="flex justify-between text-[9px] text-[#AAA] mt-1">
                <span>Transparente</span>
                <span>Escuro</span>
              </div>
              <p className="text-[10px] text-[#888] mt-2 leading-relaxed">
                Ajuste o contraste entre imagem e tipografia. O overlay preserva a nitidez do texto e mantém a foto como pano de fundo.
              </p>
            </div>

            {currentSlide.imageUrl && (
              <div className="relative rounded-lg overflow-hidden bg-[#F0F0F0]" style={{ height: "160px" }}>
                <img
                  src={currentSlide.imageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: `rgba(10, 10, 10, ${(currentSlide.overlayOpacity ?? 70) / 100})`,
                  }}
                />
                <button
                  onClick={() => onUpdateSlide({ imageUrl: "" })}
                  className="absolute top-2 right-2 h-9 w-9 rounded-full border border-white/20 bg-black/70 flex items-center justify-center text-white hover:bg-black transition-colors z-10"
                >
                  <X size={13} />
                </button>
                <div className="absolute bottom-0 left-0 right-0 px-3 py-1.5 bg-black/50 z-10">
                  <p className="text-[9px] text-white/90 tracking-wide font-medium">
                    Preview com overlay {currentSlide.overlayOpacity ?? 70}%
                  </p>
                </div>
              </div>
            )}

            {!currentSlide.imageUrl && (
              <div className="rounded-xl border border-[#E0E0E0] bg-[#FFFAF0] p-4 text-[11px] text-[#665222]">
                <p className="font-semibold mb-2">Faltam imagens</p>
                <p>
                  {project.slides.filter((slide) => !slide.imageUrl).length} slide(s) ainda não têm imagem. Garanta que cada slide tenha imagem antes de exportar.
                </p>
              </div>
            )}
          </>
        )}

        {/* ─── IA TAB ────────────────────────────────────────────────────── */}
        {tab === "ia" && (
          <>
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={15} className="text-[#0A0A0A]" />
                <p className="text-sm font-semibold text-[#0A0A0A]">
                  Gerador de Conteúdo VERSAVISUAL
                </p>
              </div>
              <p className="text-[11px] text-[#888] leading-relaxed mb-4">
                {project.isCarousel
                  ? "Gera uma sequência de storytelling estruturada para carrosséis — cada slide segue uma progressão narrativa baseada nos 6 pilares de conteúdo."
                  : "Gera texto no tom editorial da VERSAVISUAL — direto, intencional e confiante. Título impactante + subtítulo persuasivo."}
              </p>
            </div>

            <div>
              <label className={labelClass}>Pilar de Conteúdo</label>
              <div className="grid grid-cols-1 gap-2">
                {Object.keys(AI_CAROUSEL_STORIES).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setAiCategory(cat)}
                    className={`text-left px-4 py-2.5 rounded-2xl border text-sm transition-all
                      ${aiCategory === cat
                        ? "border-[#0A0A0A] bg-[#0A0A0A] text-white shadow-[0_12px_24px_rgba(10,10,10,0.12)]"
                        : "border-[#E0E0E0] bg-[#FAFAFA] text-[#444] hover:border-[#0A0A0A]"
                      }`}
                  >
                    <span className="font-medium">{cat}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerateAI}
              disabled={isGenerating}
              className="vv-btn w-full min-h-12 text-sm tracking-[0.12em]"
            >
              {isGenerating ? (
                <>
                  <RefreshCw size={15} className="animate-spin" />
                  Gerando Storytelling...
                </>
              ) : (
                <>
                  <Sparkles size={15} />
                  {project.isCarousel ? "Gerar Sequência" : "Gerar Conteúdo"}
                </>
              )}
            </button>

            {generatedSequence && (
              <div className="rounded-lg border-2 border-[#0A0A0A] bg-white overflow-hidden">
                <div className="bg-[#0A0A0A] px-4 py-2.5">
                  <p className="text-[10px] tracking-[0.2em] uppercase text-white/70 font-semibold">
                    {project.isCarousel ? `Storytelling · ${generatedSequence.length} Slides` : "Conteúdo Gerado"}
                  </p>
                </div>

                <div className="max-h-[400px] overflow-y-auto">
                  {generatedSequence.map((content, idx) => (
                    <div
                      key={idx}
                      className={`p-4 border-b border-[#EBEBEB] last:border-0 ${idx === project.currentSlideIndex && project.isCarousel ? "bg-[#FFFAED]" : ""}`}
                    >
                      <p className="text-[9px] tracking-[0.15em] uppercase text-[#888] mb-2 font-semibold">
                        {content.progression}
                      </p>
                      <p
                        className="font-[family-name:var(--font-display)] text-[#0A0A0A] uppercase leading-tight mb-2"
                        style={{ fontSize: "16px", letterSpacing: "0.02em", whiteSpace: "pre-line" }}
                      >
                        {content.title}
                      </p>
                      <p className="text-[11px] text-[#555] leading-relaxed mb-2">
                        {content.subtitle}
                      </p>
                      <button
                        onClick={() => handleApplySingleContent(idx)}
                        className="text-[9px] tracking-[0.12em] uppercase text-[#0A0A0A] font-semibold hover:underline"
                      >
                        Aplicar este slide →
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex border-t border-[#EBEBEB]">
                  <button
                    onClick={() => {
                      const content = generatedSequence[project.currentSlideIndex % generatedSequence.length];
                      onUpdateSlide({ title: content.title, subtitle: content.subtitle });
                      setGeneratedSequence(null);
                    }}
                    className="vv-btn rounded-none border-0 shadow-none hover:translate-y-0"
                  >
                    {project.isCarousel
                      ? `Aplicar Slide ${project.currentSlideIndex + 1}`
                      : "Aplicar ao Template"}
                  </button>
                  <button
                    onClick={handleGenerateAI}
                    className="vv-btn-secondary rounded-none border-y-0 border-r-0 border-l border-[#EBEBEB] shadow-none hover:translate-y-0"
                  >
                    <RefreshCw size={12} />
                  </button>
                </div>
              </div>
            )}

            <div className="bg-[#F8F8F8] rounded-lg p-4 border border-[#EBEBEB]">
              <p className="text-[10px] tracking-[0.15em] uppercase text-[#888] font-semibold mb-1.5">
                Sobre o gerador
              </p>
              <p className="text-[11px] text-[#888] leading-relaxed">
                Conteúdo curado com storytelling estruturado baseado na identidade VERSAVISUAL —
                hub criativo de fotografia, storymaking, videomaking e direção. Tom direto, intencional e confiante.
                {project.isCarousel && " Cada slide do carrossel segue uma progressão narrativa baseada nos 6 pilares."}
              </p>
            </div>
          </>
        )}

        {/* ─── BIBLIOTECA TAB ────────────────────────────────────────────── */}
        {tab === "biblioteca" && (() => {
          const allCarouselPilares = ["Todos", ...Array.from(new Set(CONTENT_CAROUSELS.map((c) => c.pilar)))];
          const allSinglePilares = ["Todos", ...Array.from(new Set(CONTENT_SINGLES.map((s) => s.pilar)))];
          const filteredCarousels = bibFilter === "Todos"
            ? CONTENT_CAROUSELS
            : CONTENT_CAROUSELS.filter((c) => c.pilar === bibFilter);
          const filteredSingles = bibFilter === "Todos"
            ? CONTENT_SINGLES
            : CONTENT_SINGLES.filter((s) => s.pilar === bibFilter);

          return (
            <>
              {/* Header */}
              <div className="flex items-center gap-2 mb-1">
                <BookOpen size={15} className="text-[#0A0A0A]" />
                <p className="text-sm font-semibold text-[#0A0A0A]">
                  Biblioteca de Conteúdo V3
                </p>
              </div>
              <p className="text-[11px] text-[#888] leading-relaxed mb-4">
                {CONTENT_CAROUSELS.length} carrosséis e {CONTENT_SINGLES.length} posts únicos prontos para aplicar ao seu template.
                Clique em um conteúdo para aplicá-lo diretamente.
              </p>

              {/* Mode toggle */}
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => { setBibMode("carousel"); setBibFilter("Todos"); }}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-2xl border text-[10px] font-semibold tracking-[0.1em] uppercase transition-all
                    ${bibMode === "carousel"
                      ? "border-[#0A0A0A] bg-[#0A0A0A] text-white shadow-[0_12px_24px_rgba(10,10,10,0.12)]"
                      : "border-[#E0E0E0] bg-[#FAFAFA] text-[#555] hover:border-[#0A0A0A]"
                    }`}
                >
                  <LayoutGrid size={12} />
                  Carrosséis ({CONTENT_CAROUSELS.length})
                </button>
                <button
                  onClick={() => { setBibMode("single"); setBibFilter("Todos"); }}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-2xl border text-[10px] font-semibold tracking-[0.1em] uppercase transition-all
                    ${bibMode === "single"
                      ? "border-[#0A0A0A] bg-[#0A0A0A] text-white shadow-[0_12px_24px_rgba(10,10,10,0.12)]"
                      : "border-[#E0E0E0] bg-[#FAFAFA] text-[#555] hover:border-[#0A0A0A]"
                    }`}
                >
                  <ImageIcon size={12} />
                  Posts Únicos ({CONTENT_SINGLES.length})
                </button>
              </div>

              {/* Pilar filter */}
              <div className="mb-4">
                <p className="text-[9px] tracking-[0.15em] uppercase text-[#888] font-semibold mb-2">Filtrar por pilar</p>
                <div className="flex flex-wrap gap-1.5">
                  {(bibMode === "carousel" ? allCarouselPilares : allSinglePilares).map((pilar) => (
                    <button
                      key={pilar}
                      onClick={() => setBibFilter(pilar)}
                      className={`px-2.5 py-1 rounded-full text-[9px] tracking-[0.08em] uppercase font-semibold transition-all
                        ${bibFilter === pilar
                          ? "bg-[#0A0A0A] text-white"
                          : "bg-[#F2F2F2] border border-[#E0E0E0] text-[#555] hover:bg-[#E0E0E0]"
                        }`}
                    >
                      {pilar}
                    </button>
                  ))}
                </div>
              </div>

              {/* Carousel cards */}
              {bibMode === "carousel" && (
                <div className="space-y-2">
                  {filteredCarousels.map((carousel) => {
                    const isExpanded = expandedCarousel === carousel.id;
                    return (
                      <div
                        key={carousel.id}
                        className="border border-[#E0E0E0] rounded-lg overflow-hidden"
                      >
                        {/* Card header */}
                        <div className="bg-[#FAFAFA] px-4 py-3">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-[8px] tracking-[0.15em] uppercase bg-[#0A0A0A] text-white px-2 py-0.5 rounded-full font-semibold">
                                  {carousel.slideCount} slides
                                </span>
                                <span className="text-[8px] tracking-[0.12em] uppercase text-[#888] font-medium truncate">
                                  {carousel.pilar}
                                </span>
                              </div>
                              <p className="text-[11px] font-semibold text-[#0A0A0A] leading-snug line-clamp-2">
                                {carousel.tema}
                              </p>
                            </div>
                            <button
                              onClick={() => setExpandedCarousel(isExpanded ? null : carousel.id)}
                              className="vv-btn-icon h-8 w-8 rounded-lg"
                            >
                              {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                            </button>
                          </div>

                          <button
                            onClick={() => {
                              onApplyCarousel(carousel.slides);
                              setTab("texto");
                            }}
                            className="vv-btn mt-2.5 w-full min-h-10 text-[9px]"
                          >
                            Aplicar Carrossel Completo →
                          </button>
                        </div>

                        {/* Expanded slides preview */}
                        {isExpanded && (
                          <div className="border-t border-[#E0E0E0] divide-y divide-[#F0F0F0]">
                            {carousel.slides.map((slide, idx) => (
                              <div key={idx} className="px-4 py-3 bg-white">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex-1 min-w-0">
                                    <p className="text-[8px] tracking-[0.12em] uppercase text-[#AAA] font-semibold mb-1">
                                      Slide {idx + 1}{slide.cta ? ` · CTA` : ""}
                                    </p>
                                    <p
                                      className="font-[family-name:var(--font-display)] text-[#0A0A0A] uppercase leading-tight mb-1"
                                      style={{ fontSize: "12px", letterSpacing: "0.02em", whiteSpace: "pre-line" }}
                                    >
                                      {slide.title}
                                    </p>
                                    <p className="text-[10px] text-[#777] leading-relaxed line-clamp-2">
                                      {slide.subtitle}
                                    </p>
                                    {slide.cta && (
                                      <p className="mt-1 text-[8px] tracking-[0.1em] uppercase text-[#0A0A0A] font-bold">
                                        CTA: {slide.cta}
                                      </p>
                                    )}
                                  </div>
                                  <button
                                    onClick={() => {
                                      onUpdateSlide({ title: slide.title, subtitle: slide.subtitle, tag: slide.tag ?? "VERSAVISUAL" });
                                      setTab("texto");
                                    }}
                                    className="vv-btn-secondary flex-shrink-0 px-2.5 py-1 min-h-8 text-[8px]"
                                  >
                                    Usar
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Single cards */}
              {bibMode === "single" && (
                <div className="space-y-2">
                  {filteredSingles.map((single) => (
                    <div
                      key={single.id}
                      className="border border-[#E0E0E0] rounded-lg overflow-hidden bg-[#FAFAFA]"
                    >
                      <div className="px-4 py-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-[8px] tracking-[0.12em] uppercase text-[#888] font-semibold mb-1.5">
                              {single.pilar}
                            </p>
                            <p
                              className="font-[family-name:var(--font-display)] text-[#0A0A0A] uppercase leading-tight mb-1.5"
                              style={{ fontSize: "12px", letterSpacing: "0.02em", whiteSpace: "pre-line" }}
                            >
                              {single.title}
                            </p>
                            <p className="text-[10px] text-[#777] leading-relaxed line-clamp-2 mb-1.5">
                              {single.subtitle}
                            </p>
                            <p className="text-[8px] tracking-[0.1em] uppercase text-[#AAA] font-semibold">
                              CTA: {single.cta}
                            </p>
                          </div>
                          <button
                            onClick={() => {
                              onUpdateSlide({ title: single.title, subtitle: single.subtitle, tag: "VERSAVISUAL" });
                              setTab("texto");
                            }}
                            className="vv-btn flex-shrink-0 px-3 py-2 min-h-10 text-[9px]"
                          >
                            Aplicar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          );
        })()}

        {/* ─── ANIMAÇÃO TAB ──────────────────────────────────────────────── */}
        {tab === "animacao" && (
          <>
            <div className="flex items-center gap-2 mb-1">
              <Film size={15} className="text-[#0A0A0A]" />
              <p className="text-sm font-semibold text-[#0A0A0A]">
                Animação de Texto
              </p>
            </div>
            <p className="text-[11px] text-[#888] leading-relaxed mb-4">
              Animações aplicadas apenas ao texto. A imagem permanece estática, preservando qualidade e foco editorial.
            </p>

            <div className="grid gap-3 sm:grid-cols-3">
              {([
                {
                  key: "title",
                  label: "Título",
                  value: currentSlide.titleAnimation ?? project.animation,
                  delay: currentSlide.titleAnimationDelay ?? 0,
                  duration: currentSlide.titleAnimationDuration ?? 1.1,
                },
                {
                  key: "subtitle",
                  label: "Subtítulo",
                  value: currentSlide.subtitleAnimation ?? project.animation,
                  delay: currentSlide.subtitleAnimationDelay ?? 0.2,
                  duration: currentSlide.subtitleAnimationDuration ?? 1.1,
                },
                {
                  key: "tag",
                  label: "Tag",
                  value: currentSlide.tagAnimation ?? project.animation,
                  delay: currentSlide.tagAnimationDelay ?? 0.4,
                  duration: currentSlide.tagAnimationDuration ?? 0.9,
                },
              ] as const).map(({ key, label, value, delay, duration }) => (
                <div key={key} className="rounded-3xl border border-[#E0E0E0] bg-[#FAFAFA] p-4">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-[#888] font-semibold mb-3">
                    {label}
                  </p>
                  <select
                    value={value}
                    onChange={(e) =>
                      onUpdateSlide({
                        [`${key}Animation`]: e.target.value as AnimationType,
                      } as Partial<SlideData>)
                    }
                    className="w-full px-3.5 py-2 rounded-lg border border-[#D0D0D0] bg-white text-[#0A0A0A] text-sm"
                  >
                    {ANIMATIONS.map((anim) => (
                      <option key={anim.id} value={anim.id}>
                        {anim.label}
                      </option>
                    ))}
                  </select>

                  <div className="mt-4 space-y-3">
                    <div>
                      <label className="text-[9px] uppercase tracking-[0.18em] text-[#888] font-semibold">
                        Delay
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={delay}
                        onChange={(e) =>
                          onUpdateSlide({
                            [`${key}AnimationDelay`]: Number(e.target.value),
                          } as Partial<SlideData>)
                        }
                        className="w-full accent-[#0A0A0A] mt-2"
                      />
                      <p className="text-[9px] text-[#888] mt-1">{delay.toFixed(2)}s</p>
                    </div>
                    <div>
                      <label className="text-[9px] uppercase tracking-[0.18em] text-[#888] font-semibold">
                        Duração
                      </label>
                      <input
                        type="range"
                        min="0.6"
                        max="2.5"
                        step="0.05"
                        value={duration}
                        onChange={(e) =>
                          onUpdateSlide({
                            [`${key}AnimationDuration`]: Number(e.target.value),
                          } as Partial<SlideData>)
                        }
                        className="w-full accent-[#0A0A0A] mt-2"
                      />
                      <p className="text-[9px] text-[#888] mt-1">{duration.toFixed(2)}s</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-[#EBEBEB] pt-4 space-y-3">
              <p className="text-[10px] uppercase tracking-[0.18em] text-[#888] font-semibold">
                Presets de Animação
              </p>
              <div className="grid gap-2 sm:grid-cols-3">
                <button
                  type="button"
                  onClick={() =>
                    onUpdateSlide({
                      titleAnimation: "slide-up",
                      subtitleAnimation: "fade-in",
                      tagAnimation: "none",
                      titleAnimationDelay: 0,
                      subtitleAnimationDelay: 0.15,
                      tagAnimationDelay: 0.35,
                      titleAnimationDuration: 1.1,
                      subtitleAnimationDuration: 1.1,
                      tagAnimationDuration: 0.9,
                    })
                  }
                  className="rounded-2xl border border-[#E0E0E0] bg-white py-3 px-4 text-left text-[10px] uppercase tracking-[0.18em] text-[#0A0A0A] hover:border-[#0A0A0A] transition-colors"
                >
                  Entrada Suave
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onUpdateSlide({
                      titleAnimation: "reveal",
                      subtitleAnimation: "fade-in",
                      tagAnimation: "drift",
                      titleAnimationDelay: 0,
                      subtitleAnimationDelay: 0.2,
                      tagAnimationDelay: 0.4,
                      titleAnimationDuration: 1.2,
                      subtitleAnimationDuration: 1,
                      tagAnimationDuration: 0.9,
                    })
                  }
                  className="rounded-2xl border border-[#E0E0E0] bg-white py-3 px-4 text-left text-[10px] uppercase tracking-[0.18em] text-[#0A0A0A] hover:border-[#0A0A0A] transition-colors"
                >
                  Reveal Editorial
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onUpdateSlide({
                      titleAnimation: "fade-in",
                      subtitleAnimation: "zoom-out",
                      tagAnimation: "none",
                      titleAnimationDelay: 0,
                      subtitleAnimationDelay: 0.25,
                      tagAnimationDelay: 0.4,
                      titleAnimationDuration: 1,
                      subtitleAnimationDuration: 1.2,
                      tagAnimationDuration: 0.9,
                    })
                  }
                  className="rounded-2xl border border-[#E0E0E0] bg-white py-3 px-4 text-left text-[10px] uppercase tracking-[0.18em] text-[#0A0A0A] hover:border-[#0A0A0A] transition-colors"
                >
                  Sequência Editorial
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── Slide actions (carousel) ─────────────────────────────────────── */}
      {project.isCarousel && (
        <div className="px-4 sm:px-5 pb-5 pt-3 border-t border-[#EBEBEB] flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onSetCurrentSlide(Math.max(0, project.currentSlideIndex - 1))}
              disabled={project.currentSlideIndex === 0}
              className={iconButtonClass}
            >
              <ChevronLeft size={14} />
            </button>
            <span className="text-[10px] text-[#888] tracking-wide">
              {project.currentSlideIndex + 1} / {project.slides.length}
            </span>
            <button
              onClick={() =>
                onSetCurrentSlide(Math.min(project.slides.length - 1, project.currentSlideIndex + 1))
              }
              disabled={project.currentSlideIndex === project.slides.length - 1}
              className={iconButtonClass}
            >
              <ChevronRight size={14} />
            </button>
          </div>

          <div className="flex w-full sm:w-auto items-center gap-2">
            <button
              onClick={onDuplicateSlide}
              className="vv-btn-secondary min-h-10 flex-1 sm:flex-none"
              title="Duplicar slide atual"
            >
              <Copy size={11} />
              Duplicar
            </button>
            <button
              onClick={onDeleteSlide}
              disabled={project.slides.length <= 1}
              className="vv-btn-danger min-h-10 flex-1 sm:flex-none"
              title="Deletar slide atual"
            >
              <Trash2 size={11} />
              Deletar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
