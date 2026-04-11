import { useState, useRef, useCallback } from "react";
import {
  Search,
  Upload,
  Sparkles,
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
import { ProjectState, SlideData, OutputFormat } from "../App";
import {
  CONTENT_CAROUSELS,
  CONTENT_SINGLES,
  type ContentSlide,
} from "../data/contentLibrary";

// ── AI Content Database — NEXO 6 Pilares de Conteúdo ─────────────────
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
      title: "A NEXO\nVAI ONDE A\nHISTÓRIA\nACONTECE.",
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

// ── Props ─────────────────────────────────────────────────────────────────────
interface Props {
  project: ProjectState;
  currentSlide: SlideData;
  onUpdateSlide: (data: Partial<SlideData>) => void;
  onSetCurrentSlide: (index: number) => void;
  onSetSlideCount: (count: number) => void;
  onSetCarousel: (isCarousel: boolean) => void;
  onDuplicateSlide: () => void;
  onDeleteSlide: () => void;
  onSetOutputFormat: (format: OutputFormat) => void;
  onApplyCarousel: (slides: ContentSlide[]) => void;
  onMultipleImages: (files: FileList) => void;
}

type Tab = "texto" | "imagem" | "ia" | "biblioteca";
type TextPanel = "titulo" | "subtitulo";

// ── 3x3 grid positions for image (Group 2) ───────────────────────────────────
const IMAGE_POSITIONS = [
  { label: "↖", x: -100, y: -100, title: "Topo esquerda" },
  { label: "↑",  x: 0,    y: -100, title: "Topo centro" },
  { label: "↗", x: 100,  y: -100, title: "Topo direita" },
  { label: "←", x: -100, y: 0,    title: "Meio esquerda" },
  { label: "●",  x: 0,    y: 0,    title: "Centro" },
  { label: "→", x: 100,  y: 0,    title: "Meio direita" },
  { label: "↙", x: -100, y: 100,  title: "Base esquerda" },
  { label: "↓",  x: 0,    y: 100,  title: "Base centro" },
  { label: "↘", x: 100,  y: 100,  title: "Base direita" },
];

export function TemplateEditor({
  project,
  currentSlide,
  onUpdateSlide,
  onSetCurrentSlide,
  onSetSlideCount,
  onSetCarousel,
  onDuplicateSlide,
  onDeleteSlide,
  onSetOutputFormat,
  onApplyCarousel,
  onMultipleImages,
}: Props) {
  const [tab, setTab] = useState<Tab>("texto");
  const [textPanel, setTextPanel] = useState<TextPanel>("titulo");
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

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    if (files.length === 1) {
      handleFileUpload(files[0]);
    } else {
      onMultipleImages(files);
    }
    // Reset input so the same files can be re-selected
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;
    if (files.length === 1) {
      handleFileUpload(files[0]);
    } else {
      onMultipleImages(files);
    }
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
    const sequence = AI_CAROUSEL_STORIES[aiCategory] || AI_CAROUSEL_STORIES["Portfólio"];
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

  // ── Shared styles ─────────────────────────────────────────────────────────
  const inputClass =
    "w-full px-3.5 py-3 bg-[#F5F5F5] border border-[#E0E0E0] rounded-md text-[#0A0A0A] text-sm focus:outline-none focus:border-[#0A0A0A] focus:ring-1 focus:ring-[#0A0A0A] transition-colors";

  const labelClass =
    "block text-[10px] tracking-[0.18em] uppercase text-[#888888] mb-2 font-medium";

  const tabButtonClass =
    "flex-1 min-w-[68px] py-3 sm:py-3.5 text-[9px] sm:text-[10px] tracking-[0.14em] sm:tracking-[0.16em] uppercase font-semibold transition-all flex flex-col items-center justify-center gap-0.5";

  const chipButtonClass = "vv-btn-chip";

  // ── Text positioning helpers (Group 5/6) ──────────────────────────────────
  const setTitleAlign = (align: "left" | "center" | "right") => {
    const h = align === "left" ? 10 : align === "center" ? 50 : 90;
    onUpdateSlide({ titleAlign: align, titleH: h });
  };

  const setSubtitleAlign = (align: "left" | "center" | "right") => {
    const h = align === "left" ? 10 : align === "center" ? 50 : 90;
    onUpdateSlide({ subtitleAlign: align, subtitleH: h });
  };

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
            {/* Sub-panel toggle: Título / Subtítulo */}
            <div className="flex gap-1 bg-[#F0F0F0] rounded-2xl p-1">
              <button
                onClick={() => setTextPanel("titulo")}
                className={`flex-1 py-2 rounded-xl text-[10px] font-semibold tracking-[0.12em] uppercase transition-all
                  ${textPanel === "titulo"
                    ? "bg-white text-[#0A0A0A] shadow-sm"
                    : "text-[#888] hover:text-[#444]"
                  }`}
              >
                Título
              </button>
              <button
                onClick={() => setTextPanel("subtitulo")}
                className={`flex-1 py-2 rounded-xl text-[10px] font-semibold tracking-[0.12em] uppercase transition-all
                  ${textPanel === "subtitulo"
                    ? "bg-white text-[#0A0A0A] shadow-sm"
                    : "text-[#888] hover:text-[#444]"
                  }`}
              >
                Subtítulo
              </button>
            </div>

            {/* ─ TÍTULO PANEL ─ */}
            {textPanel === "titulo" && (
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
                  <label className={labelClass}>Tag / Label (opcional)</label>
                  <input
                    type="text"
                    value={currentSlide.tag || ""}
                    onChange={(e) => onUpdateSlide({ tag: e.target.value })}
                    className={inputClass}
                    placeholder="NEXO · 2025 · etc..."
                  />
                </div>

                {/* Posição H+V */}
                <div className="pt-3 border-t border-[#EBEBEB] space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className={labelClass} style={{ marginBottom: 0 }}>Posição Horizontal</label>
                      <span className="text-[11px] font-semibold text-[#0A0A0A] tabular-nums">
                        {currentSlide.titleH ?? 50}%
                      </span>
                    </div>
                    <div className="flex gap-2 mb-2">
                      {(["left", "center", "right"] as const).map((a) => (
                        <button
                          key={a}
                          onClick={() => setTitleAlign(a)}
                          className={`flex-1 py-1.5 rounded-lg border text-[9px] font-semibold uppercase tracking-[0.08em] transition-all
                            ${(currentSlide.titleAlign ?? "center") === a
                              ? "border-[#0A0A0A] bg-[#0A0A0A] text-white"
                              : "border-[#E0E0E0] bg-[#FAFAFA] text-[#555] hover:border-[#0A0A0A]"
                            }`}
                        >
                          {a === "left" ? "⬅ Esq" : a === "center" ? "● Centro" : "Dir ➡"}
                        </button>
                      ))}
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      step={1}
                      value={currentSlide.titleH ?? 50}
                      onChange={(e) => onUpdateSlide({ titleH: Number(e.target.value) })}
                      className="w-full h-[3px] accent-[#0A0A0A] cursor-pointer"
                    />
                    <div className="flex justify-between text-[9px] text-[#AAA] mt-1">
                      <span>Esquerda</span><span>Centro</span><span>Direita</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className={labelClass} style={{ marginBottom: 0 }}>Posição Vertical</label>
                      <span className="text-[11px] font-semibold text-[#0A0A0A] tabular-nums">
                        {currentSlide.titleV ?? 10}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      step={1}
                      value={currentSlide.titleV ?? 10}
                      onChange={(e) => onUpdateSlide({ titleV: Number(e.target.value) })}
                      className="w-full h-[3px] accent-[#0A0A0A] cursor-pointer"
                    />
                    <div className="flex justify-between text-[9px] text-[#AAA] mt-1">
                      <span>Topo</span><span>Centro</span><span>Base</span>
                    </div>
                  </div>
                </div>

                {/* Tamanho da fonte */}
                <div className="pt-3 border-t border-[#EBEBEB]">
                  <div className="flex items-center justify-between mb-2">
                    <label className={labelClass} style={{ marginBottom: 0 }}>Tamanho do Título</label>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onUpdateSlide({ titleFontScale: Math.max(0.75, (currentSlide.titleFontScale ?? 1) - 0.05) })}
                        className="w-7 h-7 rounded-lg border border-[#E0E0E0] bg-[#FAFAFA] text-[#555] text-sm font-bold hover:border-[#0A0A0A] hover:text-[#0A0A0A] transition-all flex items-center justify-center leading-none"
                      >−</button>
                      <span className="text-[11px] font-semibold text-[#0A0A0A] tabular-nums min-w-[36px] text-center">
                        {Math.round((currentSlide.titleFontScale ?? 1) * 100)}%
                      </span>
                      <button
                        onClick={() => onUpdateSlide({ titleFontScale: Math.min(1.4, (currentSlide.titleFontScale ?? 1) + 0.05) })}
                        className="w-7 h-7 rounded-lg border border-[#E0E0E0] bg-[#FAFAFA] text-[#555] text-sm font-bold hover:border-[#0A0A0A] hover:text-[#0A0A0A] transition-all flex items-center justify-center leading-none"
                      >+</button>
                    </div>
                  </div>
                  <input
                    type="range"
                    min={75}
                    max={140}
                    step={5}
                    value={Math.round((currentSlide.titleFontScale ?? 1) * 100)}
                    onChange={(e) => onUpdateSlide({ titleFontScale: Number(e.target.value) / 100 })}
                    className="w-full h-[3px] accent-[#0A0A0A] cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] text-[#AAA] mt-1">
                    <span>75%</span><span>Padrão</span><span>140%</span>
                  </div>
                </div>

                {/* Cor do título */}
                <div className="pt-3 border-t border-[#EBEBEB]">
                  <label className={labelClass}>Cor do Título</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={(() => {
                        const c = currentSlide.titleColor ?? "rgba(255,255,255,1)";
                        const m = c.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
                        if (!m) return "#ffffff";
                        return `#${Number(m[1]).toString(16).padStart(2,"0")}${Number(m[2]).toString(16).padStart(2,"0")}${Number(m[3]).toString(16).padStart(2,"0")}`;
                      })()}
                      onChange={(e) => {
                        const hex = e.target.value;
                        const r = parseInt(hex.slice(1,3),16);
                        const g = parseInt(hex.slice(3,5),16);
                        const b = parseInt(hex.slice(5,7),16);
                        onUpdateSlide({ titleColor: `rgba(${r},${g},${b},1)` });
                      }}
                      className="w-10 h-10 rounded-lg border border-[#E0E0E0] cursor-pointer p-0.5"
                    />
                    <div className="flex gap-1.5 flex-wrap">
                      {["rgba(255,255,255,1)","rgba(255,255,255,0.75)","rgba(10,10,10,1)","rgba(200,200,200,1)"].map((c) => (
                        <button
                          key={c}
                          onClick={() => onUpdateSlide({ titleColor: c })}
                          className="w-7 h-7 rounded-full border-2 transition-all"
                          style={{
                            background: c,
                            borderColor: (currentSlide.titleColor ?? "rgba(255,255,255,1)") === c ? "#0A0A0A" : "#E0E0E0",
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Presets rápidos */}
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

            {/* ─ SUBTÍTULO PANEL ─ */}
            {textPanel === "subtitulo" && (
              <>
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

                {/* Posição H+V */}
                <div className="pt-3 border-t border-[#EBEBEB] space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className={labelClass} style={{ marginBottom: 0 }}>Posição Horizontal</label>
                      <span className="text-[11px] font-semibold text-[#0A0A0A] tabular-nums">
                        {currentSlide.subtitleH ?? 50}%
                      </span>
                    </div>
                    <div className="flex gap-2 mb-2">
                      {(["left", "center", "right"] as const).map((a) => (
                        <button
                          key={a}
                          onClick={() => setSubtitleAlign(a)}
                          className={`flex-1 py-1.5 rounded-lg border text-[9px] font-semibold uppercase tracking-[0.08em] transition-all
                            ${(currentSlide.subtitleAlign ?? "center") === a
                              ? "border-[#0A0A0A] bg-[#0A0A0A] text-white"
                              : "border-[#E0E0E0] bg-[#FAFAFA] text-[#555] hover:border-[#0A0A0A]"
                            }`}
                        >
                          {a === "left" ? "⬅ Esq" : a === "center" ? "● Centro" : "Dir ➡"}
                        </button>
                      ))}
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      step={1}
                      value={currentSlide.subtitleH ?? 50}
                      onChange={(e) => onUpdateSlide({ subtitleH: Number(e.target.value) })}
                      className="w-full h-[3px] accent-[#0A0A0A] cursor-pointer"
                    />
                    <div className="flex justify-between text-[9px] text-[#AAA] mt-1">
                      <span>Esquerda</span><span>Centro</span><span>Direita</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className={labelClass} style={{ marginBottom: 0 }}>Posição Vertical</label>
                      <span className="text-[11px] font-semibold text-[#0A0A0A] tabular-nums">
                        {currentSlide.subtitleV ?? 85}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      step={1}
                      value={currentSlide.subtitleV ?? 85}
                      onChange={(e) => onUpdateSlide({ subtitleV: Number(e.target.value) })}
                      className="w-full h-[3px] accent-[#0A0A0A] cursor-pointer"
                    />
                    <div className="flex justify-between text-[9px] text-[#AAA] mt-1">
                      <span>Topo</span><span>Centro</span><span>Base</span>
                    </div>
                  </div>
                </div>

                {/* Tamanho da fonte */}
                <div className="pt-3 border-t border-[#EBEBEB]">
                  <div className="flex items-center justify-between mb-2">
                    <label className={labelClass} style={{ marginBottom: 0 }}>Tamanho do Subtítulo</label>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onUpdateSlide({ subtitleFontScale: Math.max(0.75, (currentSlide.subtitleFontScale ?? 1) - 0.05) })}
                        className="w-7 h-7 rounded-lg border border-[#E0E0E0] bg-[#FAFAFA] text-[#555] text-sm font-bold hover:border-[#0A0A0A] hover:text-[#0A0A0A] transition-all flex items-center justify-center leading-none"
                      >−</button>
                      <span className="text-[11px] font-semibold text-[#0A0A0A] tabular-nums min-w-[36px] text-center">
                        {Math.round((currentSlide.subtitleFontScale ?? 1) * 100)}%
                      </span>
                      <button
                        onClick={() => onUpdateSlide({ subtitleFontScale: Math.min(1.4, (currentSlide.subtitleFontScale ?? 1) + 0.05) })}
                        className="w-7 h-7 rounded-lg border border-[#E0E0E0] bg-[#FAFAFA] text-[#555] text-sm font-bold hover:border-[#0A0A0A] hover:text-[#0A0A0A] transition-all flex items-center justify-center leading-none"
                      >+</button>
                    </div>
                  </div>
                  <input
                    type="range"
                    min={75}
                    max={140}
                    step={5}
                    value={Math.round((currentSlide.subtitleFontScale ?? 1) * 100)}
                    onChange={(e) => onUpdateSlide({ subtitleFontScale: Number(e.target.value) / 100 })}
                    className="w-full h-[3px] accent-[#0A0A0A] cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] text-[#AAA] mt-1">
                    <span>75%</span><span>Padrão</span><span>140%</span>
                  </div>
                </div>

                {/* Cor do subtítulo */}
                <div className="pt-3 border-t border-[#EBEBEB]">
                  <label className={labelClass}>Cor do Subtítulo</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={(() => {
                        const c = currentSlide.subtitleColor ?? "rgba(255,255,255,0.75)";
                        const m = c.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
                        if (!m) return "#ffffff";
                        return `#${Number(m[1]).toString(16).padStart(2,"0")}${Number(m[2]).toString(16).padStart(2,"0")}${Number(m[3]).toString(16).padStart(2,"0")}`;
                      })()}
                      onChange={(e) => {
                        const hex = e.target.value;
                        const r = parseInt(hex.slice(1,3),16);
                        const g = parseInt(hex.slice(3,5),16);
                        const b = parseInt(hex.slice(5,7),16);
                        onUpdateSlide({ subtitleColor: `rgba(${r},${g},${b},0.85)` });
                      }}
                      className="w-10 h-10 rounded-lg border border-[#E0E0E0] cursor-pointer p-0.5"
                    />
                    <div className="flex gap-1.5 flex-wrap">
                      {["rgba(255,255,255,0.75)","rgba(255,255,255,0.5)","rgba(200,200,200,1)","rgba(10,10,10,1)"].map((c) => (
                        <button
                          key={c}
                          onClick={() => onUpdateSlide({ subtitleColor: c })}
                          className="w-7 h-7 rounded-full border-2 transition-all"
                          style={{
                            background: c,
                            borderColor: (currentSlide.subtitleColor ?? "rgba(255,255,255,0.75)") === c ? "#0A0A0A" : "#E0E0E0",
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
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
                      Selecione o slide e carregue sua foto. Importe múltiplas fotos de uma vez para criar slides automaticamente.
                    </p>
                  </div>
                  <span className="text-[9px] uppercase tracking-[0.18em] text-[#0A0A0A] font-semibold">
                    {project.slides.length} slides
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
                          <img src={slide.imageUrl} alt={`Slide ${index + 1}`} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] uppercase tracking-[0.22em] text-[#777] font-semibold">
                            Slide {index + 1}
                          </div>
                        )}
                        <div className="absolute inset-x-0 bottom-0 bg-black/60 text-white text-[8px] uppercase tracking-[0.2em] px-2 py-1 flex items-center justify-between">
                          <span>{index + 1}</span>
                          <span>{slide.imageUrl ? "✓" : "—"}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Upload area — Group 3: multiple files */}
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
                <p className="text-[11px] text-[#888] tracking-wide text-center px-4">
                  Arrastar & soltar ou <span className="text-[#0A0A0A] font-semibold">clique para selecionar</span>
                </p>
                <p className="text-[9px] text-[#AAA] mt-1">PNG, JPG, WEBP · Múltiplas fotos criam slides automaticamente</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
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

            {/* Search unsplash */}
            <div>
              <label className={labelClass}>Buscar imagem (Unsplash)</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearchImage()}
                  className={inputClass}
                  placeholder="Ex: architecture, portrait..."
                />
                <button
                  onClick={handleSearchImage}
                  disabled={isSearching}
                  className="vv-btn-secondary min-h-[46px] px-3"
                >
                  <Search size={14} />
                </button>
              </div>
              {searchResults.length > 0 && (
                <div className="mt-2 grid grid-cols-3 gap-1.5">
                  {searchResults.map((url, i) => (
                    <button
                      key={i}
                      onClick={() => onUpdateSlide({ imageUrl: url })}
                      className="relative rounded-lg overflow-hidden aspect-square border-2 border-transparent hover:border-[#0A0A0A] transition-all"
                    >
                      <img src={url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Image positioning — Group 2: 3x3 grid */}
            <div className="border-t border-[#EBEBEB] pt-4 space-y-4">
              <div>
                <label className={labelClass}>Posição da Imagem</label>
                <div
                  className="grid gap-1.5"
                  style={{ gridTemplateColumns: "repeat(3, 1fr)", width: "144px" }}
                >
                  {IMAGE_POSITIONS.map((pos) => {
                    const isActive =
                      (currentSlide.imageOffsetX ?? 0) === pos.x &&
                      (currentSlide.imageOffsetY ?? 0) === pos.y;
                    return (
                      <button
                        key={pos.title}
                        type="button"
                        title={pos.title}
                        onClick={() => onUpdateSlide({ imageOffsetX: pos.x, imageOffsetY: pos.y })}
                        className={`h-10 w-10 rounded-lg border text-sm font-bold transition-all flex items-center justify-center
                          ${isActive
                            ? "border-[#0A0A0A] bg-[#0A0A0A] text-white"
                            : "border-[#E0E0E0] bg-[#FAFAFA] text-[#555] hover:border-[#0A0A0A]"
                          }`}
                      >
                        {pos.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Fine X/Y control — Group 2: -100 to +100 */}
              <div className="rounded-xl border border-[#E0E0E0] bg-[#F8F8F8] p-3 space-y-3">
                <p className="text-[10px] uppercase tracking-[0.18em] text-[#888] font-semibold">
                  Ajuste fino de posição
                </p>
                <div>
                  <div className="flex items-center justify-between text-[9px] text-[#888] mb-1">
                    <span>Esquerda / Direita</span>
                    <span className="font-semibold text-[#0A0A0A]">{currentSlide.imageOffsetX ?? 0}%</span>
                  </div>
                  <input
                    type="range"
                    min="-100"
                    max="100"
                    step="1"
                    value={currentSlide.imageOffsetX ?? 0}
                    onChange={(e) => onUpdateSlide({ imageOffsetX: Number(e.target.value) })}
                    className="w-full accent-[#0A0A0A]"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between text-[9px] text-[#888] mb-1">
                    <span>Topo / Base</span>
                    <span className="font-semibold text-[#0A0A0A]">{currentSlide.imageOffsetY ?? 0}%</span>
                  </div>
                  <input
                    type="range"
                    min="-100"
                    max="100"
                    step="1"
                    value={currentSlide.imageOffsetY ?? 0}
                    onChange={(e) => onUpdateSlide({ imageOffsetY: Number(e.target.value) })}
                    className="w-full accent-[#0A0A0A]"
                  />
                </div>
              </div>

              {/* Zoom — Group 2: 100%-300% */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className={labelClass} style={{ marginBottom: 0 }}>Zoom / Corte</label>
                  <span className="text-[11px] font-semibold text-[#0A0A0A] tabular-nums">
                    {Math.round((currentSlide.imageScale ?? 1) * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="300"
                  step="5"
                  value={Math.round((currentSlide.imageScale ?? 1) * 100)}
                  onChange={(e) => onUpdateSlide({ imageScale: Number(e.target.value) / 100 })}
                  className="w-full accent-[#0A0A0A]"
                />
                <div className="flex justify-between text-[9px] text-[#AAA] mt-1">
                  <span>100% (original)</span>
                  <span>300%</span>
                </div>
              </div>
            </div>

            {/* Overlay */}
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
            </div>

            {currentSlide.imageUrl && (
              <div className="relative rounded-lg overflow-hidden bg-[#F0F0F0]" style={{ height: "160px" }}>
                <img src={currentSlide.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                <div
                  className="absolute inset-0"
                  style={{ background: `rgba(10, 10, 10, ${(currentSlide.overlayOpacity ?? 70) / 100})` }}
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

            {/* Slide controls */}
            {project.isCarousel && (
              <div className="border-t border-[#EBEBEB] pt-4 flex gap-2 flex-wrap">
                <button onClick={onDuplicateSlide} className="vv-btn-secondary flex-1 min-h-10 text-[9px]">
                  <Copy size={12} /> Duplicar
                </button>
                <button
                  onClick={onDeleteSlide}
                  disabled={project.slides.length <= 1}
                  className="vv-btn-danger flex-1 min-h-10 text-[9px]"
                >
                  <Trash2 size={12} /> Remover
                </button>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => onSetCurrentSlide(Math.max(0, project.currentSlideIndex - 1))}
                    disabled={project.currentSlideIndex === 0}
                    className="vv-btn-icon h-10 w-10"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <span className="text-[10px] text-[#888] font-medium min-w-[44px] text-center">
                    {project.currentSlideIndex + 1}/{project.slides.length}
                  </span>
                  <button
                    onClick={() => onSetCurrentSlide(Math.min(project.slides.length - 1, project.currentSlideIndex + 1))}
                    disabled={project.currentSlideIndex === project.slides.length - 1}
                    className="vv-btn-icon h-10 w-10"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
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
                  Gerador de Conteúdo NEXO
                </p>
              </div>
              <p className="text-[11px] text-[#888] leading-relaxed mb-4">
                {project.isCarousel
                  ? "Gera uma sequência de storytelling estruturada para carrosséis — cada slide segue uma progressão narrativa baseada nos 6 pilares de conteúdo."
                  : "Gera texto no tom editorial da NEXO — direto, intencional e confiante. Título impactante + subtítulo persuasivo."}
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
                Conteúdo curado com storytelling estruturado baseado na identidade NEXO —
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
              <div className="flex items-center gap-2 mb-1">
                <BookOpen size={15} className="text-[#0A0A0A]" />
                <p className="text-sm font-semibold text-[#0A0A0A]">
                  Biblioteca de Conteúdo V3
                </p>
              </div>
              <p className="text-[11px] text-[#888] leading-relaxed mb-4">
                {CONTENT_CAROUSELS.length} carrosséis e {CONTENT_SINGLES.length} posts únicos prontos para aplicar.
              </p>

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

              {bibMode === "carousel" && (
                <div className="space-y-2">
                  {filteredCarousels.map((carousel) => {
                    const isExpanded = expandedCarousel === carousel.id;
                    return (
                      <div key={carousel.id} className="border border-[#E0E0E0] rounded-lg overflow-hidden">
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
                            onClick={() => { onApplyCarousel(carousel.slides); setTab("texto"); }}
                            className="vv-btn mt-2.5 w-full min-h-10 text-[9px]"
                          >
                            Aplicar Carrossel Completo →
                          </button>
                        </div>
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
                                  </div>
                                  <button
                                    onClick={() => {
                                      onUpdateSlide({ title: slide.title, subtitle: slide.subtitle, tag: slide.tag ?? "NEXO" });
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

              {bibMode === "single" && (
                <div className="space-y-2">
                  {filteredSingles.map((single) => (
                    <div key={single.id} className="border border-[#E0E0E0] rounded-lg overflow-hidden bg-[#FAFAFA]">
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
                              onUpdateSlide({ title: single.title, subtitle: single.subtitle, tag: "NEXO" });
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
      </div>
    </div>
  );
}
