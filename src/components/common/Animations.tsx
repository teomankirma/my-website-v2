import type { PropsWithChildren } from "react";
import { motion, AnimatePresence } from "motion/react";

// Reusable animation primitives for sections/components.
// These use Motion v12 (package: `motion`) and are safe on SSR.

const viewport = { once: true, amount: 0.2 } as const;

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

type StaggerProps = PropsWithChildren<{
  className?: string;
  delay?: number;
  stagger?: number;
}>;

export const Stagger: React.FC<StaggerProps> = ({
  children,
  className,
  delay = 0.05,
  stagger = 0.12,
}) => (
  <motion.div
    className={className}
    initial="hidden"
    whileInView="show"
    viewport={viewport}
    variants={{
      hidden: {},
      show: { transition: { staggerChildren: stagger, delayChildren: delay } },
    }}
  >
    {children}
  </motion.div>
);

type ItemProps = PropsWithChildren<{ className?: string; variant?: keyof typeof variants }>;

export const Item: React.FC<ItemProps> = ({ children, className, variant = "fadeInUp" }) => (
  <motion.div className={className} variants={variants[variant]}>
    {children}
  </motion.div>
);

type RevealProps = PropsWithChildren<{
  className?: string;
  variant?: keyof typeof variants;
  delay?: number;
}>;

export const Reveal: React.FC<RevealProps> = ({ children, className, variant = "fadeInUp", delay = 0 }) => (
  <motion.div
    className={className}
    initial="hidden"
    whileInView="show"
    viewport={viewport}
    variants={variants[variant]}
    transition={{ delay }}
  >
    {children}
  </motion.div>
);

// Named re-exports for convenience where needed
export { motion, AnimatePresence };

// Generic hover/press wrapper for interactive elements (buttons, cards)
type HoverProps = PropsWithChildren<{
  className?: string;
  scale?: number;
  lift?: number; // translateY negative value on hover
}>;

export const Hover: React.FC<HoverProps> = ({ children, className, scale = 1.03, lift = 2 }) => (
  <motion.div
    className={className}
    whileHover={{ scale, y: -lift }}
    whileTap={{ scale: 0.98, y: 0 }}
    transition={{ type: "spring", stiffness: 300, damping: 20 }}
  >
    {children}
  </motion.div>
);
