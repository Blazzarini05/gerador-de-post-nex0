import { TemplateId } from "../App";

interface Props {
  selectedTemplate: TemplateId | null;
  onSelectTemplate: (id: TemplateId) => void;
}

const templates = [
  {
    id: "t01-dark-header" as TemplateId,
    name: "Cabeçalho Escuro",
    code: "T01",
    format: "Story",
    ratio: "9:16",
    size: "1080 × 1920",
    description: "Overlay escuro no topo — título + divisória + subtítulo",
    preview: "dark-top",
  },
  {
    id: "t02-bottom-text" as TemplateId,
    name: "Texto Inferior",
    code: "T02",
    format: "Story",
    ratio: "9:16",
    size: "1080 × 1920",
    description: "Foto full bleed — texto esquerda com vignette na base",
    preview: "bottom-left",
  },
  {
    id: "t03-bw-editorial" as TemplateId,
    name: "Editorial P&B Quadrado",
    code: "T03",
    format: "Story",
    ratio: "9:16",
    size: "1080 × 1920",
    description: "Escala de cinza — título em caixa alta centralizado na base",
    preview: "bw-bottom",
  },
  {
    id: "t04-square-split" as TemplateId,
    name: "Divisão Quadrada",
    code: "T04",
    format: "Post",
    ratio: "1:1",
    size: "1080 × 1080",
    description: "Split 60/40 — foto no topo, fundo preto com texto abaixo",
    preview: "square-split",
  },
  {
    id: "t05-magazine-wide" as TemplateId,
    name: "Revista Plot",
    code: "T05",
    format: "Wide",
    ratio: "16:9",
    size: "1920 × 1080",
    description: "Layout horizontal — gradiente lateral esquerda com texto",
    preview: "wide-left",
  },
  {
    id: "t06-minimal" as TemplateId,
    name: "Declaração Minimalista",
    code: "T06",
    format: "Story",
    ratio: "9:16",
    size: "1080 × 1920",
    description: "Apenas tipografia — fundo preto, sem foto",
    preview: "typo-only",
  },
];

const formatColors: Record<string, string> = {
  Story: "bg-[#0A0A0A] text-white",
  Post: "bg-[#1A3A5C] text-white",
  Wide: "bg-[#2A1A0A] text-white",
};

function MiniPreview({ preview, selected }: { preview: string; selected: boolean }) {
  const base = `w-full h-full rounded overflow-hidden relative transition-all duration-300 ${selected ? "opacity-100" : "opacity-60"}`;

  if (preview === "dark-top") {
    return (
      <div className={base} style={{ background: "#0A0A0A" }}>
        <div className="absolute top-0 left-0 right-0 h-[38%] bg-[#0A0A0A] flex flex-col items-center justify-center gap-1 px-2">
          <div className="w-full h-[5px] bg-white rounded-sm opacity-90" />
          <div className="w-[80%] h-[2px] bg-white/30 rounded-sm" />
          <div className="w-full h-[3px] bg-white/60 rounded-sm" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 top-[38%] bg-gradient-to-b from-[#3a2a1a] to-[#1a1008]" />
      </div>
    );
  }
  if (preview === "bottom-left") {
    return (
      <div className={base} style={{ background: "linear-gradient(160deg,#2a4a6a,#1a2a3a)" }}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        <div className="absolute bottom-2 left-2 right-2 space-y-0.5">
          <div className="w-[70%] h-[4px] bg-white rounded-sm" />
          <div className="w-[55%] h-[2px] bg-white/50 rounded-sm" />
        </div>
      </div>
    );
  }
  if (preview === "bw-bottom") {
    return (
      <div className={base} style={{ filter: "grayscale(100%)", background: "linear-gradient(160deg,#888,#444)" }}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        <div className="absolute bottom-2 left-0 right-0 flex flex-col items-center gap-0.5">
          <div className="w-[75%] h-[4px] bg-white rounded-sm" />
          <div className="w-[60%] h-[2px] bg-white/60 rounded-sm" />
        </div>
      </div>
    );
  }
  if (preview === "square-split") {
    return (
      <div className={base} style={{ display: "grid", gridTemplateRows: "60% 40%" }}>
        <div style={{ background: "linear-gradient(160deg,#2a3a4a,#1a2a1a)" }} />
        <div style={{ background: "#0A0A0A" }} className="flex flex-col justify-center px-2 gap-0.5">
          <div className="w-[80%] h-[4px] bg-white rounded-sm" />
          <div className="w-[50%] h-[2px] bg-white/40 rounded-sm" />
        </div>
      </div>
    );
  }
  if (preview === "wide-left") {
    return (
      <div
        className={base}
        style={{
          background: "linear-gradient(135deg,#1a2a3a,#2a3a4a)",
          aspectRatio: "16/9",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
        <div className="absolute left-2 bottom-2 space-y-0.5">
          <div className="w-[55%] h-[4px] bg-white rounded-sm" />
          <div className="w-[40%] h-[2px] bg-white/50 rounded-sm" />
        </div>
      </div>
    );
  }
  // typo-only
  return (
    <div className={base} style={{ background: "#0A0A0A" }}>
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-white" />
      <div className="absolute inset-0 flex flex-col items-start justify-center px-3 gap-1">
        <div className="w-full h-[5px] bg-white rounded-sm" />
        <div className="w-[70%] h-[5px] bg-white rounded-sm" />
        <div className="w-[50%] h-[5px] bg-white rounded-sm" />
      </div>
    </div>
  );
}

export function TemplateSelector({ selectedTemplate, onSelectTemplate }: Props) {
  return (
    <section id="templates">
      <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
        <p className="text-[10px] tracking-[0.35em] uppercase text-[#888888] font-medium whitespace-nowrap">
          Escolha o Template
        </p>
        <span className="flex-1 h-px bg-[#D0D0D0]" />
        <p className="text-[10px] tracking-[0.25em] uppercase text-[#AAAAAA] font-medium">
          {templates.length} modelos
        </p>
      </div>

      <div className="grid grid-cols-1 min-[420px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4">
        {templates.map((template) => {
          const isSelected = selectedTemplate === template.id;
          return (
            <button
              key={template.id}
              onClick={() => onSelectTemplate(template.id)}
              className={`
                text-left rounded-2xl border transition-all duration-200 overflow-hidden bg-white
                ${isSelected
                  ? "border-[#0A0A0A] shadow-[0_18px_40px_rgba(10,10,10,0.14)] -translate-y-1"
                  : "border-[#DCDCDC] hover:border-[#0A0A0A] hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(10,10,10,0.08)]"
                }
              `}
            >
              {/* Visual preview */}
              <div
                className="w-full bg-[#F5F5F5] overflow-hidden"
                style={{ height: "clamp(80px, 20vw, 100px)" }}
              >
                <MiniPreview preview={template.preview} selected={isSelected} />
              </div>

              <div className="p-2.5 sm:p-3 bg-white">
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className="text-[9px] font-semibold tracking-[0.18em] uppercase text-[#888]"
                  >
                    {template.code}
                  </span>
                  <span
                    className={`text-[7px] sm:text-[8px] px-1.5 py-0.5 rounded-full tracking-[0.12em] uppercase font-semibold ${formatColors[template.format]}`}
                  >
                    {template.ratio}
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] font-semibold text-[#0A0A0A] tracking-tight leading-tight mb-1">
                  {template.name}
                </p>
                <p className="text-[9px] text-[#888] leading-tight hidden md:block line-clamp-2">
                  {template.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
