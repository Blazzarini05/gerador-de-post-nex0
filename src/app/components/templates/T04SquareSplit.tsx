import { SlideData, TextPosition } from "../../App";

interface Props {
  data: SlideData;
  width?: number;
  height?: number;
}

export function T04SquareSplit({ data, width = 540, height = 540 }: Props) {
  const overlayOpacity = (data.overlayOpacity ?? 70) / 100;
  const pos: TextPosition = data.textPosition ?? "bottom";

  const textJustify =
    pos === "top" ? "flex-start" : pos === "center" ? "center" : "flex-end";

  return (
    <div
      className="relative overflow-hidden bg-[#0A0A0A]"
      style={{
        width: `${width}px`,
        height: `${height}px`,
        display: "grid",
        gridTemplateRows: "60% 40%",
      }}
    >
      {/* Photo section — top 60% */}
      <div className="relative overflow-hidden z-0">
        {data.imageUrl ? (
          <img
            src={data.imageUrl}
            alt=""
            crossOrigin="anonymous"
            className="absolute inset-0 w-full h-full"
            style={{ objectFit: "cover", objectPosition: "center" }}
          />
        ) : (
          <div
            className="absolute inset-0 z-0"
            style={{
              background:
                "linear-gradient(135deg,#2a3a4a 0%,#1a2a3a 50%,#0d1520 100%)",
            }}
          />
        )}

        {/* Bottom fade into black with variable opacity */}
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background:
              `linear-gradient(0deg, rgba(10,10,10,${overlayOpacity * 0.7}) 0%, transparent 50%)`,
          }}
        />
      </div>

      {/* Text section — bottom 40% */}
      <div
        className="bg-[#0A0A0A] px-8 py-6 flex flex-col relative z-20 pointer-events-none"
        style={{ justifyContent: textJustify }}
      >
        {/* Tag */}
        {data.tag && (
          <p
            className="tracking-[0.28em] uppercase mb-2 font-medium"
            style={{ fontSize: "8px", color: "rgba(255,255,255,0.32)" }}
          >
            {data.tag}
          </p>
        )}

        {/* Title */}
        {data.title && (
          <h1
            className="font-[family-name:var(--font-display)] text-white uppercase leading-[0.93]"
            style={{
              fontSize: "27px",
              letterSpacing: "0.02em",
              whiteSpace: "pre-line",
            }}
          >
            {data.title}
          </h1>
        )}

        {/* Subtitle */}
        {data.subtitle && (
          <>
            <div
              className="my-3"
              style={{ width: "28px", height: "1px", background: "rgba(255,255,255,0.25)" }}
            />
            <p
              className="font-light leading-[1.5]"
              style={{
                fontSize: "10px",
                color: "rgba(255,255,255,0.55)",
              }}
            >
              {data.subtitle}
            </p>
          </>
        )}

        {/* Brand mark */}
        <div
          className="absolute bottom-4 right-6 font-[family-name:var(--font-display)] tracking-[0.22em] uppercase"
          style={{ fontSize: "11px", color: "rgba(255,255,255,0.22)" }}
        >
          VV
        </div>
      </div>
    </div>
  );
}
