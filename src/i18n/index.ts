import type { Translations, SharedI18n } from "@/types";
import { DateTime } from "luxon";
import atmImg from "@/assets/atm.png";
import keeperImg from "@/assets/keeper.png";
import productListingImg from "@/assets/product-listing-generator.png";
import mongodbCrudImg from "@/assets/mongodb-crud.png";

const age = Math.floor(
  DateTime.now().diff(DateTime.fromISO("2002-07-27"), "years").years
);
const currentYear = DateTime.now().year;
const experienceYears = currentYear - 2020;

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
  socialLinks: {
    x: "https://x.com/teomankirma",
    github: "https://github.com/teomankirma",
    linkedin: "https://linkedin.com/in/teomankirma/",
  },
  portfolio: {
    atm: {
      key: "atm",
      title: "ATM",
      imageSrc: atmImg,
      technologies: "Java",
      linkHref: "https://github.com/teomankirma/ATM",
    },
    keeper: {
      key: "keeper",
      title: "Keeper",
      imageSrc: keeperImg,
      technologies: "JavaScript, React",
      linkHref: "https://github.com/teomankirma/keeper-app",
    },
    mongodbCrud: {
      key: "mongodbCrud",
      title: "MongoDB Express CRUD",
      imageSrc: mongodbCrudImg,
      technologies: "Express, MongoDB, Mongoose, Nodemon",
      linkHref: "https://github.com/teomankirma/mongodb-express-crud",
    },
    productListing: {
      key: "productListing",
      title: "Product Listing Generator",
      imageSrc: productListingImg,
      technologies:
        "Next.js 15, React 19, TypeScript 5, Tailwind CSS 4, Zustand, shadcn/ui, Vercel AI SDK",
      linkHref: "https://teo-product-listing-generator.vercel.app/",
    },
  },
  testimonials: {
    jay: { key: "jay", name: "Jay Shah", rating: 5 },
    patrick: { key: "patrick", name: "Patrick Cary", rating: 5 },
    chris: { key: "chris", name: "Chris Tom", rating: 5 },
    dennis: { key: "dennis", name: "Dennis Jacques", rating: 5 },
  },
  currentYear: currentYear,
};

