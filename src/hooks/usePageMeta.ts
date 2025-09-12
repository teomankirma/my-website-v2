import { useEffect } from "react";
import { useAppStore } from "@/hooks/useAppStore";
import { translations } from "@/i18n";

/**
 * Keeps the document title and <html lang> in sync with i18n.
 * Title pattern: "{name} — {role}" derived from translations.
 */
export function usePageMeta() {
  const { language } = useAppStore();

  useEffect(() => {
    const { headTitle, name, about } = translations[language];
    const nextTitle = headTitle || name;
    if (document.title !== nextTitle) document.title = nextTitle;
    // Reflect active language for accessibility and SEO
    if (document.documentElement.lang !== language) {
      document.documentElement.lang = language;
    }

    // Optionally sync a meta description if present in the DOM
    const meta = document.querySelector('meta[name="description"]');
    const description = about.aboutMe;
    if (meta && meta.getAttribute("content") !== description) {
      meta.setAttribute("content", description);
    }
  }, [language]);
}
