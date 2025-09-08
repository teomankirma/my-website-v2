import { SectionHeader } from "@/components/common";

import { useAppStore } from "@/hooks/useAppStore";
import { translations } from "@/i18n";
// import { toSectionHref } from "@/utils";

export const Portfolio = () => {
  const { language } = useAppStore();
  const { menuItems } = translations[language];
  const headerLabel = menuItems[3];
  // const sectionId = toSectionHref(headerLabel).slice(1);

  return <SectionHeader header={headerLabel} />;
};
