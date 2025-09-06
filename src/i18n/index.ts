import type { Translations } from "@/types";
import { DateTime } from "luxon";

const age = Math.floor(
  DateTime.now().diff(DateTime.fromISO("2002-07-27"), "years").years
);
const experienceYears = DateTime.now().year - 2020;

export const translations: Translations = {
  en: {
    name: "Teoman Kirma",
    menuItems: [
      "Home",
      "About Me",
      "What I Do",
      "Resume",
      "Portfolio",
      "Testimonial",
      "Contact Me",
    ],
    welcome: "Welcome",
    typewriter: [
      "I'm Teoman Kirma.",
      "I'm a Software Engineer.",
      "I'm a Frontend Developer.",
    ],
    location: "based in Los Angeles, CA.",
    hireMe: "Hire Me",
    knowMeMore: "Know Me More",
    whoAmIA: "I'm",
    whoAmIB: "a Frontend Developer",
    aboutMe:
      "Hello, my name is Teoman. I graduated with a degree in Software Engineering from Nisantasi University with a GPA of 3.36. I live in Los Angeles and work as a Frontend Developer. I enjoy playing basketball, guitar, and video games.",
    myExperiences:
      "I'm a Frontend Developer with experience building scalable and responsive interfaces using React, Next.js, TypeScript, and Tailwind CSS. I've also worked with state management (Zustand), testing (Jest, Cypress), and UI documentation tools like Storybook.",
    nameLabel: "Name",
    emailLabel: "Email",
    ageLabel: "Age",
    age: age,
    fromLabel: "From",
    from: "Los Angeles, CA",
    downloadResume: "Download Resume",
    experienceYear: `${experienceYears}`,
    experienceText: "Years Experience",
    projectsNumber: "40",
    projectsLabel: "Projects Done",
  },
  tr: {
    name: "Teoman Kırma",
    menuItems: [
      "Anasayfa",
      "Hakkımda",
      "Ne Yapıyorum",
      "Özgeçmiş",
      "Portföy",
      "Referanslar",
      "Bana Ulaşın",
    ],

    welcome: "Hoş Geldiniz",
    typewriter: [
      "Ben Teoman Kırma.",
      "Yazılım Mühendisiyim.",
      "Frontend Developer'ım.",
    ],
    location: "Los Angeles, CA merkezliyim.",
    hireMe: "Beni İşe Al",
    knowMeMore: "Beni Daha Yakından Tanıyın",
    whoAmIA: "Ben",
    whoAmIB: "bir Frontend Developer'ım",
    aboutMe:
      "Merhaba, benim adım Teoman. Nişantaşı Üniversitesi Yazılım Mühendisliği bölümünden 3.36 not ortalamasıyla mezun oldum. Los Angeles'ta yaşıyor ve Frontend Developer olarak çalışıyorum. Hobilerim arasında basketbol, gitar çalmak ve video oyunları yer alıyor.",
    myExperiences:
      "Frontend Developer olarak scalable ve responsive arayüzler geliştirme deneyimine sahibim. React, Next.js, TypeScript ve Tailwind CSS ile çalışma tecrübem var. Ayrıca Zustand ile state management, Jest ve Cypress ile testing ve Storybook ile UI documentation konularında da tecrübem bulunuyor.",
    nameLabel: "İsim",
    emailLabel: "E-posta",
    ageLabel: "Yaş",
    age: age,
    fromLabel: "Konum",
    from: "Los Angeles, CA",
    downloadResume: "CV İndir",
    experienceYear: `${experienceYears}`,
    experienceText: "Yıllık Deneyim",
    projectsNumber: "40",
    projectsLabel: "Tamamlanan Proje",
  },
};
