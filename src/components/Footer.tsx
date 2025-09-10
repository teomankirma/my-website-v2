import { useAppStore } from "@/hooks/useAppStore";
import { sharedI18n, translations } from "@/i18n";

export const Footer = () => {
  const { language } = useAppStore();
  const t = translations[language];
  const { footerCopyright, copyrightLabel } = t.footer;
  const { currentYear } = sharedI18n;

  return (
    <footer className="py-10 md:py-12">
      <div className="container mx-auto px-6 md:px-10">
        <p className="text-center text-foreground/90 text-base md:text-lg font-medium">
          {`${copyrightLabel} © ${currentYear} ${t.name}. ${footerCopyright}`}
        </p>
      </div>
    </footer>
  );
};
