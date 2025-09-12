import type { ReactNode } from "react";

export const Language = {
  TR: "tr",
  EN: "en",
} as const;

export type Language = (typeof Language)[keyof typeof Language];

export type Translation = {
  headTitle: string;
  name: string;
  menuItems: string[];
  home: {
    welcome: string;
    typewriter: string[];
    location: string;
    hireMe: string;
  };
  about: {
    knowMeMore: string;
    whoAmIA: string;
    whoAmIB: string;
    aboutMe: string;
    myExperiences: string;
  };
  profile: {
    nameLabel: string;
    emailLabel: string;
    ageLabel: string;
    age: number;
    fromLabel: string;
    from: string;
    downloadResume: string;
  };
  stats: {
    experienceYear: string;
    experienceText: string;
    projectsNumber: string;
    projectsLabel: string;
  };
  resume: {
    eduTitle: string;
    expTitle: string;
    schoolName: string;
    degree: string;
    gpaLabel: string;
    expRole: string;
    expDates: string;
    expLocation: string;
  };
  portfolio: {
    subtitle: string;
    cardLabels: {
      projectInfo: string;
      projectDetails: string;
      link: string;
      technologies: string;
      industry: string;
      date: string;
    };
    items: PortfolioItem[];
  };
  footer: {
    footerCopyright: string;
    copyrightLabel: string;
  };
  testimonial: {
    items: LocaleTestimonial[];
  };
  contactValidation: {
    name_required: string;
    name_min: string;
    name_max: string;
    email_required: string;
    email_invalid: string;
    email_max: string;
    message_required: string;
    message_min: string;
    message_max: string;
  };
  contact: {
    title: string;
    followMe: string;
    sendMeANote: string;
    yourNameLabel: string;
    messageLabel: string;
    messagePlaceholder: string;
    sendMessageButton: string;
    toast: {
      notConfiguredTitle: string;
      notConfiguredDescription: string;
      successTitle: string;
      successDescription: string;
      failedTitle: string;
      failedDescription: string;
    };
  };
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
  socialLinks: {
    x: string;
    github: string;
    linkedin: string;
  };
  portfolio: {
    [key: string]: {
      key: string;
      title: string;
      imageSrc: string;
      technologies: string;
      linkHref: string;
    };
  };
  testimonials: {
    [key: string]: {
      key: string;
      name: string;
      rating: number;
    };
  };
  currentYear: number;
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
  linkLabel: string;
};

export type PortfolioItem = {
  key: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  details: ProjectDetails;
};

export type LocaleTestimonial = {
  key: string; // references sharedI18n.testimonials[key]
  title: string; // localized title/subtitle
  quote: string; // localized quote
};

// Contact form values
export type ContactFormValues = {
  name: string;
  email: string;
  message: string;
};
