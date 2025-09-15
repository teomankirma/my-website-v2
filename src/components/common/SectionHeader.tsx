import type { SectionHeaderProps } from "@/types";
import { Stagger, Item } from "@/components/common";

export const SectionHeader = ({ header }: SectionHeaderProps) => {
  return (
    <Stagger className="text-center pb-4" stagger={0.08}>
      <Item>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight pb-2">{header}</h1>
      </Item>
      <Item>
        <div className="mt-2 md:mt-3 h-1 w-16 mx-auto bg-accent rounded-full" />
      </Item>
    </Stagger>
  );
};
