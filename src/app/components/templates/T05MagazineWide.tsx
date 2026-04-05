import { SlideData } from "../../App";

interface Props {
  data: SlideData;
  width?: number;
  height?: number;
}

export function T05MagazineWide({ data, width = 960, height = 540 }: Props) {
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
              "linear-gradient(135deg,#0d1520 0%,#1a2d44 50%,#2d4a6a 100%)",
          }}
        />
      )}

      {/* Lateral gradient — left side with variable opacity */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background:
            `linear-gradient(90deg, rgba(10,10,10,${overlayOpacity * 0.92}) 0%, rgba(10,10,10,${overlayOpacity * 0.70}) 35%, rgba(10,10,10,${overlayOpacity * 0.25}) 60%, transparent 100%)`,
        }}
      />

      {/* Content — left aligned */}
      <div
        className="absolute inset-0 z-20 flex flex-col justify-end px-14 py-11 pointer-events-none"
        style={{ maxWidth: "55%" }}
      >
        {/* Tag */}
        {data.tag && (
          <p
            className="tracking-[0.32em] uppercase mb-3 font-medium"
            style={{ fontSize: "8px", color: "rgba(255,255,255,0.35)" }}
          >
            {data.tag}
          </p>
        )}

        {/* Title */}
        {data.title && (
          <h1
            className="font-[family-name:var(--font-display)] text-white uppercase leading-[0.90]"
            style={{
              fontSize: "43px",
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
              className="my-4"
              style={{ width: "36px", height: "1px", background: "rgba(255,255,255,0.30)" }}
            />
            <p
              className="font-light leading-[1.55]"
              style={{
                fontSize: "14px",
                color: "rgba(255,255,255,0.70)",
                maxWidth: "300px",
              }}
            >
              {data.subtitle}
            </p>
          </>
        )}
      </div>

      {/* Right badge */}
      <div
        className="absolute right-10 bottom-10 z-[2] w-[64px] h-[64px] rounded-full border flex items-center justify-center font-[family-name:var(--font-display)] text-center leading-[1.2] tracking-[0.18em] uppercase pointer-events-none"
        style={{
          borderColor: "rgba(255,255,255,0.20)",
          color: "rgba(255,255,255,0.45)",
          fontSize: "8px",
        }}
      >
        VERSA<br />VISUAL
      </div>

      {/* Top accent */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] z-[3] pointer-events-none"
        style={{ background: "rgba(255,255,255,0.12)" }}
      />
    </div>
  );
}