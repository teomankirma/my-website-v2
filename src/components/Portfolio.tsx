import { PageSection } from "@/components/common";
import { useAppStore } from "@/hooks/useAppStore";
import { translations } from "@/i18n";

export const Portfolio = () => {
  const { language } = useAppStore();
  const { menuItems } = translations[language];
  const headerLabel = menuItems[3];

  return (
    <PageSection menuIndex={3} header={headerLabel}>
      <div className="container mx-auto px-6 md:px-10">
        {/* Portfolio content will go here */}
      </div>
    </PageSection>
  );
};
