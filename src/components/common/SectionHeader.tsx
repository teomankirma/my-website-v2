import type { SectionHeaderProps } from "@/types";

export const SectionHeader = ({ header }: SectionHeaderProps) => {
  return (
    <>
      <h1>{header}</h1>
      <hr className="h-5 border-none bg-accent opacity-100 m-auto w-7" />
    </>
  );
};
