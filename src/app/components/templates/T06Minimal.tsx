import { motion } from "motion/react";
import { SlideData, TextPosition, AnimationType } from "../../App";
import { getTextAnimationVariants } from "../animationUtils";

interface Props {
  data: SlideData;
  width?: number;
  height?: number;
  globalAnimation?: AnimationType;
}

export function T06Minimal({ data, width = 540, height = 960, globalAnimation }: Props) {
  const overlayOpacity = (data.overlayOpacity ?? 70) / 100;
  const pos: TextPosition = data.textPosition ?? "center";
  const ts = Math.max(0.75, Math.min(1.4, data.textScale ?? 1));
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

      <motion.div
        initial={tagAnimation.initial}
        animate={tagAnimation.animate}
        className="font-medium tracking-[0.32em] uppercase relative z-20 pointer-events-none"
        style={{ fontSize: "9px", color: "rgba(255,255,255,0.30)" }}
      >
        {data.tag || "NEXO"}
      </motion.div>

      <div
        className="flex-1 flex relative z-20 pointer-events-none"
        style={{ alignItems: contentJustify, paddingTop: "8px", paddingBottom: "8px" }}
      >
        <div>
          {data.title && (
            <motion.h1
              initial={titleAnimation.initial}
              animate={titleAnimation.animate}
              className="font-[family-name:var(--font-display)] text-white uppercase leading-[0.88]"
              style={{ fontSize: `${Math.round(59 * ts)}px`, letterSpacing: "0.01em", whiteSpace: "pre-line" }}
            >
              {data.title}
            </motion.h1>
          )}
          {data.subtitle && (
            <>
              <div className="mt-7 mb-5" style={{ height: "1px", background: "rgba(255,255,255,0.12)" }} />
              <motion.p
                initial={subtitleAnimation.initial}
                animate={subtitleAnimation.animate}
                className="font-light leading-[1.65]"
                style={{ fontSize: `${Math.round(11 * ts)}px`, color: "rgba(255,255,255,0.50)", maxWidth: "320px" }}
              >
                {data.subtitle}
              </motion.p>
            </>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center relative z-20 pointer-events-none">
        <div
          className="font-[family-name:var(--font-display)] tracking-[0.24em] uppercase"
          style={{ fontSize: "14px", color: "rgba(255,255,255,0.60)" }}
        >
          NEXO
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white opacity-10 z-20 pointer-events-none" />
    </div>
  );
}
