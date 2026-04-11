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

export function T01DarkHeader({ data, width = 540, height = 960 }: Props) {
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
  const subtitleColor = data.subtitleColor ?? "rgba(255,255,255,0.75)";

  return (
    <div
      className="relative overflow-hidden bg-[#0A0A0A]"
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      {/* Background photo */}
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
          style={{
            background:
              "linear-gradient(160deg,#1a0a00 0%,#2d1810 20%,#4a2e20 40%,#3d2215 60%,#1a0e08 100%)",
          }}
        />
      )}

      {/* Dark overlay */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{ background: `rgba(10,10,10,${overlayOpacity * 0.9})` }}
      />

      {/* Title block */}
      {data.title && (
        <div style={getAbsoluteTextStyle(titleH, titleV, titleAlign)}>
          {data.tag && (
            <p
              className="tracking-[0.3em] uppercase font-medium mb-3"
              style={{ fontSize: "9px", color: "rgba(255,255,255,0.40)" }}
            >
              {data.tag}
            </p>
          )}
          <h1
            className="font-[family-name:var(--font-display)] uppercase leading-[0.93]"
            style={{
              fontSize: `${Math.round(40 * tfs)}px`,
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
          <p
            className="font-light leading-[1.55]"
            style={{
              fontSize: `${Math.round(13 * sfs)}px`,
              color: subtitleColor,
              maxWidth: "340px",
              margin: subtitleAlign === "center" ? "0 auto" : undefined,
            }}
          >
            {data.subtitle}
          </p>
        </div>
      )}

      {/* Brand mark */}
      <div
        className="absolute bottom-7 left-8 z-20 font-[family-name:var(--font-display)] tracking-[0.28em] uppercase pointer-events-none"
        style={{ fontSize: "10px", color: "rgba(255,255,255,0.28)" }}
      >
        NEXO
      </div>
    </div>
  );
}
