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

export function T03BWEditorial({ data, width = 540, height = 960 }: Props) {
  const overlayOpacity = (data.overlayOpacity ?? 70) / 100;
  const tfs = Math.max(0.75, Math.min(1.4, data.titleFontScale ?? 1));
  const sfs = Math.max(0.75, Math.min(1.4, data.subtitleFontScale ?? 1));
  const bgScale = data.imageScale ?? 1;
  const bgX = Math.max(-100, Math.min(100, data.imageOffsetX ?? 0));
  const bgY = Math.max(-100, Math.min(100, data.imageOffsetY ?? 0));
  const bgPos = `${50 + bgX / 100 * 50}% ${50 + bgY / 100 * 50}%`;
  const bgSize = `${Math.max(100, Math.min(300, bgScale * 100))}%`;

  const titleH = data.titleH ?? 50;
  const titleV = data.titleV ?? 10;
  const titleAlign = data.titleAlign ?? "center";
  const subtitleH = data.subtitleH ?? 50;
  const subtitleV = data.subtitleV ?? 85;
  const subtitleAlign = data.subtitleAlign ?? "center";
  const titleColor = data.titleColor ?? "rgba(255,255,255,1)";
  const subtitleColor = data.subtitleColor ?? "rgba(255,255,255,0.65)";

  return (
    <div
      className="relative overflow-hidden bg-[#0A0A0A]"
      style={{ width: `${width}px`, height: `${height}px`, filter: "grayscale(100%)" }}
    >
      {data.imageUrl ? (
        <>
          <img src={data.imageUrl} alt="" crossOrigin="anonymous" style={{ display: "none" }} />
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: `url(${data.imageUrl})`,
              backgroundSize: bgSize,
              backgroundPosition: bgPos,
            }}
          />
        </>
      ) : (
        <div
          className="absolute inset-0 z-0"
          style={{ background: "linear-gradient(145deg,#c8c5be 0%,#9a9690 40%,#6a6662 75%,#404040 100%)" }}
        />
      )}

      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background: `linear-gradient(0deg, rgba(0,0,0,${overlayOpacity * 0.92}) 0%, rgba(0,0,0,${overlayOpacity * 0.58}) 40%, rgba(0,0,0,${overlayOpacity * 0.15}) 65%, transparent 100%)`,
        }}
      />

      {/* Title block */}
      {data.title && (
        <div style={getAbsoluteTextStyle(titleH, titleV, titleAlign)}>
          {data.tag && (
            <p
              className="tracking-[0.32em] uppercase mb-3 font-medium"
              style={{ fontSize: "9px", color: "rgba(255,255,255,0.35)" }}
            >
              {data.tag}
            </p>
          )}
          <h1
            className="font-[family-name:var(--font-display)] uppercase leading-[0.88]"
            style={{
              fontSize: `${Math.round(54 * tfs)}px`,
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
          <p
            className="font-light leading-[1.55] mx-auto"
            style={{
              fontSize: `${Math.round(12 * sfs)}px`,
              color: subtitleColor,
              maxWidth: "320px",
            }}
          >
            {data.subtitle}
          </p>
        </div>
      )}

      <div
        className="absolute top-0 left-0 right-0 h-[2px] z-30 pointer-events-none"
        style={{ background: "rgba(255,255,255,0.18)" }}
      />
      <div
        className="absolute bottom-6 right-8 z-30 font-[family-name:var(--font-display)] tracking-[0.28em] uppercase pointer-events-none"
        style={{ fontSize: "9px", color: "rgba(255,255,255,0.20)" }}
      >
        NEXO
      </div>
    </div>
  );
}
