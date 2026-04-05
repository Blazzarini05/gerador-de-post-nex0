import { motion } from "motion/react";
import { SlideData, TextPosition, AnimationType } from "../../App";
import { getTextAnimationVariants } from "../animationUtils";

interface Props {
  data: SlideData;
  width?: number;
  height?: number;
  globalAnimation?: AnimationType;
}

export function T04SquareSplit({ data, width = 540, height = 540, globalAnimation }: Props) {
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

      {/* Text section — bottom 40% */}
      <div
        className="bg-[#0A0A0A] px-8 py-6 flex flex-col relative z-20 pointer-events-none"
        style={{ justifyContent: textJustify }}
      >
        {data.tag && (
          <motion.p
            initial={tagAnimation.initial}
            animate={tagAnimation.animate}
            className="tracking-[0.28em] uppercase mb-2 font-medium"
            style={{ fontSize: "8px", color: "rgba(255,255,255,0.32)" }}
          >
            {data.tag}
          </motion.p>
        )}
        {data.title && (
          <motion.h1
            initial={titleAnimation.initial}
            animate={titleAnimation.animate}
            className="font-[family-name:var(--font-display)] text-white uppercase leading-[0.93]"
            style={{ fontSize: "27px", letterSpacing: "0.02em", whiteSpace: "pre-line" }}
          >
            {data.title}
          </motion.h1>
        )}
        {data.subtitle && (
          <>
            <div className="my-3" style={{ width: "28px", height: "1px", background: "rgba(255,255,255,0.25)" }} />
            <motion.p
              initial={subtitleAnimation.initial}
              animate={subtitleAnimation.animate}
              className="font-light leading-[1.5]"
              style={{ fontSize: "10px", color: "rgba(255,255,255,0.55)" }}
            >
              {data.subtitle}
            </motion.p>
          </>
        )}
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
