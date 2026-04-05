import { SlideData } from "../../App";

interface Props {
  data: SlideData;
  width?: number;
  height?: number;
}

export function T01DarkHeader({ data, width = 540, height = 960 }: Props) {
  const overlayOpacity = (data.overlayOpacity ?? 70) / 100;

  return (
    <div
      className="relative overflow-hidden bg-[#0A0A0A]"
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      {/* Background photo */}
      {data.imageUrl ? (
        <>
          <img src={data.imageUrl} alt="" style={{ display: 'none' }} crossOrigin="anonymous" />
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: `url(${data.imageUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
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

      {/* Dark header overlay — hard rectangle */}
      <div
        className="absolute top-0 left-0 right-0 z-20 flex flex-col items-center justify-center px-10 py-10 pointer-events-none"
        style={{ background: `rgba(10,10,10,${Math.min(0.95, overlayOpacity + 0.2)})`, minHeight: "290px" }}
      >
        {/* Tag */}
        {data.tag && (
          <p
            className="tracking-[0.3em] uppercase mb-4 font-medium"
            style={{ fontSize: "9px", color: "rgba(255,255,255,0.40)" }}
          >
            {data.tag}
          </p>
        )}

        {/* Title */}
        {data.title && (
          <h1
            className="font-[family-name:var(--font-display)] text-white uppercase text-center leading-[0.93]"
            style={{
              fontSize: "40px",
              letterSpacing: "0.015em",
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
              className="w-full my-5"
              style={{ height: "1px", background: "rgba(255,255,255,0.22)" }}
            />
            <p
              className="font-light text-center leading-[1.55]"
              style={{
                fontSize: "13px",
                color: "rgba(255,255,255,0.75)",
                maxWidth: "340px",
              }}
            >
              {data.subtitle}
            </p>
          </>
        )}
      </div>

      {/* Bottom-left brand mark */}
      <div
        className="absolute bottom-7 left-8 z-20 font-[family-name:var(--font-display)] tracking-[0.28em] uppercase pointer-events-none"
        style={{ fontSize: "10px", color: "rgba(255,255,255,0.28)" }}
      >
        VERSAVISUAL
      </div>
    </div>
  );
}