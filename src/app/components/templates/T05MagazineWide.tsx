import { motion } from "motion/react";
import { SlideData, TextPosition, AnimationType } from "../../App";
import { getTextAnimationVariants } from "../animationUtils";

interface Props {
  data: SlideData;
  width?: number;
  height?: number;
  globalAnimation?: AnimationType;
}

export function T05MagazineWide({ data, width = 960, height = 540, globalAnimation }: Props) {
  const overlayOpacity = (data.overlayOpacity ?? 70) / 100;
  const pos: TextPosition = data.textPosition ?? "bottom";
  const ts = Math.max(0.75, Math.min(1.4, data.textScale ?? 1));
  const bgScale = data.imageScale ?? 1;
  const bgX = Math.max(-45, Math.min(45, data.imageOffsetX ?? 0));
  const bgY = Math.max(-45, Math.min(45, data.imageOffsetY ?? 0));
  const bgPos = `${50 + bgX}% ${50 + bgY}%`;
  const bgSize = `${Math.max(100, Math.min(300, bgScale * 100))}%`;
  const titleAnimation = getTextAnimationVariants(
    data.titleAnimation ?? globalAnimation ?? "none",
    data.titleAnimationDuration ?? 1.1,
    data.titleAnimationDelay ?? 0
  );
  const subtitleAnimation = getTextAnimationVariants(
    data.subtitleAnimation ?? globalAnimation ?? "none",
    data.subtitleAnimationDuration ?? 1.1,
    data.subtitleAnimationDelay ?? 0.2
  );
  const tagAnimation = getTextAnimationVariants(
    data.tagAnimation ?? globalAnimation ?? "none",
    data.tagAnimationDuration ?? 0.9,
    data.tagAnimationDelay ?? 0.4
  );

  const textAlign =
    pos === "top" ? "flex-start" : pos === "center" ? "center" : "flex-end";

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
          style={{ background: "linear-gradient(135deg,#0d1520 0%,#1a2d44 50%,#2d4a6a 100%)" }}
        />
      )}

      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background: `linear-gradient(90deg, rgba(10,10,10,${overlayOpacity * 0.92}) 0%, rgba(10,10,10,${overlayOpacity * 0.70}) 35%, rgba(10,10,10,${overlayOpacity * 0.25}) 60%, transparent 100%)`,
        }}
      />

      <div
        className="absolute inset-0 z-20 flex flex-col px-14 py-11 pointer-events-none"
        style={{ maxWidth: "55%", justifyContent: textAlign }}
      >
        {data.tag && (
          <motion.p
            initial={tagAnimation.initial}
            animate={tagAnimation.animate}
            className="tracking-[0.32em] uppercase mb-3 font-medium"
            style={{ fontSize: "8px", color: "rgba(255,255,255,0.35)" }}
          >
            {data.tag}
          </motion.p>
        )}
        {data.title && (
          <motion.h1
            initial={titleAnimation.initial}
            animate={titleAnimation.animate}
            className="font-[family-name:var(--font-display)] text-white uppercase leading-[0.90]"
            style={{ fontSize: `${Math.round(43 * ts)}px`, letterSpacing: "0.015em", whiteSpace: "pre-line" }}
          >
            {data.title}
          </motion.h1>
        )}
        {data.subtitle && (
          <>
            <div className="my-4" style={{ width: "36px", height: "1px", background: "rgba(255,255,255,0.30)" }} />
            <motion.p
              initial={subtitleAnimation.initial}
              animate={subtitleAnimation.animate}
              className="font-light leading-[1.55]"
              style={{ fontSize: `${Math.round(14 * ts)}px`, color: "rgba(255,255,255,0.70)", maxWidth: "300px" }}
            >
              {data.subtitle}
            </motion.p>
          </>
        )}
      </div>

      <div
        className="absolute right-10 bottom-10 z-[2] w-[64px] h-[64px] rounded-full border flex items-center justify-center font-[family-name:var(--font-display)] text-center leading-[1.2] tracking-[0.18em] uppercase pointer-events-none"
        style={{ borderColor: "rgba(255,255,255,0.20)", color: "rgba(255,255,255,0.45)", fontSize: "8px" }}
      >
        NEXO
      </div>
      <div
        className="absolute top-0 left-0 right-0 h-[2px] z-[3] pointer-events-none"
        style={{ background: "rgba(255,255,255,0.12)" }}
      />
    </div>
  );
}
