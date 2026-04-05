import type { AnimationType } from "../App";

export function getTextAnimationVariants(
    type: AnimationType,
    duration = 1.1,
    delay = 0
) {
    switch (type) {
        case "fade-in":
            return {
                initial: { opacity: 0 },
                animate: { opacity: 1, transition: { duration, delay, ease: "easeOut" as const } },
            };
        case "slide-up":
            return {
                initial: { opacity: 0, y: 30 },
                animate: { opacity: 1, y: 0, transition: { duration, delay, ease: [0.22, 1, 0.36, 1] as const } },
            };
        case "zoom-out":
            return {
                initial: { opacity: 0, scale: 1.1 },
                animate: { opacity: 1, scale: 1, transition: { duration: duration * 1.3, delay, ease: "easeOut" as const } },
            };
        case "reveal":
            return {
                initial: { opacity: 0, clipPath: "inset(100% 0 0 0)" },
                animate: {
                    opacity: 1,
                    clipPath: "inset(0% 0 0 0)",
                    transition: { duration, delay, ease: [0.22, 1, 0.36, 1] as const },
                },
            };
        case "drift":
            return {
                initial: { opacity: 0, x: -24 },
                animate: { opacity: 1, x: 0, transition: { duration, delay, ease: "easeOut" as const } },
            };
        default:
            return { initial: {}, animate: {} };
    }
}
