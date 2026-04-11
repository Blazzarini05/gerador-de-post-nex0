import { SlideData } from "../../App";

interface Props {
  data: SlideData;
  width?: number;
  height?: number;
}

function getAbsoluteTextStyle(h: number, v: number, align: string): React.CSSProperties {
  return {
    position: "absolute",
    left: `${h}%`,
    top: `${v}%`,
    transform: "translate(-50%, -50%)",
    textAlign: align as React.CSSProperties["textAlign"],
    width: "82%",
    maxWidth: "82%",
    pointerEvents: "none",
    zIndex: 20,
    boxSizing: "border-box",
  };
}

export function T06Minimal({ data, width = 540, height = 960 }: Props) {
  const overlayOpacity = (data.overlayOpacity ?? 70) / 100;
  const tfs = Math.max(0.75, Math.min(1.4, data.titleFontScale ?? 1));
  const sfs = Math.max(0.75, Math.min(1.4, data.subtitleFontScale ?? 1));
  const bgScale = data.imageScale ?? 1;
  const bgX = Math.max(-100, Math.min(100, data.imageOffsetX ?? 0));
  const bgY = Math.max(-100, Math.min(100, data.imageOffsetY ?? 0));
  const bgPos = `${50 + bgX / 100 * 50}% ${50 + bgY / 100 * 50}%`;

  const titleH = data.titleH ?? 50;
  const titleV = data.titleV ?? 40;
  const titleAlign = data.titleAlign ?? "left";
  const subtitleH = data.subtitleH ?? 50;
  const subtitleV = data.subtitleV ?? 65;
  const subtitleAlign = data.subtitleAlign ?? "left";
  const titleColor = data.titleColor ?? "rgba(255,255,255,1)";
  const subtitleColor = data.subtitleColor ?? "rgba(255,255,255,0.50)";

  return (
    <div
      className="relative overflow-hidden"
      style={{ width: `${width}px`, height: `${height}px`, backgroundColor: "#0A0A0A" }}
    >
      {data.imageUrl && (
        <>
          <img src={data.imageUrl} alt="" crossOrigin="anonymous" style={{ display: "none" }} />
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: `url(${data.imageUrl})`,
              backgroundSize: "cover",
              backgroundPosition: bgPos,
            }}
          />
        </>
      )}

      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{ background: `rgba(10,10,10,${overlayOpacity})` }}
      />

      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-white z-20 pointer-events-none" />

      {/* Tag */}
      <div
        className="absolute top-10 left-10 font-medium tracking-[0.32em] uppercase z-20 pointer-events-none"
        style={{ fontSize: "9px", color: "rgba(255,255,255,0.30)" }}
      >
        {data.tag || "NEXO"}
      </div>

      {/* Title block */}
      {data.title && (
        <div style={getAbsoluteTextStyle(titleH, titleV, titleAlign)}>
          <h1
            className="font-[family-name:var(--font-display)] uppercase leading-[0.88]"
            style={{
              fontSize: `${Math.round(59 * tfs)}px`,
              letterSpacing: "0.01em",
              whiteSpace: "pre-line",
              color: titleColor,
            }}
          >
            {data.title}
          </h1>
        </div>
      )}

      {/* Subtitle block */}
      {data.subtitle && (
        <div style={getAbsoluteTextStyle(subtitleH, subtitleV, subtitleAlign)}>
          <div className="mb-4" style={{ height: "1px", background: "rgba(255,255,255,0.12)" }} />
          <p
            className="font-light leading-[1.65]"
            style={{
              fontSize: `${Math.round(11 * sfs)}px`,
              color: subtitleColor,
              maxWidth: "320px",
            }}
          >
            {data.subtitle}
          </p>
        </div>
      )}

      {/* Brand footer */}
      <div className="absolute bottom-10 left-10 right-10 flex justify-between items-center z-20 pointer-events-none">
        <div
          className="font-[family-name:var(--font-display)] tracking-[0.24em] uppercase"
          style={{ fontSize: "14px", color: "rgba(255,255,255,0.60)" }}
        >
          NEXO
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white opacity-10 z-20 pointer-events-none" />
    </div>
  );
}
