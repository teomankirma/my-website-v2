import type { SectionHeaderProps } from "@/types";

export const SectionHeader = ({ header }: SectionHeaderProps) => {
  return (
    <div className="text-center pb-4">
      <h1 className="text-3xl md:text-5xl font-bold tracking-tight pb-2">{header}</h1>
      <div className="mt-2 md:mt-3 h-1 w-16 mx-auto bg-accent rounded-full" />
    </div>
  );
};
