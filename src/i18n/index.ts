import type { Translations } from "@/types";
// import { DateTime } from "luxon";

// const age = DateTime.now().diff(DateTime.fromISO("2002-07-27"), "years").years;

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

    //   // TODO change the variable names.
    //   knowMeMore: "Know Me More",

    //   whoAmIFirst: "I'm",
    //   whoAmISecond: " a Frontend Developer",
    //   aboutMe: `Hello, my name is Teoman. I'm ${age} years old and I'm studying Software Engineering at Nisantasi University. I live in Istanbul. I love playing basketball, playing the guitar, and playing video games. I aim to be a Frontend Developer or a Full-Stack Developer.`,
    //   myExperiences:
    //     "I have working experience with front-end languages and frameworks such as React, Next.js, Tailwind CSS, and TypeScript.",

    //   nameText: "Name: ",
    //   emailText: "Email: ",
    //   email: "teomankirma@gmail.com",
    //   ageText: "Age: ",
    //   age: age,
    //   fromText: "From: ",
    //   from: "Istanbul, Turkiye",

    //   downloadResume: "Download Resume",

    //   experienceYear: "3+",
    //   experienceText: "Years Experience",

    //   projectsNumber: "30+",
    //   projectsText: "Projects Done",
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
    location: "Los Angeles, CA'da yaşıyorum.",
    hireMe: "Beni İşe Alın",
  },
};
