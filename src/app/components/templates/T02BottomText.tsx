import { SlideData } from "../../App";

interface Props {
  data: SlideData;
  width?: number;
  height?: number;
}

export function T02BottomText({ data, width = 540, height = 960 }: Props) {
  const overlayOpacity = (data.overlayOpacity ?? 70) / 100;

  return (
    <div
      className="relative overflow-hidden bg-[#0A0A0A]"
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      {/* Full-bleed background photo */}
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
              "linear-gradient(160deg,#1a4060 0%,#12283a 40%,#0d1a26 100%)",
          }}
        />
      )}

      {/* Gradient vignette — bottom to top with variable opacity */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background:
            `linear-gradient(0deg, rgba(10,10,10,${overlayOpacity * 0.92}) 0%, rgba(10,10,10,${overlayOpacity * 0.65}) 38%, rgba(10,10,10,${overlayOpacity * 0.15}) 65%, transparent 100%)`,
        }}
      />

      {/* Text block — bottom left */}
      <div
        className="absolute bottom-0 left-0 right-0 px-9 pb-12 pt-8 z-20 pointer-events-none"
      >
        {/* Tag */}
        {data.tag && (
          <p
            className="tracking-[0.3em] uppercase mb-3 font-medium"
            style={{ fontSize: "9px", color: "rgba(255,255,255,0.38)" }}
          >
            {data.tag}
          </p>
        )}

        {/* Title */}
        {data.title && (
          <h1
            className="font-[family-name:var(--font-display)] text-white uppercase leading-[0.88]"
            style={{
              fontSize: "50px",
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
            className="font-light leading-[1.5] mt-3"
            style={{
              fontSize: "12px",
              color: "rgba(255,255,255,0.72)",
              maxWidth: "280px",
            }}
          >
            {data.subtitle}
          </p>
        )}
      </div>

      {/* Bottom-right brand mark */}
      <div
        className="absolute bottom-7 right-8 z-20 font-[family-name:var(--font-display)] tracking-[0.28em] uppercase pointer-events-none"
        style={{ fontSize: "9px", color: "rgba(255,255,255,0.22)" }}
      >
        VV
      </div>
    </div>
  );
}