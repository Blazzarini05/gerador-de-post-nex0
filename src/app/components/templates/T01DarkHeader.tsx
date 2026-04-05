import { motion } from "motion/react";
import { SlideData, TextPosition, AnimationType } from "../../App";
import { getTextAnimationVariants } from "../animationUtils";

interface Props {
  data: SlideData;
  width?: number;
  height?: number;
  globalAnimation?: AnimationType;
}

function getHeaderPosition(pos: TextPosition): React.CSSProperties {
  switch (pos) {
    case "top":
      return { top: 0 };
    case "center":
      return { top: "50%", transform: "translateY(-50%)" };
    case "bottom":
    default:
      return { bottom: 0 };
  }
}

export function T01DarkHeader({ data, width = 540, height = 960, globalAnimation }: Props) {
  const overlayOpacity = (data.overlayOpacity ?? 70) / 100;
  const pos: TextPosition = data.textPosition ?? "top";
  const bgScale = data.imageScale ?? 1;
  const bgX = Math.max(-45, Math.min(45, data.imageOffsetX ?? 0));
  const bgY = Math.max(-45, Math.min(45, data.imageOffsetY ?? 0));
  const bgPos = `${50 + bgX}% ${50 + bgY}%`;
  const bgSize = `${Math.max(100, Math.min(300, bgScale * 100))}%`;
  const titleAnimation = getTextAnimationVariants(
    data.titleAnimation ?? (globalAnimation as any) ?? "none",
    data.titleAnimationDuration ?? 1.1,
    data.titleAnimationDelay ?? 0
  );
  const subtitleAnimation = getTextAnimationVariants(
    data.subtitleAnimation ?? (globalAnimation as any) ?? "none",
    data.subtitleAnimationDuration ?? 1.1,
    data.subtitleAnimationDelay ?? 0.2
  );
  const tagAnimation = getTextAnimationVariants(
    data.tagAnimation ?? (globalAnimation as any) ?? "none",
    data.tagAnimationDuration ?? 0.9,
    data.tagAnimationDelay ?? 0.4
  );

  return (
    <div
      className="relative overflow-hidden bg-[#0A0A0A]"
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      {/* Background photo — background-image preserves aspect ratio via cover */}
      {data.imageUrl ? (
        <>
          {/* Hidden img tag forces CORS cache entry so html2canvas can read background-image */}
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

      {/* Dark header block — repositionable */}
      <div
        className="absolute left-0 right-0 z-20 flex flex-col items-center justify-center px-10 py-10 pointer-events-none"
        style={{
          ...getHeaderPosition(pos),
          background: `rgba(10,10,10,${Math.min(0.95, overlayOpacity + 0.2)})`,
          minHeight: "290px",
        }}
      >
        {data.tag && (
          <motion.p
            initial={tagAnimation.initial}
            animate={tagAnimation.animate}
            className="tracking-[0.3em] uppercase mb-4 font-medium"
            style={{ fontSize: "9px", color: "rgba(255,255,255,0.40)" }}
          >
            {data.tag}
          </motion.p>
        )}
        {data.title && (
          <motion.h1
            initial={titleAnimation.initial}
            animate={titleAnimation.animate}
            className="font-[family-name:var(--font-display)] text-white uppercase text-center leading-[0.93]"
            style={{ fontSize: "40px", letterSpacing: "0.015em", whiteSpace: "pre-line" }}
          >
            {data.title}
          </motion.h1>
        )}
        {data.subtitle && (
          <>
            <div className="w-full my-5" style={{ height: "1px", background: "rgba(255,255,255,0.22)" }} />
            <motion.p
              initial={subtitleAnimation.initial}
              animate={subtitleAnimation.animate}
              className="font-light text-center leading-[1.55]"
              style={{ fontSize: "13px", color: "rgba(255,255,255,0.75)", maxWidth: "340px" }}
            >
              {data.subtitle}
            </motion.p>
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
