import { PageSection, PortfolioCard } from "@/components/common";
import { useAppStore } from "@/hooks/useAppStore";
import { translations } from "@/i18n";

export const Portfolio = () => {
  const { language } = useAppStore();
  const { menuItems, portfolioItems, portfolioSubtitle } =
    translations[language];
  const headerLabel = menuItems[3];

  return (
    <PageSection menuIndex={3} header={headerLabel}>
      <div className="container mx-auto px-6 md:px-10">
        <p className="text-lg font-medium py-8 text-center text-foreground/70">
          {portfolioSubtitle}
        </p>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {portfolioItems?.map((item) => (
            <PortfolioCard
              key={item.key}
              title={item.title}
              imageSrc={item.imageSrc}
              imageAlt={item.imageAlt}
              dummyText={item.description}
              linkHref={item.details.linkHref}
              linkLabel={item.details.linkLabel}
              technologies={item.details.technologies}
              industry={item.details.industry}
              date={item.details.date}
            />
          ))}
        </div>
      </div>
    </PageSection>
  );
};
