import type {StaticImageData} from 'next/image';
import atm from '@/assets/atm.png';
import keeper from '@/assets/keeper.png';
import quizApp from '@/assets/quiz-app.png';
import mongodbCrud from '@/assets/mongodb-crud.png';
import teoAi from '@/assets/teo-ai.png';
import productListing from '@/assets/product-listing-generator.png';
import jobFlow from '@/assets/job-flow.png';
import cirkle from '@/assets/cirkle.jpeg';

export type ProjectKey =
  | 'atm' | 'keeper' | 'quizApp' | 'mongodbCrud'
  | 'teoAi' | 'productListing' | 'jobFlow' | 'cirkle';

export interface Project {
  key: ProjectKey;
  title: string;
  image: StaticImageData;
  technologies: string;
  href: string;
}

export const PROJECTS: Project[] = [
  {key: 'atm', title: 'ATM', image: atm, technologies: 'Java', href: 'https://github.com/teomankirma/ATM'},
  {key: 'keeper', title: 'Keeper', image: keeper, technologies: 'JavaScript, React', href: 'https://github.com/teomankirma/keeper-app'},
  {key: 'quizApp', title: 'Quiz App', image: quizApp, technologies: 'Vite, JavaScript, Open Trivia DB, API Ninjas', href: 'https://teo-quiz-app.vercel.app/'},
  {key: 'mongodbCrud', title: 'MongoDB Express CRUD', image: mongodbCrud, technologies: 'Express, MongoDB, Mongoose, Nodemon', href: 'https://github.com/teomankirma/mongodb-expressjs-crud'},
  {key: 'teoAi', title: 'teo.ai Marketing Site', image: teoAi, technologies: 'Next.js 14, React 18, TypeScript, Tailwind CSS, Prismic, GSAP, Framer Motion', href: 'https://teo-ai.vercel.app/'},
  {key: 'productListing', title: 'Product Listing Generator', image: productListing, technologies: 'Next.js 15, React 19, TypeScript, Tailwind CSS 4, Zustand, shadcn/ui, Vercel AI SDK', href: 'https://teo-product-listing-generator.vercel.app/'},
  {key: 'jobFlow', title: 'Job Flow', image: jobFlow, technologies: 'Python (FastAPI), Node.js, Redis, PostgreSQL, Next.js, TypeScript, Docker, Tailwind CSS', href: 'https://teo-job-flow.vercel.app/'},
  {key: 'cirkle', title: 'Cirkle', image: cirkle, technologies: 'Next.js, React, TypeScript, Supabase, Tailwind CSS', href: 'https://www.heycirkle.com/'},
];
