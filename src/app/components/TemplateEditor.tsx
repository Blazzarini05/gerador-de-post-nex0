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
} from "lucide-react";
import { ProjectState, SlideData, AnimationType, OutputFormat } from "../App";

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
}

type Tab = "texto" | "imagem" | "ia" | "animacao";

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

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleFileUpload = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    onUpdateSlide({ imageUrl: url });
  }, [onUpdateSlide]);

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

  return (
    <div className="bg-white rounded-xl border border-[#E0E0E0] overflow-hidden shadow-sm">
      {/* ── Tab bar ──────────────────────────────────────────────────────── */}
      <div className="bg-[#0A0A0A] flex">
        {(
          [
            { id: "texto", label: "Texto", icon: "Aa" },
            { id: "imagem", label: "Imagem", icon: "📷" },
            { id: "ia", label: "IA", icon: "✦" },
            { id: "animacao", label: "Animação", icon: "▶" },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 py-3 sm:py-3.5 text-[9px] sm:text-[10px] tracking-[0.14em] sm:tracking-[0.16em] uppercase font-semibold transition-all flex flex-col items-center gap-0.5
              ${tab === t.id
                ? "bg-white text-[#0A0A0A]"
                : "text-[#555] hover:text-[#999]"
              }`}
          >
            <span className="text-sm sm:text-base leading-none">{t.icon}</span>
            <span className="hidden sm:inline">{t.label}</span>
          </button>
        ))}
      </div>

      {/* ── Carousel header ──────────────────────────────────────────────── */}
      <div className="border-b border-[#EBEBEB] px-4 sm:px-5 py-2.5 sm:py-3 bg-[#FAFAFA] flex items-center justify-between gap-2 sm:gap-3 flex-wrap">
        <div className="flex items-center gap-2 sm:gap-2.5">
          <Layers size={13} className="text-[#888] sm:w-[14px] sm:h-[14px]" />
          <span className="text-[9px] sm:text-[10px] tracking-[0.15em] sm:tracking-[0.18em] uppercase text-[#888] font-medium">
            {project.isCarousel
              ? `Carrossel · ${project.currentSlideIndex + 1}/${project.slides.length}`
              : "Post Único"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {/* Format toggle */}
          <select
            value={project.outputFormat || "9:16"}
            onChange={(e) => onSetOutputFormat(e.target.value as OutputFormat)}
            className="px-2 py-1 text-[9px] sm:text-[10px] bg-[#F0F0F0] border border-[#E0E0E0] rounded text-[#444] focus:outline-none uppercase tracking-[0.1em] font-semibold"
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
            className={`px-2.5 sm:px-3 py-1 rounded-full text-[8px] sm:text-[9px] tracking-[0.15em] sm:tracking-[0.18em] uppercase font-semibold transition-all whitespace-nowrap
              ${project.isCarousel
                ? "bg-[#0A0A0A] text-white"
                : "bg-[#F0F0F0] text-[#888] hover:bg-[#E0E0E0]"
              }`}
          >
            {project.isCarousel ? "Carrossel ✓" : "Ativar"}
          </button>
          {project.isCarousel && (
            <select
              value={project.slides.length}
              onChange={(e) => onSetSlideCount(Number(e.target.value))}
              className="px-2 py-1 text-[9px] sm:text-[10px] bg-[#F0F0F0] border border-[#E0E0E0] rounded text-[#444] focus:outline-none"
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
      <div className="p-5 space-y-5">

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
                    className="px-3 py-1.5 rounded-full bg-[#F2F2F2] border border-[#E0E0E0] text-[9px] tracking-[0.1em] uppercase text-[#555] hover:bg-[#0A0A0A] hover:text-white hover:border-[#0A0A0A] transition-all font-medium"
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
            {/* Upload local */}
            <div>
              <label className={labelClass}>Importar do Dispositivo</label>
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative w-full h-28 rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all
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

            {/* Unsplash search */}
            <div>
              <label className={labelClass}>Buscar via Unsplash</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearchImage()}
                  className={inputClass}
                  placeholder="fashion, architecture, lifestyle..."
                />
                <button
                  onClick={handleSearchImage}
                  disabled={isSearching}
                  className="px-4 py-2.5 bg-[#0A0A0A] text-white rounded-md hover:bg-[#1A1A1A] transition-colors disabled:opacity-40 flex items-center gap-1.5 text-sm font-medium flex-shrink-0"
                >
                  {isSearching ? (
                    <RefreshCw size={14} className="animate-spin" />
                  ) : (
                    <Search size={14} />
                  )}
                </button>
              </div>

              {searchResults.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-3">
                  {searchResults.map((url, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        onUpdateSlide({ imageUrl: url });
                        setSearchResults([]);
                      }}
                      className={`relative h-20 rounded-md overflow-hidden border-2 transition-all hover:border-[#0A0A0A] hover:scale-[1.02]
                        ${currentSlide.imageUrl === url ? "border-[#0A0A0A]" : "border-transparent"}`}
                    >
                      <img src={url} alt={`Result ${i}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* URL manual */}
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

            {/* Overlay Opacity Control */}
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
                <span>Transparente (0%)</span>
                <span>Foto destacada</span>
                <span>Texto destacado (100%)</span>
              </div>
              <p className="text-[10px] text-[#888] mt-2 leading-relaxed">
                Controla a intensidade do overlay escuro sobre a imagem. Valores altos destacam o texto, valores baixos destacam a foto.
              </p>
            </div>

            {/* Preview */}
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
                  className="absolute top-2 right-2 w-7 h-7 bg-black/70 rounded-full flex items-center justify-center text-white hover:bg-black transition-colors z-10"
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
                    className={`text-left px-4 py-2.5 rounded-lg border text-sm transition-all
                      ${aiCategory === cat
                        ? "border-[#0A0A0A] bg-[#0A0A0A] text-white"
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
              className="w-full py-3.5 bg-[#0A0A0A] text-white rounded-lg hover:bg-[#1A1A1A] transition-all disabled:opacity-40 flex items-center justify-center gap-2 font-semibold text-sm tracking-wide"
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
                    className="flex-1 py-3 bg-[#0A0A0A] text-white text-[10px] tracking-[0.18em] uppercase font-semibold hover:bg-[#1A1A1A] transition-colors"
                  >
                    {project.isCarousel
                      ? `Aplicar Slide ${project.currentSlideIndex + 1}`
                      : "Aplicar ao Template"}
                  </button>
                  <button
                    onClick={handleGenerateAI}
                    className="px-5 py-3 bg-[#F5F5F5] text-[#0A0A0A] text-[10px] tracking-wide uppercase hover:bg-[#E0E0E0] transition-colors border-l border-[#EBEBEB]"
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

        {/* ─── ANIMAÇÃO TAB ──────────────────────────────────────────────── */}
        {tab === "animacao" && (
          <>
            <div className="flex items-center gap-2 mb-1">
              <Film size={15} className="text-[#0A0A0A]" />
              <p className="text-sm font-semibold text-[#0A0A0A]">
                Animação do Post
              </p>
            </div>
            <p className="text-[11px] text-[#888] leading-relaxed">
              Visualize como o post ficaria animado em Stories ou Reels.
              A exportação PNG mantém o frame perfeito.
            </p>

            <div className="grid grid-cols-2 gap-2 mt-2">
              {ANIMATIONS.map((anim) => (
                <button
                  key={anim.id}
                  onClick={() => onSetAnimation(anim.id)}
                  className={`p-3 rounded-lg border-2 text-left transition-all
                    ${project.animation === anim.id
                      ? "border-[#0A0A0A] bg-[#0A0A0A] text-white"
                      : "border-[#E0E0E0] bg-[#FAFAFA] text-[#444] hover:border-[#0A0A0A]"
                    }`}
                >
                  <div className="text-xl mb-1">{anim.icon}</div>
                  <p className="text-[11px] font-semibold">{anim.label}</p>
                  <p className={`text-[10px] ${project.animation === anim.id ? "text-white/60" : "text-[#888]"}`}>
                    {anim.description}
                  </p>
                </button>
              ))}
            </div>

            <div>
              <label className={labelClass}>
                Velocidade · {project.animationSpeed.toFixed(1)}s
              </label>
              <input
                type="range"
                min="0.4"
                max="3.0"
                step="0.1"
                value={project.animationSpeed}
                onChange={(e) => onSetAnimationSpeed(Number(e.target.value))}
                className="w-full accent-[#0A0A0A]"
              />
              <div className="flex justify-between text-[9px] text-[#AAA] mt-1">
                <span>Rápida (0.4s)</span>
                <span>Lenta (3.0s)</span>
              </div>
            </div>

            <div className="bg-[#0A0A0A] rounded-lg p-4">
              <p className="text-[10px] tracking-[0.15em] uppercase text-[#555] font-semibold mb-2">
                Animações disponíveis
              </p>
              {ANIMATIONS.filter((a) => a.id !== "none").map((a) => (
                <div key={a.id} className="flex items-center gap-2 py-1">
                  <span className="text-sm">{a.icon}</span>
                  <p className="text-[11px] text-white/60">
                    <strong className="text-white/80">{a.label}</strong> — {a.description}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* ── Slide actions (carousel) ─────────────────────────────────────── */}
      {project.isCarousel && (
        <div className="px-5 pb-5 pt-1 border-t border-[#EBEBEB] flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onSetCurrentSlide(Math.max(0, project.currentSlideIndex - 1))}
              disabled={project.currentSlideIndex === 0}
              className="p-2 rounded-md bg-[#F0F0F0] text-[#444] hover:bg-[#E0E0E0] disabled:opacity-30 transition-colors"
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
              className="p-2 rounded-md bg-[#F0F0F0] text-[#444] hover:bg-[#E0E0E0] disabled:opacity-30 transition-colors"
            >
              <ChevronRight size={14} />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onDuplicateSlide}
              className="px-3 py-1.5 rounded-md bg-[#F5F5F5] border border-[#E0E0E0] text-[#444] hover:bg-[#E0E0E0] transition-colors flex items-center gap-1 text-[9px] tracking-wide uppercase font-semibold"
              title="Duplicar slide atual"
            >
              <Copy size={11} />
              Duplicar
            </button>
            <button
              onClick={onDeleteSlide}
              disabled={project.slides.length <= 1}
              className="px-3 py-1.5 rounded-md bg-[#FEE] border border-[#FCC] text-[#C33] hover:bg-[#FDD] transition-colors flex items-center gap-1 text-[9px] tracking-wide uppercase font-semibold disabled:opacity-30"
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