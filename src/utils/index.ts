// Utility helpers used across the app

/**
 * Convert a menu label to an in-page anchor href.
 * Examples: "About Me" -> "#about-me", "Hakkımda" -> "#hakkimda"
 */
export const toSectionHref = (label: string): string => {
  // Transliterate common Turkish characters to ASCII first
  const charMap: Record<string, string> = {
    ç: "c",
    Ç: "c",
    ğ: "g",
    Ğ: "g",
    ı: "i",
    İ: "i",
    ö: "o",
    Ö: "o",
    ş: "s",
    Ş: "s",
    ü: "u",
    Ü: "u",
  };

  const normalized = label
    .split("")
    .map((ch) => charMap[ch] ?? ch)
    .join("")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  const slug = normalized
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/(^-|-$)/g, "");

  return `#${slug}`;
};
