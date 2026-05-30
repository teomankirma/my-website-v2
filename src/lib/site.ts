import {DateTime} from 'luxon';

export const EMAIL = 'teomankirma@gmail.com';
export const RESUME_URL = '/resume.pdf';

export const SOCIAL_LINKS = {
  x: 'https://x.com/teomankirma',
  github: 'https://github.com/teomankirma',
  linkedin: 'https://linkedin.com/in/teomankirma/',
} as const;

export const SECTION_IDS = {
  home: 'home',
  about: 'about',
  resume: 'resume',
  portfolio: 'portfolio',
  contact: 'contact',
} as const;

export const GPA = '3.36';

export const SKILLS = [
  'React', 'Next.js', 'TypeScript', 'Python', 'Node.js',
  'Tailwind CSS', 'Zustand', 'TanStack Query', 'PostgreSQL', 'Docker',
] as const;

export const AGE = Math.floor(
  DateTime.now().diff(DateTime.fromISO('2002-07-27'), 'years').years,
);
export const CURRENT_YEAR = DateTime.now().year;
export const EXPERIENCE_YEARS = CURRENT_YEAR - 2020;
