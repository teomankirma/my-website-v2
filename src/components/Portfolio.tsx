import { PageSection, PortfolioCard, Stagger, Item } from "@/components/common";
import { useAppStore } from "@/hooks/useAppStore";
import { translations } from "@/i18n";

export const Portfolio = () => {
  const { language } = useAppStore();
  const t = translations[language];
  const headerLabel = t.menuItems[3];

  return (
    <PageSection menuIndex={3} header={headerLabel}>
      <div className="container mx-auto px-6 md:px-10">
        <Stagger>
          <Item>
            <p className="text-lg font-medium py-8 text-center text-foreground/70">
              {t.portfolio.subtitle}
            </p>
          </Item>
          <Item>
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {t.portfolio.items?.map((item) => (
                <Item key={item.key}>
                  <PortfolioCard
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
                </Item>
              ))}
            </div>
          </Item>
        </Stagger>
      </div>
    </PageSection>
  );
};
