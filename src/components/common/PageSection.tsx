import { useAppStore } from "@/hooks/useAppStore";
import { translations } from "@/i18n";
import { toSectionHref } from "@/utils";
import { SectionHeader } from "./SectionHeader";
import type { PageSectionProps } from "@/types";

export const PageSection = ({
  menuIndex,
  header,
  className,
  children,
}: PageSectionProps) => {
  const { language } = useAppStore();
  const { menuItems } = translations[language];
  const id = toSectionHref(menuItems[menuIndex]).slice(1);

  const sectionClass = `section py-20 md:py-28${className ? ` ${className}` : ""}`;

  return (
    <section id={id} className={sectionClass}>
      {header ? (
        <div className="container mx-auto px-6 md:px-10">
          <SectionHeader header={header} />
        </div>
      ) : null}
      {children}
    </section>
  );
};
