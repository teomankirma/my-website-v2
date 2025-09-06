export const Language = {
  TR: "tr",
  EN: "en",
} as const;

export type Language = (typeof Language)[keyof typeof Language];

// One unified translations object per language, with
// specific known keys and room for future nested groups.
export type TranslationValue = string | string[] | TranslationGroup;
export interface TranslationGroup {
  [key: string]: TranslationValue;
}

export type Translations = Record<
  Language,
  TranslationGroup & {
    name: string;
    menuItems: string[];
    welcome: string;
    typewriter: string[];
    location: string;
    hireMe: string;
  }
>;
