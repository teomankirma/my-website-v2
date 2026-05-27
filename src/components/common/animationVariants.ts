export const variants = {
  fadeInUp: {
    hidden: { opacity: 0, y: 24 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  },
  fadeIn: {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
  },
  slideInLeft: {
    hidden: { opacity: 0, x: -32 },
    show: { opacity: 1, x: 0, transition: { duration: 0.55, ease: "easeOut" } },
  },
  slideInRight: {
    hidden: { opacity: 0, x: 32 },
    show: { opacity: 1, x: 0, transition: { duration: 0.55, ease: "easeOut" } },
  },
  zoomIn: {
    hidden: { opacity: 0, scale: 0.95 },
    show: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.45, ease: "easeOut" },
    },
  },
} as const;

export type AnimationVariantKey = keyof typeof variants;
