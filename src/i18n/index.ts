import type { Translations, SharedI18n } from "@/types";
import { DateTime } from "luxon";
import atmImg from "@/assets/atm.png";

const age = Math.floor(
  DateTime.now().diff(DateTime.fromISO("2002-07-27"), "years").years
);
const experienceYears = DateTime.now().year - 2020;

export const sharedI18n: SharedI18n = {
  email: "teomankirma@gmail.com",
  eduYears: "2020–2025",
  companyName: "BytesandPixels",
  gpa: "3.36",
  react: "React",
  typescript: "TypeScript",
  tailwind: "Tailwind CSS",
  nextjs: "Next.js",
  zustand: "Zustand",
  tanstack: "TanStack Query",
  portfolio: {
    atm: {
      key: "atm",
      title: "ATM",
      imageSrc: atmImg,
      technologies: "Java",
      linkHref: "https://github.com/teomankirma/ATM",
    },
  },
};

export const translations: Translations = {
  en: {
    name: "Teoman Kirma",
    menuItems: [
      "Home",
      "About Me",
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
    // Resume
    eduTitle: "My Education",
    expTitle: "My Experience",
    schoolName: "Nisantasi University",
    degree: "B.Sc., Software Engineering",
    gpaLabel: "GPA",
    expRole: "Frontend Developer",
    expDates: "May 2023 – Present",
    expLocation: "Los Angeles, CA, US · Remote",
    portfolioCardLabels: {
      projectInfo: "Project Info",
      projectDetails: "Project Details",
      link: "Link",
      technologies: "Technologies",
      industry: "Industry",
      date: "Date",
    },
    portfolioItems: [
      {
        key: sharedI18n.portfolio.atm.key,
        title: sharedI18n.portfolio.atm.title,
        description:
          "An app where you can sign up or sign in and deposit and withdraw money from the system. You can also change your password after logging in successfully.",
        imageSrc: sharedI18n.portfolio.atm.imageSrc,
        imageAlt: "ATM project screenshot",
        details: {
          technologies: sharedI18n.portfolio.atm.technologies,
          industry: "Finance",
          date: "February 12, 2022",
          linkHref: sharedI18n.portfolio.atm.linkHref,
          linkLabel: "View on GitHub",
        },
      },
    ],
  },
  tr: {
    name: "Teoman Kırma",
    menuItems: [
      "Anasayfa",
      "Hakkımda",
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
    // Resume
    eduTitle: "Eğitimim",
    expTitle: "Deneyimim",
    schoolName: "Nişantaşı Üniversitesi",
    degree: "Yazılım Mühendisliği, Lisans",
    gpaLabel: "GNO",
    expRole: "Frontend Geliştirici",
    expDates: "Mayıs 2023 – Günümüz",
    expLocation: "Los Angeles, CA, ABD · Uzaktan",
    portfolioCardLabels: {
      projectInfo: "Proje Bilgisi",
      projectDetails: "Proje Detayları",
      link: "Bağlantı",
      technologies: "Teknolojiler",
      industry: "Sektör",
      date: "Tarih",
    },
    portfolioItems: [
      {
        key: sharedI18n.portfolio.atm.key,
        title: sharedI18n.portfolio.atm.title,
        description:
          "Kullanıcıların sisteme kayıt olup giriş yaparak para yatırıp çekebildiği bir uygulama. Başarılı girişten sonra şifrelerini de değiştirebilirler.",
        imageSrc: sharedI18n.portfolio.atm.imageSrc,
        imageAlt: "ATM proje ekran görüntüsü",
        details: {
          technologies: sharedI18n.portfolio.atm.technologies,
          industry: "Finans",
          date: "12 Şubat 2022",
          linkHref: sharedI18n.portfolio.atm.linkHref,
          linkLabel: "GitHub'da Görüntüle",
        },
      },
    ],
  },
};
