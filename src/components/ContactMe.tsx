import { PageSection } from "@/components/common";
import { useAppStore } from "@/hooks/useAppStore";
import { translations } from "@/i18n";

export const ContactMe = () => {
  const { language } = useAppStore();
  const { menuItems } = translations[language];
  const headerLabel = menuItems[5];

  return (
    <PageSection menuIndex={5} header={headerLabel}>
      <div className="container mx-auto px-6 md:px-10">
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16"></div>
      </div>
    </PageSection>
  );
};