export const translations: Translations = {
  en: {
    headTitle: "Teoman Kirma • Frontend Developer",
    name: "Teoman Kirma",
    menuItems: [
      "Home",
      "About Me",
      "Resume",
      "Portfolio",
      "Testimonial",
      "Contact Me",
    ],
    home: {
      welcome: "Welcome",
      typewriter: [
        "I'm Teoman Kirma.",
        "I'm a Software Engineer.",
        "I'm a Frontend Developer.",
      ],
      location: "based in Los Angeles, CA.",
      hireMe: "Hire Me",
    },
    about: {
      knowMeMore: "Know Me More",
      whoAmIA: "I'm",
      whoAmIB: "a Frontend Developer",
      aboutMe:
        "Hello, my name is Teoman. I graduated with a degree in Software Engineering from Nisantasi University with a GPA of 3.36. I live in Los Angeles and work as a Frontend Developer. I enjoy playing basketball, guitar, and video games.",
      myExperiences:
        "I'm a Frontend Developer with experience building scalable and responsive interfaces using React, Next.js, TypeScript, and Tailwind CSS. I've also worked with state management (Zustand), testing (Jest, Cypress), and UI documentation tools like Storybook.",
    },
    profile: {
      nameLabel: "Name",
      emailLabel: "Email",
      ageLabel: "Age",
      age: age,
      fromLabel: "From",
      from: "Los Angeles, CA",
      downloadResume: "Download Resume",
    },
    stats: {
      experienceYear: `${experienceYears}`,
      experienceText: "Years Experience",
      projectsNumber: "40",
      projectsLabel: "Projects Done",
    },
    resume: {
      eduTitle: "My Education",
      expTitle: "My Experience",
      schoolName: "Nisantasi University",
      degree: "B.Sc., Software Engineering",
      gpaLabel: "GPA",
      expRole: "Frontend Developer",
      expDates: "May 2023 – Present",
      expLocation: "Los Angeles, CA, US · Remote",
    },
    portfolio: {
      subtitle: "Here are a selection of projects I would like to showcase.",
      cardLabels: {
        projectInfo: "Project Info",
        projectDetails: "Project Details",
        link: "Link",
        technologies: "Technologies",
        industry: "Industry",
        date: "Date",
      },
      items: [
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
        {
          key: sharedI18n.portfolio.keeper.key,
          title: sharedI18n.portfolio.keeper.title,
          description:
            "A website where you can create new notes and delete existing ones.",
          imageSrc: sharedI18n.portfolio.keeper.imageSrc,
          imageAlt: "Keeper project screenshot",
          details: {
            technologies: sharedI18n.portfolio.keeper.technologies,
            industry: "Productivity",
            date: "January 26, 2023",
            linkHref: sharedI18n.portfolio.keeper.linkHref,
            linkLabel: "View on GitHub",
          },
        },
        {
          key: sharedI18n.portfolio.mongodbCrud.key,
          title: sharedI18n.portfolio.mongodbCrud.title,
          description:
            "A minimal Express + MongoDB app that powers a theme-park reservations dashboard with REST flows for onboarding, saved cards, and ticket pricing.",
          imageSrc: sharedI18n.portfolio.mongodbCrud.imageSrc,
          imageAlt: "MongoDB Express CRUD project screenshot",
          details: {
            technologies: sharedI18n.portfolio.mongodbCrud.technologies,
            industry: "Theme Park Ticketing",
            date: "August 20, 2024",
            linkHref: sharedI18n.portfolio.mongodbCrud.linkHref,
            linkLabel: "View on GitHub",
          },
        },
        {
          key: sharedI18n.portfolio.productListing.key,
          title: sharedI18n.portfolio.productListing.title,
          description:
            "A web app where you upload product photos, the AI analyzes them, asks follow-ups, and generates pricing suggestions and ready-to-use marketplace listings you can refine through chat.",
          imageSrc: sharedI18n.portfolio.productListing.imageSrc,
          imageAlt: "Product Listing Generator project screenshot",
          details: {
            technologies: sharedI18n.portfolio.productListing.technologies,
            industry: "E-commerce",
            date: "September 3, 2025",
            linkHref: sharedI18n.portfolio.productListing.linkHref,
            linkLabel: "View on Website",
          },
        },
      ],
    },
    testimonial: {
      items: [
        {
          key: sharedI18n.testimonials.jay.key,
          title: "Founder at Icomatic Pvt Ltd",
          quote:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        },
        {
          key: sharedI18n.testimonials.patrick.key,
          title: "Freelancer from USA",
          quote:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        },
        {
          key: sharedI18n.testimonials.chris.key,
          title: "User from UK",
          quote:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        },
        {
          key: sharedI18n.testimonials.dennis.key,
          title: "User from USA",
          quote:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        },
      ],
    },
    footer: {
      footerCopyright: "All Rights Reserved.",
      copyrightLabel: "Copyright",
    },

    contactValidation: {
      name_required: "Name is required",
      name_min: "Name must be at least 2 characters",
      name_max: "Name must be at most 100 characters",
      email_required: "Email is required",
      email_invalid: "Please enter a valid email",
      email_max: "Email must be at most 254 characters",
      message_required: "Message is required",
      message_min: "Message must be at least 10 characters",
      message_max: "Message must be at most 2000 characters",
    },
    contact: {
      title: "Contact",
      followMe: "Follow Me",
      sendMeANote: "Send Me A Note",
      yourNameLabel: "Your Name",
      messageLabel: "Message",
      messagePlaceholder: "Please write your message here...",
      sendMessageButton: "Send Message",
      toast: {
        notConfiguredTitle: "Email not configured",
        notConfiguredDescription:
          "EmailJS environment variables are missing. Please set them in .env.local.",
        successTitle: "Message sent",
        successDescription: "Thanks! I will get back to you soon.",
        failedTitle: "Send failed",
        failedDescription:
          "Unable to send your message. Please try again later.",
      },
    },
  },
  tr: {
    headTitle: "Teoman Kırma • Frontend Developer",
    name: "Teoman Kırma",
    menuItems: [
      "Anasayfa",
      "Hakkımda",
      "Özgeçmiş",
      "Portföy",
      "Referanslar",
      "Bana Ulaşın",
    ],
    home: {
      welcome: "Hoş Geldiniz",
      typewriter: [
        "Ben Teoman Kırma.",
        "Yazılım Mühendisiyim.",
        "Frontend Developer'ım.",
      ],
      location: "Los Angeles, CA merkezliyim.",
      hireMe: "Beni İşe Al",
    },
    about: {
      knowMeMore: "Beni Daha Yakından Tanıyın",
      whoAmIA: "Ben",
      whoAmIB: "bir Frontend Developer'ım",
      aboutMe:
        "Merhaba, benim adım Teoman. Nişantaşı Üniversitesi Yazılım Mühendisliği bölümünden 3.36 not ortalamasıyla mezun oldum. Los Angeles'ta yaşıyor ve Frontend Developer olarak çalışıyorum. Hobilerim arasında basketbol, gitar çalmak ve video oyunları yer alıyor.",
      myExperiences:
        "Frontend Developer olarak scalable ve responsive arayüzler geliştirme deneyimine sahibim. React, Next.js, TypeScript ve Tailwind CSS ile çalışma tecrübem var. Ayrıca Zustand ile state management, Jest ve Cypress ile testing ve Storybook ile UI documentation konularında da tecrübem bulunuyor.",
    },
    profile: {
      nameLabel: "İsim",
      emailLabel: "E-posta",
      ageLabel: "Yaş",
      age: age,
      fromLabel: "Konum",
      from: "Los Angeles, CA",
      downloadResume: "CV İndir",
    },
    stats: {
      experienceYear: `${experienceYears}`,
      experienceText: "Yıllık Deneyim",
      projectsNumber: "40",
      projectsLabel: "Tamamlanan Proje",
    },
    resume: {
      eduTitle: "Eğitimim",
      expTitle: "Deneyimim",
      schoolName: "Nişantaşı Üniversitesi",
      degree: "Yazılım Mühendisliği, Lisans",
      gpaLabel: "GNO",
      expRole: "Frontend Geliştirici",
      expDates: "Mayıs 2023 – Günümüz",
      expLocation: "Los Angeles, CA, ABD · Uzaktan",
    },
    portfolio: {
      subtitle: "Sergilemek istediğim seçilmiş projelerden bazıları.",
      cardLabels: {
        projectInfo: "Proje Bilgisi",
        projectDetails: "Proje Detayları",
        link: "Bağlantı",
        technologies: "Teknolojiler",
        industry: "Sektör",
        date: "Tarih",
      },
      items: [
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
        {
          key: sharedI18n.portfolio.keeper.key,
          title: sharedI18n.portfolio.keeper.title,
          description:
            "Yeni notlar oluşturabileceğiniz ve mevcut olanları silebileceğiniz bir web sitesi.",
          imageSrc: sharedI18n.portfolio.keeper.imageSrc,
          imageAlt: "Keeper proje ekran görüntüsü",
          details: {
            technologies: sharedI18n.portfolio.keeper.technologies,
            industry: "Üretkenlik",
            date: "12 Haziran 2022",
            linkHref: sharedI18n.portfolio.keeper.linkHref,
            linkLabel: "GitHub'da Görüntüle",
          },
        },
        {
          key: sharedI18n.portfolio.mongodbCrud.key,
          title: sharedI18n.portfolio.mongodbCrud.title,
          description:
            "Kullanıcı kayıtları, rezervasyon yönetimi ve kayıtlı kart akışlarını REST endpoint'leri ve statik formlarla yöneten, tema parkı odaklı minimal bir Express + MongoDB uygulaması.",
          imageSrc: sharedI18n.portfolio.mongodbCrud.imageSrc,
          imageAlt: "MongoDB Express CRUD proje ekran görüntüsü",
          details: {
            technologies: sharedI18n.portfolio.mongodbCrud.technologies,
            industry: "Tema Parkı Biletleme",
            date: "20 Ağustos 2024",
            linkHref: sharedI18n.portfolio.mongodbCrud.linkHref,
            linkLabel: "GitHub'da Görüntüle",
          },
        },
        {
          key: sharedI18n.portfolio.productListing.key,
          title: sharedI18n.portfolio.productListing.title,
          description:
            "Ürün fotoğraflarını yüklediğinizde analiz yapan, sorular soran ve fiyat önerileriyle satışa hazır ilan oluşturan; ardından sohbet ederek başlık veya detayları düzenleyebileceğiniz bir web sitesi.",
          imageSrc: sharedI18n.portfolio.productListing.imageSrc,
          imageAlt: "Product Listing Generator proje ekran görüntüsü",
          details: {
            technologies: sharedI18n.portfolio.productListing.technologies,
            industry: "E-ticaret",
            date: "3 Eylül 2025",
            linkHref: sharedI18n.portfolio.productListing.linkHref,
            linkLabel: "Website'te Görüntüle",
          },
        },
      ],
    },
    testimonial: {
      items: [
        {
          key: sharedI18n.testimonials.jay.key,
          title: "Icomatic Pvt Ltd Kurucusu",
          quote:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        },
        {
          key: sharedI18n.testimonials.patrick.key,
          title: "ABD'den Serbest Çalışan",
          quote:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        },
        {
          key: sharedI18n.testimonials.chris.key,
          title: "Birleşik Krallık'tan Kullanıcı",
          quote:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        },
        {
          key: sharedI18n.testimonials.dennis.key,
          title: "ABD'den Kullanıcı",
          quote:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        },
      ],
    },
    footer: {
      footerCopyright: "Tüm Hakları Saklıdır.",
      copyrightLabel: "Telif Hakkı",
    },

    contactValidation: {
      name_required: "İsim zorunludur",
      name_min: "İsim en az 2 karakter olmalıdır",
      name_max: "İsim en fazla 100 karakter olabilir",
      email_required: "E-posta zorunludur",
      email_invalid: "Lütfen geçerli bir e-posta girin",
      email_max: "E-posta en fazla 254 karakter olabilir",
      message_required: "Mesaj zorunludur",
      message_min: "Mesaj en az 10 karakter olmalıdır",
      message_max: "Mesaj en fazla 2000 karakter olabilir",
    },
    contact: {
      title: "İletişim",
      followMe: "Beni Takip Edin",
      sendMeANote: "Bana Bir Not Gönderin",
      yourNameLabel: "İsminiz",
      messageLabel: "Mesaj",
      messagePlaceholder: "Mesajınızı buraya yazınız...",
      sendMessageButton: "Mesaj Gönder",
      toast: {
        notConfiguredTitle: "E-posta yapılandırılmadı",
        notConfiguredDescription:
          ".env.local dosyasında EmailJS ortam değişkenleri eksik.",
        successTitle: "Mesaj gönderildi",
        successDescription: "Teşekkürler! En kısa sürede dönüş yapacağım.",
        failedTitle: "Gönderim başarısız",
        failedDescription:
          "Mesajınız gönderilemedi. Lütfen daha sonra tekrar deneyin.",
      },
    },
  },
};
