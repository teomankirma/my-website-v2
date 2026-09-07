export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://teomankirma.com';
export const EMAIL = 'teomankirma@gmail.com';
export const RESUME_URL = '/resume.pdf';
export const SOCIAL_LINKS = {
  x: 'https://x.com/teomankirma',
  github: 'https://github.com/teomankirma',
  linkedin: 'https://linkedin.com/in/teomankirma/',
} as const;
export const GPA = '3.36';
export const SKILLS = [
  'React',
  'Next.js',
  'TypeScript',
  'Python',
  'Node.js',
  'Tailwind CSS',
  'Zustand',
  'TanStack Query',
  'PostgreSQL',
  'Docker',
] as const;
export const CURRENT_YEAR = new Date().getFullYear();
