import type {StaticImageData} from 'next/image';
import atm from '@/assets/atm.png';
import keeper from '@/assets/keeper.png';
import quizApp from '@/assets/quiz-app.png';
import mongodbCrud from '@/assets/mongodb-crud.png';
import teoAi from '@/assets/teo-ai.png';
import productListing from '@/assets/product-listing-generator.png';
import jobFlow from '@/assets/job-flow.png';
import cirkle from '@/assets/cirkle.jpeg';
import clueClash from '@/assets/clue-clash.png';

export type ProjectKey =
  | 'atm'
  | 'keeper'
  | 'quizApp'
  | 'mongodbCrud'
  | 'teoAi'
  | 'productListing'
  | 'jobFlow'
  | 'cirkle'
  | 'clueClash';

export interface Project {
  key: ProjectKey;
  title: string;
  year: number;
  image: StaticImageData;
  technologies: string;
  href: string;
}

// Newest first.
export const PROJECTS: Project[] = [
  {
    key: 'clueClash',
    year: 2026,
    title: 'Clue Clash',
    image: clueClash,
    technologies: 'React Native, Expo, TypeScript',
    href: 'https://bytesandpixels.co/clue-clash/',
  },
  {
    key: 'cirkle',
    year: 2026,
    title: 'Cirkle',
    image: cirkle,
    technologies: 'Next.js, React, TypeScript, Supabase, Tailwind CSS',
    href: 'https://www.heycirkle.com/',
  },
  {
    key: 'jobFlow',
    year: 2026,
    title: 'Job Flow',
    image: jobFlow,
    technologies:
      'Python (FastAPI), Node.js, Redis, PostgreSQL, Next.js, TypeScript, Docker, Tailwind CSS',
    href: 'https://teo-job-flow.vercel.app/',
  },
  {
    key: 'productListing',
    year: 2025,
    title: 'Product Listing Generator',
    image: productListing,
    technologies:
      'Next.js 15, React 19, TypeScript, Tailwind CSS 4, Zustand, shadcn/ui, Vercel AI SDK',
    href: 'https://teo-product-listing-generator.vercel.app/',
  },
  {
    key: 'teoAi',
    year: 2025,
    title: 'teo.ai Marketing Site',
    image: teoAi,
    technologies: 'Next.js 14, React 18, TypeScript, Tailwind CSS, Prismic, GSAP, Framer Motion',
    href: 'https://teo-ai.vercel.app/',
  },
  {
    key: 'mongodbCrud',
    year: 2024,
    title: 'MongoDB Express CRUD',
    image: mongodbCrud,
    technologies: 'Express, MongoDB, Mongoose, Nodemon',
    href: 'https://github.com/teomankirma/mongodb-expressjs-crud',
  },
  {
    key: 'quizApp',
    year: 2024,
    title: 'Quiz App',
    image: quizApp,
    technologies: 'Vite, JavaScript, Open Trivia DB, API Ninjas',
    href: 'https://teo-quiz-app.vercel.app/',
  },
  {
    key: 'keeper',
    year: 2023,
    title: 'Keeper',
    image: keeper,
    technologies: 'JavaScript, React',
    href: 'https://github.com/teomankirma/keeper-app',
  },
  {
    key: 'atm',
    year: 2022,
    title: 'ATM',
    image: atm,
    technologies: 'Java',
    href: 'https://github.com/teomankirma/ATM',
  },
];
