import { SlideData, TextPosition } from "../../App";

interface Props {
  data: SlideData;
  width?: number;
  height?: number;
}

export function T06Minimal({ data, width = 540, height = 960 }: Props) {
  const overlayOpacity = (data.overlayOpacity ?? 70) / 100;
  const pos: TextPosition = data.textPosition ?? "center";
  const bgPos = data.imagePosition ?? "center";

  const contentJustify =
    pos === "top" ? "flex-start" : pos === "center" ? "center" : "flex-end";

  return (
    <div
      className="relative overflow-hidden flex flex-col justify-between px-10 py-11"
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

      <div className="absolute top-0 left-0 right-0 h-[3px] bg-white z-20 pointer-events-none" />

      <div
        className="font-medium tracking-[0.32em] uppercase relative z-20 pointer-events-none"
        style={{ fontSize: "9px", color: "rgba(255,255,255,0.30)" }}
      >
        {data.tag || "VERSAVISUAL"}
      </div>

      <div
        className="flex-1 flex relative z-20 pointer-events-none"
        style={{ alignItems: contentJustify, paddingTop: "8px", paddingBottom: "8px" }}
      >
        <div>
          {data.title && (
            <h1
              className="font-[family-name:var(--font-display)] text-white uppercase leading-[0.88]"
              style={{ fontSize: "59px", letterSpacing: "0.01em", whiteSpace: "pre-line" }}
            >
              {data.title}
            </h1>
          )}
          {data.subtitle && (
            <>
              <div className="mt-7 mb-5" style={{ height: "1px", background: "rgba(255,255,255,0.12)" }} />
              <p
                className="font-light leading-[1.65]"
                style={{ fontSize: "11px", color: "rgba(255,255,255,0.50)", maxWidth: "320px" }}
              >
                {data.subtitle}
              </p>
            </>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center relative z-20 pointer-events-none">
        <div
          className="font-[family-name:var(--font-display)] tracking-[0.24em] uppercase"
          style={{ fontSize: "14px", color: "rgba(255,255,255,0.60)" }}
        >
          VERSA
        </div>
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.25)" }} />
        <div
          className="font-[family-name:var(--font-display)] tracking-[0.24em] uppercase"
          style={{ fontSize: "14px", color: "rgba(255,255,255,0.22)" }}
        >
          VISUAL
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white opacity-10 z-20 pointer-events-none" />
    </div>
  );
}
