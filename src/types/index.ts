import type { ReactNode } from "react";

export const Language = {
  TR: "tr",
  EN: "en",
} as const;

export type Language = (typeof Language)[keyof typeof Language];

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
  eduTitle: string;
  expTitle: string;
  schoolName: string;
  degree: string;
  gpaLabel: string;
  expRole: string;
  expDates: string;
  expLocation: string;
  portfolioCardLabels: {
    projectInfo: string;
    projectDetails: string;
    link: string;
    technologies: string;
    industry: string;
    date: string;
    viewProject: string;
  };
  portfolioItems: PortfolioItem[];
};

export type Translations = Record<Language, Translation>;

export type SharedI18n = {
  email: string;
  eduYears: string;
  companyName: string;
  gpa: string;
  react: string;
  typescript: string;
  tailwind: string;
  nextjs: string;
  zustand: string;
  tanstack: string;
  portfolio: {
    [key: string]: {
      key: string;
      title: string;
      imageSrc: string;
      technologies: string;
      linkHref: string;
    };
  };
};

export type SectionHeaderProps = {
  header: string;
};

export type PageSectionProps = {
  menuIndex: number;
  header?: string;
  className?: string;
  children?: ReactNode;
};

export type PortfolioCardProps = Pick<
  PortfolioItem,
  "title" | "imageSrc" | "imageAlt"
> & { dummyText: string } & ProjectDetails;

export type ProjectDetails = {
  technologies: string;
  industry: string;
  date: string;
  linkHref: string;
  linkLabel?: string;
};

export type PortfolioItem = {
  key: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  details: ProjectDetails;
};
