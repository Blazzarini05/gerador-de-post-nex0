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

export function T04SquareSplit({ data, width = 540, height = 540 }: Props) {
  const overlayOpacity = (data.overlayOpacity ?? 70) / 100;
  const tfs = Math.max(0.75, Math.min(1.4, data.titleFontScale ?? 1));
  const sfs = Math.max(0.75, Math.min(1.4, data.subtitleFontScale ?? 1));
  const bgScale = data.imageScale ?? 1;
  const bgX = Math.max(-100, Math.min(100, data.imageOffsetX ?? 0));
  const bgY = Math.max(-100, Math.min(100, data.imageOffsetY ?? 0));
  const bgPos = `${50 + bgX / 100 * 50}% ${50 + bgY / 100 * 50}%`;
  const bgSize = `${Math.max(100, Math.min(300, bgScale * 100))}%`;

  const titleH = data.titleH ?? 50;
  const titleV = data.titleV ?? 72;
  const titleAlign = data.titleAlign ?? "left";
  const subtitleH = data.subtitleH ?? 50;
  const subtitleV = data.subtitleV ?? 88;
  const subtitleAlign = data.subtitleAlign ?? "left";
  const titleColor = data.titleColor ?? "rgba(255,255,255,1)";
  const subtitleColor = data.subtitleColor ?? "rgba(255,255,255,0.55)";

  return (
    <div
      className="relative overflow-hidden bg-[#0A0A0A]"
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      {/* Photo section — top 60% */}
      <div className="absolute inset-x-0 top-0 overflow-hidden z-0" style={{ height: "60%" }}>
        {data.imageUrl ? (
          <>
            <img src={data.imageUrl} alt="" crossOrigin="anonymous" style={{ display: "none" }} />
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url(${data.imageUrl})`,
                backgroundSize: bgSize,
                backgroundPosition: bgPos,
              }}
            />
          </>
        ) : (
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(135deg,#2a3a4a 0%,#1a2a3a 50%,#0d1520 100%)" }}
          />
        )}
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background: `linear-gradient(0deg, rgba(10,10,10,${overlayOpacity * 0.7}) 0%, transparent 50%)`,
          }}
        />
      </div>

      {/* Dark text section — bottom 40% */}
      <div
        className="absolute inset-x-0 bottom-0 bg-[#0A0A0A] z-10 pointer-events-none"
        style={{ height: "40%" }}
      >
        <div
          className="absolute bottom-4 right-6 font-[family-name:var(--font-display)] tracking-[0.22em] uppercase"
          style={{ fontSize: "11px", color: "rgba(255,255,255,0.22)" }}
        >
          NEXO
        </div>
      </div>

      {/* Title block — absolutely positioned within full frame */}
      {data.title && (
        <div style={getAbsoluteTextStyle(titleH, titleV, titleAlign)}>
          {data.tag && (
            <p
              className="tracking-[0.28em] uppercase mb-2 font-medium"
              style={{ fontSize: "8px", color: "rgba(255,255,255,0.32)" }}
            >
              {data.tag}
            </p>
          )}
          <h1
            className="font-[family-name:var(--font-display)] uppercase leading-[0.93]"
            style={{
              fontSize: `${Math.round(27 * tfs)}px`,
              letterSpacing: "0.02em",
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
          <div className="mb-2" style={{ width: "28px", height: "1px", background: "rgba(255,255,255,0.25)" }} />
          <p
            className="font-light leading-[1.5]"
            style={{
              fontSize: `${Math.round(10 * sfs)}px`,
              color: subtitleColor,
            }}
          >
            {data.subtitle}
          </p>
        </div>
      )}
    </div>
  );
}
