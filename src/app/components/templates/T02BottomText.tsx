import { motion } from "motion/react";
import { SlideData, TextPosition, AnimationType } from "../../App";
import { getTextAnimationVariants } from "../animationUtils";

interface Props {
  data: SlideData;
  width?: number;
  height?: number;
  globalAnimation?: AnimationType;
}

function getTextBlockStyle(pos: TextPosition): React.CSSProperties {
  switch (pos) {
    case "top":
      return { top: 0, paddingTop: "56px", paddingBottom: "32px" };
    case "center":
      return { top: "50%", transform: "translateY(-50%)", paddingTop: "32px", paddingBottom: "32px" };
    case "bottom":
    default:
      return { bottom: 0, paddingBottom: "48px", paddingTop: "32px" };
  }
}

function getGradientStyle(pos: TextPosition, overlayOpacity: number): string {
  switch (pos) {
    case "top":
      return `linear-gradient(180deg, rgba(10,10,10,${overlayOpacity * 0.92}) 0%, rgba(10,10,10,${overlayOpacity * 0.65}) 38%, rgba(10,10,10,${overlayOpacity * 0.15}) 65%, transparent 100%)`;
    case "center":
      return `radial-gradient(ellipse at center, rgba(10,10,10,${overlayOpacity * 0.75}) 0%, rgba(10,10,10,${overlayOpacity * 0.35}) 55%, transparent 100%)`;
    case "bottom":
    default:
      return `linear-gradient(0deg, rgba(10,10,10,${overlayOpacity * 0.92}) 0%, rgba(10,10,10,${overlayOpacity * 0.65}) 38%, rgba(10,10,10,${overlayOpacity * 0.15}) 65%, transparent 100%)`;
  }
}

export function T02BottomText({ data, width = 540, height = 960, globalAnimation }: Props) {
  const overlayOpacity = (data.overlayOpacity ?? 70) / 100;
  const pos: TextPosition = data.textPosition ?? "bottom";
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
          style={{ background: "linear-gradient(160deg,#1a4060 0%,#12283a 40%,#0d1a26 100%)" }}
        />
      )}

      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{ background: getGradientStyle(pos, overlayOpacity) }}
      />

      <div
        className="absolute left-0 right-0 px-9 z-20 pointer-events-none"
        style={getTextBlockStyle(pos)}
      >
        {data.tag && (
          <motion.p
            initial={tagAnimation.initial}
            animate={tagAnimation.animate}
            className="tracking-[0.3em] uppercase mb-3 font-medium"
            style={{ fontSize: "9px", color: "rgba(255,255,255,0.38)" }}
          >
            {data.tag}
          </motion.p>
        )}
        {data.title && (
          <motion.h1
            initial={titleAnimation.initial}
            animate={titleAnimation.animate}
            className="font-[family-name:var(--font-display)] text-white uppercase leading-[0.88]"
            style={{ fontSize: "50px", letterSpacing: "0.01em", whiteSpace: "pre-line" }}
          >
            {data.title}
          </motion.h1>
        )}
        {data.subtitle && (
          <motion.p
            initial={subtitleAnimation.initial}
            animate={subtitleAnimation.animate}
            className="font-light leading-[1.5] mt-3"
            style={{ fontSize: "12px", color: "rgba(255,255,255,0.72)", maxWidth: "280px" }}
          >
            {data.subtitle}
          </motion.p>
        )}
      </div>

      <div
        className="absolute bottom-7 right-8 z-20 font-[family-name:var(--font-display)] tracking-[0.28em] uppercase pointer-events-none"
        style={{ fontSize: "9px", color: "rgba(255,255,255,0.22)" }}
      >
        NEXO
      </div>
    </div>
  );
}
