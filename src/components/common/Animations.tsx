import { useRef, type ElementType, type PropsWithChildren } from "react";
import { useGSAP, gsap, SplitText } from "@/lib/gsap";

type Variant =
  | "fadeUp"
  | "fadeIn"
  | "slideLeft"
  | "slideRight"
  | "zoomIn"
  | "splitChars"
  | "splitWords";

type RevealProps = PropsWithChildren<{
  as?: ElementType;
  className?: string;
  variant?: Variant;
  delay?: number;
  stagger?: number;
  /** When true, each direct child becomes a staggered item via the `.reveal-item` class. */
  staggerChildren?: boolean;
  /** ScrollTrigger start position (default "top 80%"). */
  start?: string;
}>;

const fromMap = {
  fadeUp: { y: 24, autoAlpha: 0 },
  fadeIn: { autoAlpha: 0 },
  slideLeft: { x: -32, autoAlpha: 0 },
  slideRight: { x: 32, autoAlpha: 0 },
  zoomIn: { scale: 0.95, autoAlpha: 0 },
  splitChars: { y: 24, autoAlpha: 0 },
  splitWords: { y: 24, autoAlpha: 0 },
} as const;

export function Reveal({
  as: Tag = "div",
  className,
  variant = "fadeUp",
  delay = 0,
  stagger = 0.08,
  staggerChildren = false,
  start = "top 80%",
  children,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!ref.current) return;
      const base = { ...fromMap[variant], ease: "power3.out", delay };
      const scrollTrigger = {
        trigger: ref.current,
        start,
        once: true,
      };

      if (variant === "splitChars" || variant === "splitWords") {
        const target = ref.current.firstElementChild as HTMLElement | null;
        if (!target) return;
        const split = SplitText.create(target, {
          type: variant === "splitChars" ? "chars" : "words",
        });
        const targets = variant === "splitChars" ? split.chars : split.words;
        gsap.from(targets, {
          ...base,
          stagger,
          duration: 0.5,
          scrollTrigger,
        });
        return () => split.revert();
      }

      if (staggerChildren) {
        gsap.from(ref.current.querySelectorAll(":scope > .reveal-item"), {
          ...base,
          stagger,
          scrollTrigger,
        });
      } else {
        gsap.from(ref.current, {
          ...base,
          scrollTrigger,
        });
      }
    },
    { scope: ref }
  );

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
