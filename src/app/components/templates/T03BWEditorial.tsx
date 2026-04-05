import { SlideData } from "../../App";

interface Props {
  data: SlideData;
  width?: number;
  height?: number;
}

export function T03BWEditorial({ data, width = 540, height = 960 }: Props) {
  const overlayOpacity = (data.overlayOpacity ?? 70) / 100;

  return (
    <div
      className="relative overflow-hidden bg-[#0A0A0A]"
      style={{ width: `${width}px`, height: `${height}px`, filter: "grayscale(100%)" }}
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
              "linear-gradient(145deg,#c8c5be 0%,#9a9690 40%,#6a6662 75%,#404040 100%)",
          }}
        />
      )}

      {/* Gradient vignette — strong bottom with variable opacity */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background:
            `linear-gradient(0deg, rgba(0,0,0,${overlayOpacity * 0.92}) 0%, rgba(0,0,0,${overlayOpacity * 0.58}) 40%, rgba(0,0,0,${overlayOpacity * 0.15}) 65%, transparent 100%)`,
        }}
      />

      {/* Text block — bottom center */}
      <div className="absolute bottom-0 left-0 right-0 px-9 pb-12 pt-8 z-20 text-center pointer-events-none">
        {/* Tag */}
        {data.tag && (
          <p
            className="tracking-[0.32em] uppercase mb-3 font-medium"
            style={{ fontSize: "9px", color: "rgba(255,255,255,0.35)" }}
          >
            {data.tag}
          </p>
        )}

        {/* Title */}
        {data.title && (
          <h1
            className="font-[family-name:var(--font-display)] text-white uppercase leading-[0.88]"
            style={{
              fontSize: "54px",
              letterSpacing: "0.01em",
              whiteSpace: "pre-line",
            }}
          >
            {data.title}
          </h1>
        )}

        {/* Subtitle */}
        {data.subtitle && (
          <p
            className="font-light leading-[1.55] mt-3 mx-auto"
            style={{
              fontSize: "12px",
              color: "rgba(255,255,255,0.65)",
              maxWidth: "320px",
            }}
          >
            {data.subtitle}
          </p>
        )}
      </div>

      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] z-30 pointer-events-none"
        style={{ background: "rgba(255,255,255,0.18)" }}
      />

      {/* Bottom brand */}
      <div
        className="absolute bottom-6 right-8 z-30 font-[family-name:var(--font-display)] tracking-[0.28em] uppercase pointer-events-none"
        style={{ fontSize: "9px", color: "rgba(255,255,255,0.20)" }}
      >
        VERSA
      </div>
    </div>
  );
}