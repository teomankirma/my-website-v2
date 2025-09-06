export const Language = {
  TR: "tr",
  EN: "en",
} as const;

export type Language = (typeof Language)[keyof typeof Language];

// Unified translation shape with core required fields and optional extras
export type Translation = {
  name: string;
  menuItems: string[];
  welcome: string;
  typewriter: string[];
  location: string;
  hireMe: string;
  knowMeMore: string;
  whoAmIA: string;
  whoAmIB: string;
  aboutMe: string;
  myExperiences: string;
  nameLabel: string;
  emailLabel: string;
  ageLabel: string;
  age: number;
  fromLabel: string;
  from: string;
  downloadResume: string;
  experienceYear: string;
  experienceText: string;
  projectsNumber: string;
  projectsLabel: string;
};

export type Translations = {
  en: Translation;
  tr: Translation;
};

export type SectionHeaderProps = {
  header: string;
};
