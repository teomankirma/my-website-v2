import type { SectionHeaderProps } from "@/types";
import { Reveal } from "./Animations";

export function SectionHeader({ header }: SectionHeaderProps) {
  return (
    <Reveal className="text-center pb-4" staggerChildren stagger={0.1}>
      <h2 className="reveal-item text-3xl md:text-5xl font-bold tracking-tight pb-2">
        {header}
      </h2>
      <div className="reveal-item mt-2 md:mt-3 h-1 w-16 mx-auto bg-primary rounded-full origin-left" />
    </Reveal>
  );
}
