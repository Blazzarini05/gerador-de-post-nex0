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
    width: "48%",
    maxWidth: "48%",
    pointerEvents: "none",
    zIndex: 20,
    boxSizing: "border-box",
  };
}

export function T05MagazineWide({ data, width = 960, height = 540 }: Props) {
  const overlayOpacity = (data.overlayOpacity ?? 70) / 100;
  const tfs = Math.max(0.75, Math.min(1.4, data.titleFontScale ?? 1));
  const sfs = Math.max(0.75, Math.min(1.4, data.subtitleFontScale ?? 1));
  const bgScale = data.imageScale ?? 1;
  const bgX = Math.max(-100, Math.min(100, data.imageOffsetX ?? 0));
  const bgY = Math.max(-100, Math.min(100, data.imageOffsetY ?? 0));
  const bgPos = `${50 + bgX / 100 * 50}% ${50 + bgY / 100 * 50}%`;
  const bgSize = `${Math.max(100, Math.min(300, bgScale * 100))}%`;

  // Default left-aligned magazine positioning
  const titleH = data.titleH ?? 25;
  const titleV = data.titleV ?? 30;
  const titleAlign = data.titleAlign ?? "left";
  const subtitleH = data.subtitleH ?? 25;
  const subtitleV = data.subtitleV ?? 65;
  const subtitleAlign = data.subtitleAlign ?? "left";
  const titleColor = data.titleColor ?? "rgba(255,255,255,1)";
  const subtitleColor = data.subtitleColor ?? "rgba(255,255,255,0.70)";

  return (
    <div
      className="relative overflow-hidden bg-[#0A0A0A]"
      style={{ width: `${width}px`, height: `${height}px` }}
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
          style={{ background: "linear-gradient(135deg,#0d1520 0%,#1a2d44 50%,#2d4a6a 100%)" }}
        />
      )}

      {/* Left-side gradient overlay */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background: `linear-gradient(90deg, rgba(10,10,10,${overlayOpacity * 0.92}) 0%, rgba(10,10,10,${overlayOpacity * 0.70}) 35%, rgba(10,10,10,${overlayOpacity * 0.25}) 60%, transparent 100%)`,
        }}
      />

      {/* Title block */}
      {data.title && (
        <div style={getAbsoluteTextStyle(titleH, titleV, titleAlign)}>
          {data.tag && (
            <p
              className="tracking-[0.32em] uppercase mb-3 font-medium"
              style={{ fontSize: "8px", color: "rgba(255,255,255,0.35)" }}
            >
              {data.tag}
            </p>
          )}
          <h1
            className="font-[family-name:var(--font-display)] uppercase leading-[0.90]"
            style={{
              fontSize: `${Math.round(43 * tfs)}px`,
              letterSpacing: "0.015em",
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
          <div className="mb-3" style={{ width: "36px", height: "1px", background: "rgba(255,255,255,0.30)" }} />
          <p
            className="font-light leading-[1.55]"
            style={{
              fontSize: `${Math.round(14 * sfs)}px`,
              color: subtitleColor,
              maxWidth: "300px",
            }}
          >
            {data.subtitle}
          </p>
        </div>
      )}

      {/* Brand circle */}
      <div
        className="absolute right-10 bottom-10 z-[2] w-[64px] h-[64px] rounded-full border flex items-center justify-center font-[family-name:var(--font-display)] text-center leading-[1.2] tracking-[0.18em] uppercase pointer-events-none"
        style={{ borderColor: "rgba(255,255,255,0.20)", color: "rgba(255,255,255,0.45)", fontSize: "8px" }}
      >
        NEXO
      </div>
      <div
        className="absolute top-0 left-0 right-0 h-[2px] z-[3] pointer-events-none"
        style={{ background: "rgba(255,255,255,0.12)" }}
      />
    </div>
  );
}
