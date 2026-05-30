# Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the personal portfolio as a Next.js (App Router) site with a dark-technical design — shadcn/ui + GSAP + next-intl + Geist — replacing the Vite/HeroUI/Framer stack, preserving content + EmailJS, dropping testimonials.

**Architecture:** Next.js App Router with a `[locale]` segment (next-intl, `/en` `/tr`). Server Components render static layout; motion lives in isolated `'use client'` leaf components. shadcn/ui primitives + Tailwind v4 oklch tokens (dark default + light). GSAP (ScrollTrigger + SplitText) drives a hero on-load reveal and one pinned horizontal-pan showcase; everything honors `prefers-reduced-motion`.

**Tech Stack:** Next.js (latest), React 19, TypeScript (strict), Tailwind v4, shadcn/ui, lucide-react, gsap + @gsap/react, next-intl, next-themes, sonner, geist fonts, @emailjs/browser, react-hook-form, zod, luxon.

**Reference spec:** `docs/superpowers/specs/2026-05-30-portfolio-redesign-design.md`

---

## Conventions for this plan

- **No test framework.** Verification gates per task are:
  - `npx tsc --noEmit` (clean) and/or `npm run build` (clean).
  - `npm run lint` (clean).
  - **Browser check** via dev server: open the relevant URL in EN + TR, light + dark, desktop + mobile width, and (where motion exists) with `prefers-reduced-motion: reduce`. Use the Chrome DevTools MCP if available, otherwise describe the manual check.
- **Branch:** all work happens on `redesign/dark-technical` (already created). **No merges to `main`** until the whole site is done and the user gives the go-ahead. Per-phase sub-branches optional; if used, merge into `redesign/dark-technical`, never `main`.
- **Commits:** Conventional Commits, frequent (one per task minimum). End commit messages with the `Co-Authored-By` trailer.
- Run all commands from repo root `/Users/teomankirma/Development/my-website-v2`.
- "latest" in install commands is intentional; the spec targets current stable.

---

# Phase 0 — Foundation

Goal: a Next.js app that boots in EN + TR, light + dark, with all tokens/fonts/i18n/shadcn/gsap primitives in place and a placeholder page. No section UI yet. All old stack artifacts removed.

## Task 0.1: Reset dependencies to the Next.js stack

**Files:**
- Modify: `package.json`
- Delete: `vite.config.ts`, `index.html`, `hero.ts`, `src/main.tsx`, `src/App.tsx`, `src/vite-env.d.ts`, `tsconfig.app.json`, `tsconfig.node.json`, `eslint.config.js`
- Delete (old UI, replaced later): `src/components/` (entire dir), `src/hooks/`, `src/i18n/`, `src/utils/index.ts`
- Keep (reused later): `src/assets/`, `src/schemas/` (rewritten in Phase 3), `src/types/` (pruned), `.env`, `.env.example`, `public/`

- [ ] **Step 1: Remove Vite/HeroUI source and config**

```bash
rm -f vite.config.ts index.html hero.ts src/main.tsx src/App.tsx src/vite-env.d.ts \
      tsconfig.app.json tsconfig.node.json eslint.config.js
rm -rf src/components src/hooks src/i18n
rm -f src/utils/index.ts src/utils/googleAnalytics.ts
```

- [ ] **Step 2: Replace `package.json`**

```json
{
  "name": "my-website-v2",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@emailjs/browser": "^4.4.1",
    "@gsap/react": "^2.1.2",
    "@hookform/resolvers": "^5.2.1",
    "geist": "^1.4.2",
    "gsap": "^3.13.0",
    "luxon": "^3.7.2",
    "next": "latest",
    "next-intl": "latest",
    "next-themes": "^0.4.6",
    "react": "^19.1.1",
    "react-dom": "^19.1.1",
    "react-hook-form": "^7.62.0",
    "sonner": "^2.0.0",
    "zod": "^4.1.5"
  },
  "devDependencies": {
    "@types/luxon": "^3.7.1",
    "@types/node": "^24.3.0",
    "@types/react": "^19.1.10",
    "@types/react-dom": "^19.1.7",
    "eslint": "^9.33.0",
    "eslint-config-next": "latest",
    "tailwindcss": "^4.1.12",
    "@tailwindcss/postcss": "^4.1.12",
    "typescript": "~5.8.3"
  }
}
```

> shadcn deps (`class-variance-authority`, `clsx`, `tailwind-merge`, `tw-animate-css`, `lucide-react`, Radix) are added by `shadcn init`/`add` in Task 0.5, not hand-listed here.

- [ ] **Step 3: Install**

```bash
rm -rf node_modules package-lock.json && npm install
```

Expected: installs without peer-dependency errors. If React 19 peer warnings appear from a sub-dep, they are warnings, not failures.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: reset to Next.js dependency stack

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

## Task 0.2: Next.js + TypeScript + Tailwind config and app skeleton

**Files:**
- Create: `next.config.ts`, `tsconfig.json` (replace), `next-env.d.ts` (auto), `postcss.config.mjs`, `.eslintrc.json`
- Create: `src/app/layout.tsx`, `src/app/[locale]/layout.tsx` (stub), `src/app/[locale]/page.tsx` (stub)
- Create: `src/styles/globals.css`

- [ ] **Step 1: `next.config.ts`**

```ts
import type {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  reactStrictMode: true,
};

export default withNextIntl(nextConfig);
```

- [ ] **Step 2: Replace `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "ES2022"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{"name": "next"}],
    "paths": {"@/*": ["./src/*"]}
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 3: `postcss.config.mjs`**

```js
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
export default config;
```

- [ ] **Step 4: `.eslintrc.json`**

```json
{
  "extends": "next/core-web-vitals"
}
```

- [ ] **Step 5: `src/styles/globals.css`** (tokens — dark default + light, emerald accent)

```css
@import "tailwindcss";

@custom-variant dark (&:is(.dark *));

:root {
  --radius: 0.75rem;
  --background: oklch(0.98 0.003 286);
  --foreground: oklch(0.18 0.006 286);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.18 0.006 286);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.18 0.006 286);
  --primary: oklch(0.62 0.17 150);
  --primary-foreground: oklch(0.99 0.01 150);
  --secondary: oklch(0.96 0.004 286);
  --secondary-foreground: oklch(0.22 0.006 286);
  --muted: oklch(0.96 0.004 286);
  --muted-foreground: oklch(0.5 0.01 286);
  --accent: oklch(0.96 0.004 286);
  --accent-foreground: oklch(0.22 0.006 286);
  --destructive: oklch(0.58 0.22 27);
  --border: oklch(0.91 0.004 286);
  --input: oklch(0.91 0.004 286);
  --ring: oklch(0.62 0.17 150);
}

.dark {
  --background: oklch(0.16 0.004 286);
  --foreground: oklch(0.97 0.002 286);
  --card: oklch(0.19 0.005 286);
  --card-foreground: oklch(0.97 0.002 286);
  --popover: oklch(0.19 0.005 286);
  --popover-foreground: oklch(0.97 0.002 286);
  --primary: oklch(0.72 0.19 150);
  --primary-foreground: oklch(0.16 0.04 150);
  --secondary: oklch(0.24 0.006 286);
  --secondary-foreground: oklch(0.97 0.002 286);
  --muted: oklch(0.24 0.006 286);
  --muted-foreground: oklch(0.65 0.01 286);
  --accent: oklch(0.26 0.006 286);
  --accent-foreground: oklch(0.97 0.002 286);
  --destructive: oklch(0.62 0.21 25);
  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 12%);
  --ring: oklch(0.72 0.19 150);
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}

@layer base {
  * { border-color: var(--color-border); }
  body { background-color: var(--color-background); color: var(--color-foreground); }
}

/* Hero dot-grid utility */
.dot-grid {
  background-image: radial-gradient(currentColor 1px, transparent 1px);
  background-size: 16px 16px;
}
```

> `tw-animate-css` import is added by shadcn in Task 0.5; do not add it here.

- [ ] **Step 6: Root layout `src/app/layout.tsx`** (fonts + html shell)

```tsx
import type {ReactNode} from 'react';
import {GeistSans} from 'geist/font/sans';
import {GeistMono} from 'geist/font/mono';
import '@/styles/globals.css';

export default function RootLayout({children}: {children: ReactNode}) {
  return (
    <html
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
```

- [ ] **Step 7: Stub `src/app/[locale]/layout.tsx`**

```tsx
import type {ReactNode} from 'react';

export default function LocaleLayout({children}: {children: ReactNode}) {
  return <>{children}</>;
}
```

- [ ] **Step 8: Stub `src/app/[locale]/page.tsx`**

```tsx
export default function Page() {
  return <main className="min-h-[100dvh] grid place-items-center">Booting…</main>;
}
```

- [ ] **Step 9: Verify typecheck**

Run: `npx tsc --noEmit`
Expected: PASS (no errors). The app won't run yet (i18n not wired) — that's Task 0.4.

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "feat: Next.js app skeleton + Tailwind v4 tokens (dark default, emerald)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

## Task 0.4: next-intl routing + messages

**Files:**
- Create: `src/i18n/routing.ts`, `src/i18n/request.ts`, `src/i18n/navigation.ts`, `src/middleware.ts`
- Create: `messages/en.json`, `messages/tr.json`

> The message files below are the authoritative source of all human-readable strings (locale-neutral data — image paths, links, tech strings, social URLs, email — lives in `lib/` per Task 0.6). Values are ported from the previous `src/i18n/index.ts`; testimonials are dropped.

- [ ] **Step 1: `src/i18n/routing.ts`**

```ts
import {defineRouting} from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'tr'],
  defaultLocale: 'en',
});
```

- [ ] **Step 2: `src/i18n/request.ts`**

```ts
import {getRequestConfig} from 'next-intl/server';
import {hasLocale} from 'next-intl';
import {routing} from './routing';

export default getRequestConfig(async ({requestLocale}) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
```

- [ ] **Step 3: `src/i18n/navigation.ts`**

```ts
import {createNavigation} from 'next-intl/navigation';
import {routing} from './routing';

export const {Link, redirect, usePathname, useRouter, getPathname} =
  createNavigation(routing);
```

- [ ] **Step 4: `src/middleware.ts`**

```ts
import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
};
```

- [ ] **Step 5: `messages/en.json`**

```json
{
  "metadata": {
    "title": "Teoman Kirma • Fullstack Developer",
    "description": "Fullstack developer building scalable web apps and distributed systems, from UI to infrastructure. Based in Izmir, Türkiye."
  },
  "header": {
    "name": "Teoman Kirma",
    "menu": {
      "home": "Home",
      "about": "About",
      "resume": "Resume",
      "portfolio": "Portfolio",
      "contact": "Contact"
    }
  },
  "hero": {
    "prompt": "~/teoman",
    "name": "Teoman Kirma",
    "role": "Fullstack Developer",
    "tagline": "I build performant interfaces and reliable backends, end to end.",
    "location": "Izmir, Türkiye",
    "ctaContact": "Get in touch",
    "ctaResume": "Download résumé"
  },
  "about": {
    "heading": "About",
    "whoAmI": "I'm a Full-Stack Developer",
    "bodyA": "I'm a Full-Stack Developer building scalable web applications and distributed systems. On the frontend, I work with React, Next.js, and TypeScript to create performant and accessible user interfaces. On the backend, I design and implement APIs using Python and Node.js, working with databases, background jobs, and system reliability patterns.",
    "bodyB": "I enjoy building systems end-to-end, from UI to infrastructure, with a strong focus on performance, maintainability, and clean architecture.",
    "facts": {
      "nameLabel": "Name",
      "emailLabel": "Email",
      "ageLabel": "Age",
      "fromLabel": "From",
      "from": "Izmir, Türkiye"
    },
    "stats": {
      "experienceText": "Years experience",
      "projectsNumber": "40",
      "projectsLabel": "Projects done"
    }
  },
  "resume": {
    "heading": "Resume",
    "eduTitle": "Education",
    "expTitle": "Experience",
    "schoolName": "Nisantasi University",
    "degree": "B.Sc., Software Engineering",
    "eduYears": "2020-2025",
    "gpaLabel": "GPA",
    "expRole": "Fullstack Developer",
    "companyName": "BytesandPixels",
    "expDates": "May 2023 - Present",
    "expLocation": "Los Angeles, CA, US · Remote",
    "skillsLabel": "Tools I work with"
  },
  "portfolio": {
    "heading": "Portfolio",
    "subtitle": "A selection of projects I would like to showcase.",
    "labels": {
      "technologies": "Technologies",
      "industry": "Industry",
      "date": "Date",
      "link": "Link"
    },
    "items": {
      "atm": {
        "description": "Sign up or sign in, then deposit and withdraw money. You can also change your password after logging in.",
        "industry": "Finance",
        "date": "February 12, 2022",
        "linkLabel": "View on GitHub"
      },
      "keeper": {
        "description": "A website where you can create new notes and delete existing ones.",
        "industry": "Productivity",
        "date": "January 26, 2023",
        "linkLabel": "View on GitHub"
      },
      "quizApp": {
        "description": "A Vite-powered quiz with configurable sessions, Open Trivia DB questions, persistent leaderboards, and optional motivational quotes via API Ninjas.",
        "industry": "EdTech",
        "date": "May 18, 2024",
        "linkLabel": "Visit website"
      },
      "mongodbCrud": {
        "description": "A minimal Express + MongoDB app powering a theme-park reservations dashboard with REST flows for onboarding, saved cards, and ticket pricing.",
        "industry": "Theme Park Ticketing",
        "date": "August 20, 2024",
        "linkLabel": "View on GitHub"
      },
      "teoAi": {
        "description": "A Prismic-powered marketing site for teo.ai with animated hero storytelling, case studies, integrations, and a managed login funnel on Next.js App Router.",
        "industry": "SaaS Marketing",
        "date": "April 14, 2025",
        "linkLabel": "Visit website"
      },
      "productListing": {
        "description": "Upload product photos, the AI analyzes them, asks follow-ups, and generates pricing suggestions and ready-to-use marketplace listings you refine through chat.",
        "industry": "E-commerce",
        "date": "September 3, 2025",
        "linkLabel": "Visit website"
      },
      "jobFlow": {
        "description": "A distributed background job system: enqueue tasks via an API and monitor execution in real time, with retries, idempotency, rate limiting, and dead-letter queues.",
        "industry": "Infrastructure / Developer Tools",
        "date": "February 24, 2026",
        "linkLabel": "Visit website"
      }
    }
  },
  "contact": {
    "heading": "Contact",
    "pitch": "Have a project in mind or just want to say hi? Send me a note.",
    "followMe": "Follow me",
    "nameLabel": "Your name",
    "emailLabel": "Email",
    "messageLabel": "Message",
    "messagePlaceholder": "Please write your message here...",
    "submit": "Send message",
    "submitting": "Sending...",
    "toast": {
      "notConfiguredTitle": "Email not configured",
      "notConfiguredDescription": "EmailJS environment variables are missing. Please set them in .env.local.",
      "successTitle": "Message sent",
      "successDescription": "Thanks! I will get back to you soon.",
      "failedTitle": "Send failed",
      "failedDescription": "Unable to send your message. Please try again later."
    }
  },
  "validation": {
    "name_required": "Name is required",
    "name_min": "Name must be at least 2 characters",
    "name_max": "Name must be at most 100 characters",
    "email_required": "Email is required",
    "email_invalid": "Please enter a valid email",
    "email_max": "Email must be at most 254 characters",
    "message_required": "Message is required",
    "message_min": "Message must be at least 10 characters",
    "message_max": "Message must be at most 2000 characters"
  },
  "footer": {
    "copyright": "All rights reserved.",
    "copyrightLabel": "Copyright"
  },
  "downloadResume": "Download résumé"
}
```

- [ ] **Step 6: `messages/tr.json`**

```json
{
  "metadata": {
    "title": "Teoman Kırma • Fullstack Developer",
    "description": "UI'dan altyapıya kadar scalable web uygulamaları ve distributed sistemler geliştiren fullstack developer. İzmir, Türkiye merkezli."
  },
  "header": {
    "name": "Teoman Kırma",
    "menu": {
      "home": "Anasayfa",
      "about": "Hakkımda",
      "resume": "Özgeçmiş",
      "portfolio": "Portföy",
      "contact": "İletişim"
    }
  },
  "hero": {
    "prompt": "~/teoman",
    "name": "Teoman Kırma",
    "role": "Fullstack Developer",
    "tagline": "Performanslı arayüzler ve güvenilir backend'ler geliştiriyorum, uçtan uca.",
    "location": "İzmir, Türkiye",
    "ctaContact": "İletişime geç",
    "ctaResume": "CV indir"
  },
  "about": {
    "heading": "Hakkımda",
    "whoAmI": "Bir Full-Stack Developer'ım",
    "bodyA": "Scalable web uygulamaları ve distributed sistemler geliştiren bir Full-Stack Developer'ım. Frontend tarafında React, Next.js ve TypeScript kullanarak performanslı ve erişilebilir kullanıcı arayüzleri geliştiriyorum. Backend tarafında ise Python ve Node.js ile API'lar tasarlayıp geliştiriyor, veritabanları, background job süreçleri ve sistem güvenilirliği konularında çalışıyorum.",
    "bodyB": "UI'dan altyapıya kadar sistemleri uçtan uca geliştirmeyi seviyorum; performans, sürdürülebilirlik ve clean architecture prensiplerini ön planda tutuyorum.",
    "facts": {
      "nameLabel": "İsim",
      "emailLabel": "E-posta",
      "ageLabel": "Yaş",
      "fromLabel": "Konum",
      "from": "İzmir, Türkiye"
    },
    "stats": {
      "experienceText": "Yıllık deneyim",
      "projectsNumber": "40",
      "projectsLabel": "Tamamlanan proje"
    }
  },
  "resume": {
    "heading": "Özgeçmiş",
    "eduTitle": "Eğitim",
    "expTitle": "Deneyim",
    "schoolName": "Nişantaşı Üniversitesi",
    "degree": "Yazılım Mühendisliği, Lisans",
    "eduYears": "2020-2025",
    "gpaLabel": "GNO",
    "expRole": "Full-Stack Geliştirici",
    "companyName": "BytesandPixels",
    "expDates": "Mayıs 2023 - Günümüz",
    "expLocation": "Los Angeles, CA, ABD · Uzaktan",
    "skillsLabel": "Kullandığım teknolojiler"
  },
  "portfolio": {
    "heading": "Portföy",
    "subtitle": "Sergilemek istediğim seçilmiş projelerden bazıları.",
    "labels": {
      "technologies": "Teknolojiler",
      "industry": "Sektör",
      "date": "Tarih",
      "link": "Bağlantı"
    },
    "items": {
      "atm": {
        "description": "Kayıt olup giriş yaparak para yatırıp çekebilir, başarılı girişten sonra şifrenizi değiştirebilirsiniz.",
        "industry": "Finans",
        "date": "12 Şubat 2022",
        "linkLabel": "GitHub'da görüntüle"
      },
      "keeper": {
        "description": "Yeni notlar oluşturabileceğiniz ve mevcut olanları silebileceğiniz bir web sitesi.",
        "industry": "Üretkenlik",
        "date": "26 Ocak 2023",
        "linkLabel": "GitHub'da görüntüle"
      },
      "quizApp": {
        "description": "Yapılandırılabilir oturumlar, Open Trivia DB soruları, kalıcı lider tablosu ve API Ninjas üzerinden motivasyon alıntıları sunan, Vite ile geliştirilmiş bir quiz deneyimi.",
        "industry": "Eğitim Teknolojileri",
        "date": "18 Mayıs 2024",
        "linkLabel": "Web sitesini görüntüle"
      },
      "mongodbCrud": {
        "description": "Onboarding, kayıtlı kart ve bilet fiyatlandırma için REST akışlarıyla bir tema parkı rezervasyon panelini çalıştıran minimal bir Express + MongoDB uygulaması.",
        "industry": "Tema Parkı Biletleme",
        "date": "20 Ağustos 2024",
        "linkLabel": "GitHub'da görüntüle"
      },
      "teoAi": {
        "description": "Next.js App Router üzerinde; animasyonlu hero anlatımı, vaka çalışmaları, entegrasyonlar ve yönetilebilir giriş hunisi sunan, Prismic tabanlı teo.ai pazarlama sitesi.",
        "industry": "SaaS Pazarlama",
        "date": "14 Nisan 2025",
        "linkLabel": "Web sitesini görüntüle"
      },
      "productListing": {
        "description": "Ürün fotoğraflarını yüklersiniz, yapay zeka analiz eder, sorular sorar ve fiyat önerileriyle satışa hazır ilanlar üretir; sohbet ederek detayları düzenlersiniz.",
        "industry": "E-ticaret",
        "date": "3 Eylül 2025",
        "linkLabel": "Web sitesini görüntüle"
      },
      "jobFlow": {
        "description": "Dağıtık bir background job sistemi: görevleri API ile kuyruğa alın ve gerçek zamanlı izleyin; retry, idempotency, rate limiting ve dead-letter queue desteğiyle.",
        "industry": "Altyapı / Developer Tools",
        "date": "24 Şubat 2026",
        "linkLabel": "Web sitesini görüntüle"
      }
    }
  },
  "contact": {
    "heading": "İletişim",
    "pitch": "Aklında bir proje mi var ya da sadece merhaba mı demek istiyorsun? Bana bir not gönder.",
    "followMe": "Beni takip edin",
    "nameLabel": "İsminiz",
    "emailLabel": "E-posta",
    "messageLabel": "Mesaj",
    "messagePlaceholder": "Mesajınızı buraya yazınız...",
    "submit": "Mesaj gönder",
    "submitting": "Gönderiliyor...",
    "toast": {
      "notConfiguredTitle": "E-posta yapılandırılmadı",
      "notConfiguredDescription": ".env.local dosyasında EmailJS ortam değişkenleri eksik.",
      "successTitle": "Mesaj gönderildi",
      "successDescription": "Teşekkürler! En kısa sürede dönüş yapacağım.",
      "failedTitle": "Gönderim başarısız",
      "failedDescription": "Mesajınız gönderilemedi. Lütfen daha sonra tekrar deneyin."
    }
  },
  "validation": {
    "name_required": "İsim zorunludur",
    "name_min": "İsim en az 2 karakter olmalıdır",
    "name_max": "İsim en fazla 100 karakter olabilir",
    "email_required": "E-posta zorunludur",
    "email_invalid": "Lütfen geçerli bir e-posta girin",
    "email_max": "E-posta en fazla 254 karakter olabilir",
    "message_required": "Mesaj zorunludur",
    "message_min": "Mesaj en az 10 karakter olmalıdır",
    "message_max": "Mesaj en fazla 2000 karakter olabilir"
  },
  "footer": {
    "copyright": "Tüm hakları saklıdır.",
    "copyrightLabel": "Telif Hakkı"
  },
  "downloadResume": "CV indir"
}
```

- [ ] **Step 7: Typecheck**

Run: `npx tsc --noEmit`
Expected: PASS. (Full boot is verified in Task 0.7 once the provider + locale layout land.)

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: next-intl routing + EN/TR message files

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

## Task 0.5: Initialize shadcn/ui and add components

**Files:**
- Create: `components.json` (by CLI), `src/lib/utils.ts` (by CLI), `src/components/ui/*` (by CLI)
- Modify: `src/styles/globals.css` (CLI appends `tw-animate-css` import + base layer)

- [ ] **Step 1: Init shadcn**

```bash
npx shadcn@latest init
```

Answer prompts: base color **Neutral**, CSS file **src/styles/globals.css**, CSS variables **yes**, RSC **yes**, components alias **@/components**, utils alias **@/lib/utils**. Let it detect Tailwind v4.

After init, confirm `src/styles/globals.css` still contains the emerald `--primary`/`--ring` from Task 0.2. **If shadcn overwrote them with its default neutral primary, re-apply the emerald `--primary` and `--ring` values from Task 0.2 Step 5 in both `:root` and `.dark`.**

- [ ] **Step 2: Add components**

```bash
npx shadcn@latest add button card dialog dropdown-menu input textarea sheet \
  navigation-menu form label badge tooltip separator sonner
```

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: init shadcn/ui + add primitives

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

## Task 0.6: Library helpers — gsap, site config, projects, providers

**Files:**
- Create: `src/lib/gsap.ts`, `src/lib/site.ts`, `src/lib/projects.ts`, `src/components/providers.tsx`

- [ ] **Step 1: `src/lib/gsap.ts`** (register once)

```ts
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {SplitText} from 'gsap/SplitText';
import {useGSAP} from '@gsap/react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
}

export {gsap, ScrollTrigger, SplitText, useGSAP};
```

- [ ] **Step 2: `src/lib/site.ts`** (locale-neutral config + computed values)

```ts
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
```

- [ ] **Step 3: `src/lib/projects.ts`** (locale-neutral project data; images imported for `next/image`)

```ts
import type {StaticImageData} from 'next/image';
import atm from '@/assets/atm.png';
import keeper from '@/assets/keeper.png';
import quizApp from '@/assets/quiz-app.png';
import mongodbCrud from '@/assets/mongodb-crud.png';
import teoAi from '@/assets/teo-ai.png';
import productListing from '@/assets/product-listing-generator.png';
import jobFlow from '@/assets/job-flow.png';

export type ProjectKey =
  | 'atm' | 'keeper' | 'quizApp' | 'mongodbCrud'
  | 'teoAi' | 'productListing' | 'jobFlow';

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
];
```

> Importing `.png` in TS requires the Next.js image type. `next-env.d.ts` (auto-generated) provides it; if the editor complains before first `next dev`, run `npm run dev` once to generate it.

- [ ] **Step 4: `src/components/providers.tsx`** (next-themes)

```tsx
'use client';

import {ThemeProvider} from 'next-themes';
import type {ReactNode} from 'react';

export function Providers({children}: {children: ReactNode}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      {children}
    </ThemeProvider>
  );
}
```

- [ ] **Step 5: Typecheck + commit**

```bash
npm run dev   # let it generate next-env.d.ts, then Ctrl-C
npx tsc --noEmit
git add -A
git commit -m "feat: lib helpers (gsap, site, projects) + theme provider

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

## Task 0.7: Wire locale layout + placeholder page, verify boot

**Files:**
- Modify: `src/app/[locale]/layout.tsx`, `src/app/[locale]/page.tsx`
- Move: `public/` — add `resume.pdf` placeholder if not present (copy current résumé asset)

- [ ] **Step 1: Real `src/app/[locale]/layout.tsx`**

```tsx
import type {ReactNode} from 'react';
import {NextIntlClientProvider, hasLocale} from 'next-intl';
import {setRequestLocale, getTranslations} from 'next-intl/server';
import {notFound} from 'next/navigation';
import type {Metadata} from 'next';
import {routing} from '@/i18n/routing';
import {Providers} from '@/components/providers';
import {Toaster} from '@/components/ui/sonner';

type Props = {children: ReactNode; params: Promise<{locale: string}>};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export async function generateMetadata({params}: Omit<Props, 'children'>): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'metadata'});
  return {title: t('title'), description: t('description')};
}

export default async function LocaleLayout({children, params}: Props) {
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <NextIntlClientProvider>
      <Providers>
        {children}
        <Toaster richColors closeButton position="bottom-right" />
      </Providers>
    </NextIntlClientProvider>
  );
}
```

> Note: `<html>`/`<body>` live in the root `src/app/layout.tsx` (Task 0.2). The root layout does not know the locale; that's fine — `lang` is set there as a static shell and the visible content is localized. (If per-locale `<html lang>` is required, move the html shell into the locale layout in Phase 4; deferred to keep Phase 0 simple.)

- [ ] **Step 2: Placeholder `src/app/[locale]/page.tsx`**

```tsx
import {use} from 'react';
import {setRequestLocale} from 'next-intl/server';
import {useTranslations} from 'next-intl';

export default function Page({params}: {params: Promise<{locale: string}>}) {
  const {locale} = use(params);
  setRequestLocale(locale);
  const t = useTranslations('hero');
  return (
    <main className="min-h-[100dvh] grid place-items-center">
      <div className="text-center">
        <p className="font-mono text-primary">{t('prompt')}</p>
        <h1 className="text-4xl font-bold tracking-tighter">{t('name')}</h1>
        <p className="text-muted-foreground">{t('role')}</p>
      </div>
    </main>
  );
}
```

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: PASS. Static params generate `/en` and `/tr`.

- [ ] **Step 4: Browser verification**

Run: `npm run dev`. Check:
- `http://localhost:3000/en` → shows "Teoman Kirma / Fullstack Developer".
- `http://localhost:3000/tr` → shows "Teoman Kırma".
- `http://localhost:3000/` → redirects to `/en`.
- Toggle OS dark/light (or temporarily set `defaultTheme="light"`) → background flips, no hydration flash error in console.

- [ ] **Step 5: Commit (end of Phase 0)**

```bash
git add -A
git commit -m "feat: locale layout + provider wiring; app boots EN/TR

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

**Phase 0 done when:** `npm run build` + `npm run lint` clean; `/en` and `/tr` boot; theme toggles; no `@heroui`/`framer-motion`/`vite`/`zustand` references remain (`grep -ri "heroui\|framer-motion\|from 'vite'\|zustand" src` returns nothing).

---

# Phase 1 — Common primitives + Header, Hero, Footer

Goal: the page frame and the landing moment. After this phase the top and bottom of the site are real; middle sections are still absent.

## Task 1.1: `Section` + `SectionHeader` wrappers

**Files:**
- Create: `src/components/common/section.tsx`, `src/components/common/section-header.tsx`

- [ ] **Step 1: `section.tsx`**

```tsx
import type {ReactNode} from 'react';
import {cn} from '@/lib/utils';

export function Section({
  id,
  className,
  children,
}: {
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn('scroll-mt-20 py-20 md:py-28', className)}
    >
      <div className="mx-auto w-full max-w-6xl px-5 md:px-8">{children}</div>
    </section>
  );
}
```

- [ ] **Step 2: `section-header.tsx`** (heading only; eyebrow optional and rationed)

```tsx
import {cn} from '@/lib/utils';

export function SectionHeader({
  title,
  className,
}: {
  title: string;
  className?: string;
}) {
  return (
    <h2
      className={cn(
        'mb-10 text-3xl font-bold tracking-tight md:text-4xl',
        className,
      )}
    >
      {title}
    </h2>
  );
}
```

- [ ] **Step 3: Typecheck + commit**

```bash
npx tsc --noEmit
git add -A && git commit -m "feat: Section + SectionHeader primitives

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

## Task 1.2: `Reveal` GSAP scroll primitive

**Files:**
- Create: `src/components/common/reveal.tsx`

- [ ] **Step 1: `reveal.tsx`**

```tsx
'use client';

import {useRef, type ElementType, type ReactNode} from 'react';
import {gsap, useGSAP} from '@/lib/gsap';

type Variant = 'fadeUp' | 'fadeIn' | 'slideLeft' | 'slideRight';

const FROM: Record<Variant, gsap.TweenVars> = {
  fadeUp: {opacity: 0, y: 28},
  fadeIn: {opacity: 0},
  slideLeft: {opacity: 0, x: 40},
  slideRight: {opacity: 0, x: -40},
};

export function Reveal({
  as: Tag = 'div',
  variant = 'fadeUp',
  stagger,
  delay = 0,
  className,
  children,
}: {
  as?: ElementType;
  variant?: Variant;
  stagger?: number;
  delay?: number;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const targets = stagger
        ? gsap.utils.toArray<HTMLElement>(ref.current!.children)
        : ref.current!;
      gsap.from(targets, {
        ...FROM[variant],
        duration: 0.7,
        delay,
        ease: 'power3.out',
        stagger: stagger ?? 0,
        scrollTrigger: {trigger: ref.current!, start: 'top 80%', once: true},
      });
    },
    {scope: ref},
  );

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
```

> Reduced motion: `useGSAP` + GSAP respects `gsap.matchMedia`; the global reduced-motion guard is added in Phase 4 (Task 4.1). Until then, motion still renders — acceptable mid-build.

- [ ] **Step 2: Typecheck + commit**

```bash
npx tsc --noEmit
git add -A && git commit -m "feat: Reveal scroll primitive (GSAP)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

## Task 1.3: ThemeSwitcher + LanguageSwitcher + DownloadResumeButton

**Files:**
- Create: `src/components/common/theme-switcher.tsx`, `src/components/common/language-switcher.tsx`, `src/components/common/download-resume-button.tsx`

- [ ] **Step 1: `theme-switcher.tsx`**

```tsx
'use client';

import {useTheme} from 'next-themes';
import {Moon, Sun, Laptop} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function ThemeSwitcher() {
  const {setTheme} = useTheme();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Toggle theme">
          <Sun className="size-[1.1rem] dark:hidden" strokeWidth={1.75} />
          <Moon className="hidden size-[1.1rem] dark:block" strokeWidth={1.75} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme('light')}>
          <Sun strokeWidth={1.75} /> Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          <Moon strokeWidth={1.75} /> Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>
          <Laptop strokeWidth={1.75} /> System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

- [ ] **Step 2: `language-switcher.tsx`** (next-intl routing)

```tsx
'use client';

import {useLocale} from 'next-intl';
import {Languages} from 'lucide-react';
import {usePathname, useRouter} from '@/i18n/navigation';
import {routing} from '@/i18n/routing';
import {Button} from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const LABELS: Record<string, string> = {en: 'English', tr: 'Türkçe'};

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Change language">
          <Languages className="size-[1.1rem]" strokeWidth={1.75} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {routing.locales.map((l) => (
          <DropdownMenuItem
            key={l}
            disabled={l === locale}
            onClick={() => router.replace(pathname, {locale: l})}
          >
            {LABELS[l]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

- [ ] **Step 3: `download-resume-button.tsx`**

```tsx
import {Download} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {Button} from '@/components/ui/button';
import {RESUME_URL} from '@/lib/site';

export function DownloadResumeButton({variant = 'outline'}: {variant?: 'outline' | 'default'}) {
  const t = useTranslations();
  return (
    <Button asChild variant={variant}>
      <a href={RESUME_URL} download>
        <Download strokeWidth={1.75} /> {t('downloadResume')}
      </a>
    </Button>
  );
}
```

- [ ] **Step 4: Typecheck + commit**

```bash
npx tsc --noEmit
git add -A && git commit -m "feat: theme + language switchers, resume button

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

## Task 1.4: Header

**Files:**
- Create: `src/components/sections/header.tsx`

- [ ] **Step 1: `header.tsx`** (sticky, single-line desktop nav + mobile Sheet)

```tsx
'use client';

import {useState} from 'react';
import {useTranslations} from 'next-intl';
import {Menu} from 'lucide-react';
import {Link} from '@/i18n/navigation';
import {Button} from '@/components/ui/button';
import {Sheet, SheetContent, SheetTrigger, SheetTitle} from '@/components/ui/sheet';
import {ThemeSwitcher} from '@/components/common/theme-switcher';
import {LanguageSwitcher} from '@/components/common/language-switcher';
import {SECTION_IDS} from '@/lib/site';

const NAV = [
  {id: SECTION_IDS.home, key: 'home'},
  {id: SECTION_IDS.about, key: 'about'},
  {id: SECTION_IDS.resume, key: 'resume'},
  {id: SECTION_IDS.portfolio, key: 'portfolio'},
  {id: SECTION_IDS.contact, key: 'contact'},
] as const;

export function Header() {
  const t = useTranslations('header');
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/0 bg-background/70 backdrop-blur-md transition-colors data-[scrolled=true]:border-border">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:px-8">
        <a href={`#${SECTION_IDS.home}`} className="font-mono text-sm font-semibold">
          <span className="text-primary">●</span> {t('name')}
        </a>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {t(`menu.${item.key}`)}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <LanguageSwitcher />
          <ThemeSwitcher />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu strokeWidth={1.75} />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <SheetTitle className="font-mono text-primary">{t('name')}</SheetTitle>
              <nav className="mt-6 flex flex-col gap-1">
                {NAV.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={() => setOpen(false)}
                    className="rounded-md px-3 py-2 text-base text-muted-foreground hover:bg-accent hover:text-foreground"
                  >
                    {t(`menu.${item.key}`)}
                  </a>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
```

> The scrolled-border behavior (`data-scrolled`) is driven by a tiny ScrollTrigger added in Task 1.7 along with page assembly, or left as a CSS-only static border. Mark as `data-scrolled` toggled via a small client effect; acceptable to ship the static border first and enhance in Phase 4.

- [ ] **Step 2: Typecheck + commit**

```bash
npx tsc --noEmit
git add -A && git commit -m "feat: sticky Header with nav + mobile Sheet

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

## Task 1.5: Hero

**Files:**
- Create: `src/components/sections/hero.tsx`
- Uses: `src/assets/me.png`

- [ ] **Step 1: `hero.tsx`** (asymmetric split, SplitText name, portrait)

```tsx
'use client';

import {useRef} from 'react';
import Image from 'next/image';
import {useTranslations} from 'next-intl';
import {MapPin, ArrowRight} from 'lucide-react';
import {gsap, SplitText, useGSAP} from '@/lib/gsap';
import {Button} from '@/components/ui/button';
import {Badge} from '@/components/ui/badge';
import {DownloadResumeButton} from '@/components/common/download-resume-button';
import {SECTION_IDS} from '@/lib/site';
import me from '@/assets/me.png';

export function Hero() {
  const t = useTranslations('hero');
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const split = new SplitText('.hero-name', {type: 'chars'});
      const tl = gsap.timeline({defaults: {ease: 'power3.out'}});
      tl.from(split.chars, {yPercent: 110, opacity: 0, duration: 0.8, stagger: 0.025})
        .from('.hero-eyebrow', {opacity: 0, y: 10, duration: 0.5}, 0.1)
        .from('.hero-fade', {opacity: 0, y: 16, duration: 0.6, stagger: 0.08}, 0.4)
        .from('.hero-portrait', {opacity: 0, scale: 0.94, duration: 0.8}, 0.2);
      return () => split.revert();
    },
    {scope: ref},
  );

  return (
    <section
      id={SECTION_IDS.home}
      ref={ref}
      className="relative flex min-h-[100dvh] items-center overflow-hidden pt-16"
    >
      <div className="dot-grid pointer-events-none absolute inset-0 text-foreground/[0.06]" />
      <div className="pointer-events-none absolute left-1/4 top-1/3 size-[36rem] -translate-x-1/2 rounded-full bg-primary/15 blur-[120px]" />

      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-5 md:px-8 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <p className="hero-eyebrow mb-5 font-mono text-sm text-primary">{t('prompt')}</p>
          <h1 className="hero-name overflow-hidden text-5xl font-bold leading-[0.95] tracking-tighter md:text-7xl">
            {t('name')}
          </h1>
          <p className="hero-fade mt-4 font-mono text-lg text-muted-foreground md:text-xl">
            {t('role')}
          </p>
          <p className="hero-fade mt-5 max-w-[42ch] text-base leading-relaxed text-muted-foreground">
            {t('tagline')}
          </p>
          <div className="hero-fade mt-5">
            <Badge variant="secondary" className="font-mono">
              <MapPin className="size-3.5" strokeWidth={1.75} /> {t('location')}
            </Badge>
          </div>
          <div className="hero-fade mt-7 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <a href={`#${SECTION_IDS.contact}`}>
                {t('ctaContact')} <ArrowRight strokeWidth={1.75} />
              </a>
            </Button>
            <DownloadResumeButton />
          </div>
        </div>

        <div className="hero-portrait relative mx-auto w-full max-w-xs">
          <div className="overflow-hidden rounded-2xl border border-border">
            <Image
              src={me}
              alt="Teoman Kirma"
              priority
              placeholder="blur"
              className="h-auto w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Typecheck + commit**

```bash
npx tsc --noEmit
git add -A && git commit -m "feat: Hero (split + SplitText + portrait)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

## Task 1.6: Footer

**Files:**
- Create: `src/components/sections/footer.tsx`

- [ ] **Step 1: `footer.tsx`**

```tsx
import {useTranslations} from 'next-intl';
import {CURRENT_YEAR} from '@/lib/site';

export function Footer() {
  const t = useTranslations();
  return (
    <footer className="border-t border-border py-8">
      <p className="text-center font-mono text-xs text-muted-foreground">
        {t('footer.copyrightLabel')} © {CURRENT_YEAR} {t('header.name')}. {t('footer.copyright')}
      </p>
    </footer>
  );
}
```

- [ ] **Step 2: Typecheck + commit**

```bash
npx tsc --noEmit
git add -A && git commit -m "feat: Footer

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

## Task 1.7: Assemble page (Header + Hero + Footer)

**Files:**
- Modify: `src/app/[locale]/page.tsx`

- [ ] **Step 1: Replace `page.tsx`**

```tsx
import {use} from 'react';
import {setRequestLocale} from 'next-intl/server';
import {Header} from '@/components/sections/header';
import {Hero} from '@/components/sections/hero';
import {Footer} from '@/components/sections/footer';

export default function Page({params}: {params: Promise<{locale: string}>}) {
  const {locale} = use(params);
  setRequestLocale(locale);
  return (
    <>
      <Header />
      <main>
        <Hero />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Build + lint**

```bash
npm run build && npm run lint
```
Expected: both PASS.

- [ ] **Step 3: Browser verification**

`npm run dev`, then check at `/en` and `/tr`:
- Header sticky, nav on one line desktop, Sheet opens on mobile width (≤768px).
- Hero name animates in on load; portrait visible; CTAs visible without scroll; hero fits viewport.
- Theme toggle flips light/dark; emerald accent consistent.
- `prefers-reduced-motion: reduce` (DevTools → Rendering): page still readable (full reduced-motion polish lands Phase 4).

- [ ] **Step 4: Commit (end of Phase 1)**

```bash
git add -A && git commit -m "feat: assemble Header + Hero + Footer

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

**Phase 1 done when:** build + lint clean; hero renders + animates in EN/TR, light/dark; header nav + mobile sheet work; CTAs visible without scroll.

---

# Phase 2 — About + Resume

## Task 2.1: About section

**Files:**
- Create: `src/components/sections/about.tsx`

- [ ] **Step 1: `about.tsx`** (prose + mono facts list + stats; no card boxes)

```tsx
import {useTranslations} from 'next-intl';
import {Section} from '@/components/common/section';
import {SectionHeader} from '@/components/common/section-header';
import {Reveal} from '@/components/common/reveal';
import {DownloadResumeButton} from '@/components/common/download-resume-button';
import {SECTION_IDS, EMAIL, AGE, EXPERIENCE_YEARS} from '@/lib/site';

export function About() {
  const t = useTranslations('about');

  const facts = [
    {label: t('facts.nameLabel'), value: 'Teoman Kirma'},
    {label: t('facts.fromLabel'), value: t('facts.from')},
    {label: t('facts.ageLabel'), value: String(AGE)},
    {label: t('facts.emailLabel'), value: EMAIL},
  ];

  return (
    <Section id={SECTION_IDS.about}>
      <SectionHeader title={t('heading')} />
      <div className="grid gap-12 md:grid-cols-2">
        <Reveal variant="slideRight">
          <h3 className="text-xl font-semibold tracking-tight">{t('whoAmI')}</h3>
          <p className="mt-4 max-w-[60ch] leading-relaxed text-muted-foreground">{t('bodyA')}</p>
          <p className="mt-4 max-w-[60ch] leading-relaxed text-muted-foreground">{t('bodyB')}</p>
          <div className="mt-6">
            <DownloadResumeButton />
          </div>
        </Reveal>

        <Reveal variant="slideLeft">
          <dl className="divide-y divide-border">
            {facts.map((f) => (
              <div key={f.label} className="flex items-center justify-between py-3">
                <dt className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  {f.label}
                </dt>
                <dd className="text-sm">{f.value}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-8 flex gap-10">
            <div>
              <div className="font-mono text-3xl font-bold text-primary">{EXPERIENCE_YEARS}+</div>
              <div className="mt-1 text-xs text-muted-foreground">{t('stats.experienceText')}</div>
            </div>
            <div className="border-l border-border pl-10">
              <div className="font-mono text-3xl font-bold text-primary">{t('stats.projectsNumber')}+</div>
              <div className="mt-1 text-xs text-muted-foreground">{t('stats.projectsLabel')}</div>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
```

- [ ] **Step 2: Typecheck + commit**

```bash
npx tsc --noEmit
git add -A && git commit -m "feat: About section (prose + facts + stats)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

## Task 2.2: Skills marquee

**Files:**
- Create: `src/components/common/skills-marquee.tsx`

- [ ] **Step 1: `skills-marquee.tsx`** (GSAP loop, pause on hover, edge mask)

```tsx
'use client';

import {useRef} from 'react';
import {gsap, useGSAP} from '@/lib/gsap';
import {SKILLS} from '@/lib/site';

export function SkillsMarquee() {
  const ref = useRef<HTMLDivElement>(null);
  const tween = useRef<gsap.core.Tween | null>(null);

  useGSAP(
    () => {
      tween.current = gsap.to('.marquee-track', {
        xPercent: -50,
        ease: 'none',
        duration: 22,
        repeat: -1,
      });
    },
    {scope: ref},
  );

  const items = [...SKILLS, ...SKILLS];

  return (
    <div
      ref={ref}
      className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]"
      onMouseEnter={() => tween.current?.pause()}
      onMouseLeave={() => tween.current?.resume()}
    >
      <div className="marquee-track flex w-max gap-3">
        {items.map((skill, i) => (
          <span
            key={`${skill}-${i}`}
            className="whitespace-nowrap rounded-lg border border-border bg-card px-4 py-2 font-mono text-sm text-muted-foreground"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Typecheck + commit**

```bash
npx tsc --noEmit
git add -A && git commit -m "feat: skills marquee (GSAP loop, pause on hover)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

## Task 2.3: Resume section

**Files:**
- Create: `src/components/sections/resume.tsx`
- Uses: `src/assets/nisantasi-university.png`, `src/assets/bytesandpixels.jpeg`

- [ ] **Step 1: `resume.tsx`** (two cards + marquee)

```tsx
import Image from 'next/image';
import {useTranslations} from 'next-intl';
import {Section} from '@/components/common/section';
import {SectionHeader} from '@/components/common/section-header';
import {Reveal} from '@/components/common/reveal';
import {Card, CardContent} from '@/components/ui/card';
import {Badge} from '@/components/ui/badge';
import {SkillsMarquee} from '@/components/common/skills-marquee';
import {SECTION_IDS, GPA} from '@/lib/site';
import school from '@/assets/nisantasi-university.png';
import company from '@/assets/bytesandpixels.jpeg';

export function Resume() {
  const t = useTranslations('resume');

  return (
    <Section id={SECTION_IDS.resume} className="bg-card/30">
      <SectionHeader title={t('heading')} />
      <Reveal stagger={0.12} className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardContent className="flex gap-4 p-6">
            <Image src={school} alt={t('schoolName')} className="size-16 rounded-lg border border-border object-cover" />
            <div>
              <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">{t('eduTitle')}</p>
              <h3 className="mt-1 font-semibold">{t('schoolName')}</h3>
              <p className="text-sm text-muted-foreground">{t('degree')}</p>
              <div className="mt-2 flex items-center gap-2">
                <Badge className="font-mono">{t('eduYears')}</Badge>
                <span className="text-xs text-muted-foreground">{t('gpaLabel')} {GPA}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex gap-4 p-6">
            <Image src={company} alt={t('companyName')} className="size-16 rounded-lg border border-border object-cover" />
            <div>
              <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">{t('expTitle')}</p>
              <h3 className="mt-1 font-semibold">{t('expRole')}</h3>
              <p className="text-sm text-muted-foreground">{t('companyName')}</p>
              <p className="text-xs text-muted-foreground">{t('expLocation')}</p>
              <div className="mt-2">
                <Badge className="font-mono">{t('expDates')}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </Reveal>

      <div className="mt-12">
        <p className="mb-4 font-mono text-xs uppercase tracking-wider text-muted-foreground">{t('skillsLabel')}</p>
        <SkillsMarquee />
      </div>
    </Section>
  );
}
```

> The `eyebrow`-style `uppercase tracking-wider` mono labels here are field labels inside cards, not section eyebrows — they don't count against the 2-eyebrow page budget. Section headings (`SectionHeader`) carry no eyebrow.

- [ ] **Step 2: Add to page**

Modify `src/app/[locale]/page.tsx` `<main>`:

```tsx
<main>
  <Hero />
  <About />
  <Resume />
</main>
```
(add the imports for `About` and `Resume`).

- [ ] **Step 3: Build + lint + browser check**

```bash
npm run build && npm run lint
```
Then `npm run dev`: About facts + stats render; Resume cards + marquee scroll; marquee pauses on hover; EN/TR + light/dark correct.

- [ ] **Step 4: Commit (end of Phase 2)**

```bash
git add -A && git commit -m "feat: Resume section + wire About/Resume into page

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

**Phase 2 done when:** build + lint clean; About + Resume render in EN/TR, light/dark; marquee loops + pauses on hover.

---

# Phase 3 — Portfolio + Contact

## Task 3.1: Portfolio (pinned horizontal-pan + Dialog)

**Files:**
- Create: `src/components/sections/portfolio.tsx`

- [ ] **Step 1: `portfolio.tsx`**

Desktop (`≥768px`, motion allowed): section pins, track pans horizontally on scroll (canonical horizontal-pan, spec §5.B). Mobile / reduced-motion: native horizontal scroll-snap, no pin.

```tsx
'use client';

import {useRef} from 'react';
import Image from 'next/image';
import {useTranslations} from 'next-intl';
import {ExternalLink} from 'lucide-react';
import {gsap, ScrollTrigger, useGSAP} from '@/lib/gsap';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription,
} from '@/components/ui/dialog';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {SectionHeader} from '@/components/common/section-header';
import {PROJECTS} from '@/lib/projects';
import {SECTION_IDS} from '@/lib/site';

export function Portfolio() {
  const t = useTranslations('portfolio');
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
        () => {
          const distance = track.current!.scrollWidth - window.innerWidth;
          if (distance <= 0) return;
          gsap.to(track.current, {
            x: -distance,
            ease: 'none',
            scrollTrigger: {
              trigger: wrap.current,
              start: 'top top',
              end: () => `+=${distance}`,
              pin: true,
              scrub: 1,
              invalidateOnRefresh: true,
            },
          });
        },
      );
      return () => mm.revert();
    },
    {scope: wrap},
  );

  return (
    <section id={SECTION_IDS.portfolio} ref={wrap} className="relative overflow-hidden py-20 md:py-0">
      <div className="mx-auto max-w-6xl px-5 pt-0 md:px-8 md:pt-28">
        <SectionHeader title={t('heading')} />
        <p className="-mt-6 mb-10 max-w-[55ch] text-muted-foreground">{t('subtitle')}</p>
      </div>

      <div
        ref={track}
        className="flex gap-6 overflow-x-auto px-5 pb-4 [scrollbar-width:none] md:items-center md:overflow-visible md:px-8 md:pb-0"
        style={{scrollSnapType: 'x mandatory'}}
      >
        {PROJECTS.map((p) => (
          <Dialog key={p.key}>
            <DialogTrigger asChild>
              <button
                className="group w-[80vw] max-w-sm shrink-0 snap-start overflow-hidden rounded-xl border border-border bg-card text-left transition-all hover:-translate-y-1 hover:border-primary/60 md:w-[22rem]"
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <Image
                    src={p.image}
                    alt={p.title}
                    placeholder="blur"
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-semibold">{p.title}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {t(`items.${p.key}.description`)}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {p.technologies.split(',').slice(0, 3).map((tech) => (
                      <Badge key={tech} variant="secondary" className="font-mono text-[11px]">
                        {tech.trim()}
                      </Badge>
                    ))}
                  </div>
                </div>
              </button>
            </DialogTrigger>

            <DialogContent className="max-w-2xl">
              <div className="overflow-hidden rounded-lg border border-border">
                <Image src={p.image} alt={p.title} placeholder="blur" className="h-auto w-full object-cover" />
              </div>
              <DialogHeader>
                <DialogTitle>{p.title}</DialogTitle>
                <DialogDescription>{t(`items.${p.key}.description`)}</DialogDescription>
              </DialogHeader>
              <dl className="space-y-2 text-sm">
                <Row label={t('labels.technologies')} value={p.technologies} />
                <Row label={t('labels.industry')} value={t(`items.${p.key}.industry`)} />
                <Row label={t('labels.date')} value={t(`items.${p.key}.date`)} />
              </dl>
              <Button asChild className="mt-2 w-fit">
                <a href={p.href} target="_blank" rel="noreferrer">
                  {t(`items.${p.key}.linkLabel`)} <ExternalLink strokeWidth={1.75} />
                </a>
              </Button>
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </section>
  );
}

function Row({label, value}: {label: string; value: string}) {
  return (
    <div className="flex justify-between gap-6 border-b border-border py-2 last:border-0">
      <dt className="font-mono text-xs uppercase tracking-wider text-muted-foreground">{label}</dt>
      <dd className="text-right">{value}</dd>
    </div>
  );
}
```

> The `ScrollTrigger` import is referenced via `gsap.matchMedia`; ensure `ScrollTrigger` stays imported in `lib/gsap.ts` (it is, Task 0.6). `prefers-reduced-motion: no-preference` in the matchMedia query means reduced-motion users automatically get the native scroll-snap path with no pin — so this section's reduced-motion fallback is built in here, not deferred.

- [ ] **Step 2: Typecheck + commit**

```bash
npx tsc --noEmit
git add -A && git commit -m "feat: Portfolio (pinned horizontal-pan + Dialog)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

## Task 3.2: Contact schema

**Files:**
- Create: `src/schemas/contact.ts` (replace any old `src/schemas/index.ts`)
- Delete: `src/schemas/index.ts` if it still exists

- [ ] **Step 1: `src/schemas/contact.ts`**

```ts
import {z} from 'zod';

export type ContactMessages = {
  name_required: string; name_min: string; name_max: string;
  email_required: string; email_invalid: string; email_max: string;
  message_required: string; message_min: string; message_max: string;
};

export function makeContactSchema(m: ContactMessages) {
  return z.object({
    name: z
      .string({error: m.name_required})
      .min(2, m.name_min)
      .max(100, m.name_max),
    email: z
      .string({error: m.email_required})
      .min(1, m.email_required)
      .email(m.email_invalid)
      .max(254, m.email_max),
    message: z
      .string({error: m.message_required})
      .min(10, m.message_min)
      .max(2000, m.message_max),
  });
}

export type ContactValues = z.infer<ReturnType<typeof makeContactSchema>>;
```

- [ ] **Step 2: Typecheck + commit**

```bash
rm -f src/schemas/index.ts
npx tsc --noEmit
git add -A && git commit -m "feat: localized contact zod schema

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

## Task 3.3: Contact section (form + EmailJS + sonner)

**Files:**
- Create: `src/components/sections/contact.tsx`
- Uses: `src/assets/hi.gif` (optional decorative), `NEXT_PUBLIC_EMAILJS_*` env

- [ ] **Step 1: `contact.tsx`**

```tsx
'use client';

import {useRef} from 'react';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {useTranslations} from 'next-intl';
import emailjs from '@emailjs/browser';
import {toast} from 'sonner';
import {Github, Linkedin, Twitter} from 'lucide-react';
import {Section} from '@/components/common/section';
import {SectionHeader} from '@/components/common/section-header';
import {Reveal} from '@/components/common/reveal';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {Label} from '@/components/ui/label';
import {makeContactSchema, type ContactValues} from '@/schemas/contact';
import {SECTION_IDS, EMAIL, SOCIAL_LINKS} from '@/lib/site';

const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

export function Contact() {
  const t = useTranslations('contact');
  const tv = useTranslations('validation');
  const formRef = useRef<HTMLFormElement>(null);

  const schema = makeContactSchema({
    name_required: tv('name_required'), name_min: tv('name_min'), name_max: tv('name_max'),
    email_required: tv('email_required'), email_invalid: tv('email_invalid'), email_max: tv('email_max'),
    message_required: tv('message_required'), message_min: tv('message_min'), message_max: tv('message_max'),
  });

  const {register, handleSubmit, reset, formState: {errors, isSubmitting}} =
    useForm<ContactValues>({resolver: zodResolver(schema)});

  async function onSubmit() {
    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
      toast.warning(t('toast.notConfiguredTitle'), {description: t('toast.notConfiguredDescription')});
      return;
    }
    try {
      await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current!, {publicKey: PUBLIC_KEY});
      toast.success(t('toast.successTitle'), {description: t('toast.successDescription')});
      reset();
    } catch {
      toast.error(t('toast.failedTitle'), {description: t('toast.failedDescription')});
    }
  }

  return (
    <Section id={SECTION_IDS.contact}>
      <SectionHeader title={t('heading')} />
      <div className="grid gap-12 md:grid-cols-2">
        <Reveal variant="slideRight">
          <p className="max-w-[42ch] text-muted-foreground">{t('pitch')}</p>
          <a
            href={`mailto:${EMAIL}`}
            className="mt-5 inline-block font-mono text-primary underline-offset-4 hover:underline"
          >
            {EMAIL}
          </a>
          <div className="mt-6">
            <p className="mb-3 font-mono text-xs uppercase tracking-wider text-muted-foreground">{t('followMe')}</p>
            <div className="flex gap-3">
              <Social href={SOCIAL_LINKS.github} label="GitHub"><Github strokeWidth={1.75} /></Social>
              <Social href={SOCIAL_LINKS.linkedin} label="LinkedIn"><Linkedin strokeWidth={1.75} /></Social>
              <Social href={SOCIAL_LINKS.x} label="X"><Twitter strokeWidth={1.75} /></Social>
            </div>
          </div>
        </Reveal>

        <Reveal variant="slideLeft">
          <form
            id="contact-form"
            ref={formRef}
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
            noValidate
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">{t('nameLabel')}</Label>
              <Input id="name" {...register('name')} />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">{t('emailLabel')}</Label>
              <Input id="email" type="email" {...register('email')} />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="message">{t('messageLabel')}</Label>
              <Textarea id="message" rows={5} placeholder={t('messagePlaceholder')} {...register('message')} />
              {errors.message && <p className="text-xs text-destructive">{errors.message.message}</p>}
            </div>
            <Button type="submit" disabled={isSubmitting} className="w-fit">
              {isSubmitting ? t('submitting') : t('submit')}
            </Button>
          </form>
        </Reveal>
      </div>
    </Section>
  );
}

function Social({href, label, children}: {href: string; label: string; children: React.ReactNode}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="grid size-10 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary/60 hover:text-foreground"
    >
      {children}
    </a>
  );
}
```

> EmailJS preservation: form `id="contact-form"` and field `name`s (`name`, `email`, `message`) match the EmailJS template. `register('name'|'email'|'message')` sets the `name` attribute, so `sendForm` picks them up. The only change vs the old site is env var prefix (`VITE_*` → `NEXT_PUBLIC_*`, Task 4.3).

- [ ] **Step 2: Add to page**

`src/app/[locale]/page.tsx` `<main>` becomes:

```tsx
<main>
  <Hero />
  <About />
  <Resume />
  <Portfolio />
  <Contact />
</main>
```
(add imports for `Portfolio`, `Contact`).

- [ ] **Step 3: Build + lint + browser check**

```bash
npm run build && npm run lint
```
Then `npm run dev`, check at `/en` + `/tr`, light + dark, mobile + desktop:
- Portfolio: desktop pins + pans horizontally on scroll; mobile swipes (scroll-snap); Dialog opens with full details + working external link.
- Contact: validation errors show in correct language; submit with missing env → warning toast; field names intact.
- `prefers-reduced-motion: reduce`: Portfolio does NOT pin (native scroll), page fully usable.

- [ ] **Step 4: Commit (end of Phase 3)**

```bash
git add -A && git commit -m "feat: Contact (form + EmailJS + sonner) + full page assembled

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

**Phase 3 done when:** build + lint clean; all 6 sections render EN/TR + light/dark; portfolio pan works desktop + degrades on mobile/reduced-motion; contact validates + toasts in both locales.

---

# Phase 4 — Polish

## Task 4.1: Reduced-motion fallbacks for Hero, Reveal, marquee

Portfolio already gates on `prefers-reduced-motion: no-preference` (Task 3.1). Retrofit the other three so animations only run when motion is allowed; when reduced, elements render in their natural (final, visible) state because the `gsap.from` never executes.

**Files:** Modify `src/components/common/reveal.tsx`, `src/components/sections/hero.tsx`, `src/components/common/skills-marquee.tsx`

- [ ] **Step 1: `reveal.tsx` — wrap the effect body in `gsap.matchMedia`**

Replace the `useGSAP(() => { ... }, {scope: ref})` body with:

```tsx
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const targets = stagger
          ? gsap.utils.toArray<HTMLElement>(ref.current!.children)
          : ref.current!;
        gsap.from(targets, {
          ...FROM[variant],
          duration: 0.7,
          delay,
          ease: 'power3.out',
          stagger: stagger ?? 0,
          scrollTrigger: {trigger: ref.current!, start: 'top 80%', once: true},
        });
      });
      return () => mm.revert();
    },
    {scope: ref},
  );
```

- [ ] **Step 2: `hero.tsx` — wrap the timeline in `gsap.matchMedia`**

Replace the `useGSAP` body with:

```tsx
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const split = new SplitText('.hero-name', {type: 'chars'});
        const tl = gsap.timeline({defaults: {ease: 'power3.out'}});
        tl.from(split.chars, {yPercent: 110, opacity: 0, duration: 0.8, stagger: 0.025})
          .from('.hero-eyebrow', {opacity: 0, y: 10, duration: 0.5}, 0.1)
          .from('.hero-fade', {opacity: 0, y: 16, duration: 0.6, stagger: 0.08}, 0.4)
          .from('.hero-portrait', {opacity: 0, scale: 0.94, duration: 0.8}, 0.2);
        return () => split.revert();
      });
      return () => mm.revert();
    },
    {scope: ref},
  );
```

- [ ] **Step 3: `skills-marquee.tsx` — only animate under no-preference**

Replace the `useGSAP` body with:

```tsx
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        tween.current = gsap.to('.marquee-track', {
          xPercent: -50, ease: 'none', duration: 22, repeat: -1,
        });
      });
      return () => mm.revert();
    },
    {scope: ref},
  );
```

- [ ] **Step 4: Verify + commit**

`npm run dev`, DevTools → Rendering → emulate `prefers-reduced-motion: reduce`. Confirm: hero text fully visible (no hidden chars), sections visible without scroll-trigger, marquee static, portfolio native-scroll. Then disable emulation and confirm motion returns.

```bash
npm run build
git add -A && git commit -m "feat: reduced-motion fallbacks across all animations

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

## Task 4.2: Header scrolled-border enhancement

**Files:** Modify `src/components/sections/header.tsx`

- [ ] **Step 1: Add a scroll listener via ScrollTrigger** (no raw `scroll` listener)

Inside `Header`, add:

```tsx
import {useRef} from 'react';
import {ScrollTrigger, useGSAP} from '@/lib/gsap';
// ...
const headerRef = useRef<HTMLElement>(null);
useGSAP(() => {
  const st = ScrollTrigger.create({
    start: 8,
    onUpdate: (self) =>
      headerRef.current?.setAttribute('data-scrolled', String(self.scroll() > 8)),
  });
  return () => st.kill();
});
```

Attach `ref={headerRef}` to the `<header>`. (The `data-[scrolled=true]:border-border` class is already on it.)

- [ ] **Step 2: Verify + commit**

`npm run dev`: header border hairline appears after scrolling ~8px, gone at top.

```bash
npx tsc --noEmit && npm run build
git add -A && git commit -m "feat: header border fades in on scroll (ScrollTrigger)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

## Task 4.3: Environment, assets, public files

**Files:** Modify `.env.example`; create `public/resume.pdf`, favicon/OG assets

- [ ] **Step 1: Rewrite `.env.example`**

```bash
# EmailJS (https://www.emailjs.com/) — used by the contact form
NEXT_PUBLIC_EMAILJS_SERVICE_ID=
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=

# Optional: Google Analytics 4 measurement ID (leave unset locally)
NEXT_PUBLIC_GA_MEASUREMENT_ID=
```

- [ ] **Step 2: Move résumé + add OG/favicon**

Place the résumé PDF at `public/resume.pdf` (matches `RESUME_URL` in `lib/site.ts`). Add `src/app/icon.png` (favicon) and `src/app/opengraph-image.png` (1200×630) — Next.js auto-wires both from the `app` dir. If no OG image asset exists, leave a `<!-- TODO: opengraph-image.png 1200x630 -->` note and tell the user it's needed.

- [ ] **Step 3: Verify GA (optional)**

If `NEXT_PUBLIC_GA_MEASUREMENT_ID` is to be supported, add a `@next/third-parties` `<GoogleAnalytics>` in the locale layout gated on the env var. Otherwise skip (YAGNI) and note it in README.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "chore: env vars (NEXT_PUBLIC_*), resume.pdf, OG/favicon

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

## Task 4.4: Per-locale `<html lang>`

**Files:** Modify `src/app/layout.tsx`, `src/app/[locale]/layout.tsx`

Currently the root layout owns `<html>` with no locale. Set `lang` correctly per locale.

- [ ] **Step 1: Make root layout a passthrough that keeps fonts**

`src/app/layout.tsx`:

```tsx
import type {ReactNode} from 'react';

export default function RootLayout({children}: {children: ReactNode}) {
  return children;
}
```

- [ ] **Step 2: Move `<html>`/`<body>` + fonts into the locale layout**

In `src/app/[locale]/layout.tsx`, import the Geist fonts and `'@/styles/globals.css'`, and wrap the returned tree:

```tsx
return (
  <html lang={locale} suppressHydrationWarning className={`${GeistSans.variable} ${GeistMono.variable}`}>
    <body className="font-sans antialiased">
      <NextIntlClientProvider>
        <Providers>
          {children}
          <Toaster richColors closeButton position="bottom-right" />
        </Providers>
      </NextIntlClientProvider>
    </body>
  </html>
);
```

(Add the `geist/font/*` + css imports to the locale layout; remove them from the root.)

- [ ] **Step 3: Verify + commit**

`npm run build`; check `<html lang="tr">` on `/tr` via DevTools. No nested-html warning.

```bash
git add -A && git commit -m "fix: per-locale html lang

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

## Task 4.5: Lighthouse, Pre-Flight, docs

**Files:** Modify `README.md`, `AGENTS.md`

- [ ] **Step 1: Lighthouse**

`npm run build && npm start`. Run Lighthouse (Chrome DevTools MCP `lighthouse_audit` if available) on `/en`. Targets: Performance ≥ 90, LCP < 2.5s, CLS < 0.1. Fix regressions (most likely: ensure hero `me.png` uses `priority`, images sized).

- [ ] **Step 2: design-taste Pre-Flight Check**

Walk the spec §14 / skill §14 checklist against the built site. Mechanical ones:
- `grep -rn "—\|–" src messages` → **zero** em/en dashes in visible strings (fix any).
- Eyebrow count: section headings carry no uppercase-tracking eyebrow; only in-card field labels use it → page-level eyebrow count is the hero prompt + none = within budget.
- One accent (emerald) everywhere; one theme per page; one radius scale.
- No fake screenshots, real images used; CTAs single-intent ("Get in touch" + "Download résumé" are distinct); nav single line.

- [ ] **Step 3: Update `README.md` + `AGENTS.md`**

Rewrite both to describe the Next.js App Router + shadcn + GSAP + next-intl stack, the new `src/` structure (§5 of the spec), `messages/` files, env var names, and deploy (Vercel). Remove all HeroUI/Vite/Zustand/Framer references.

- [ ] **Step 4: Final commit**

```bash
npm run build && npm run lint
git add -A && git commit -m "docs: update README + AGENTS for new stack; polish pass

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

**Phase 4 done when:** Lighthouse ≥ 90; Pre-Flight Check passes (zero em-dashes, one accent/theme/radius, motivated motion, reduced-motion fallbacks, real images); README + AGENTS updated; `main` still untouched. Branch is ready to show the user for a ship decision.

---

## Plan Self-Review

**Spec coverage:**
- §4 stack add/remove/keep → Task 0.1 (deps), 0.5 (shadcn), 0.6 (gsap). ✓
- §5 file structure → created across Phases 0-3 at the exact paths. ✓
- §6 i18n (routing/request/navigation/middleware/messages) → Task 0.4. ✓
- §7 tokens/type/radius → Task 0.2 (globals.css), 0.5 (shadcn), root/locale layout fonts. ✓
- §8 motion (gsap reg, reduced-motion, Reveal, hero, marquee, pan) → Tasks 0.6, 1.2, 1.5, 2.2, 3.1, 4.1. ✓
- §9 sections (header/hero/about/resume/portfolio/contact/footer) → Tasks 1.4, 1.5, 2.1, 2.3, 3.1, 3.3, 1.6. ✓
- §10 providers (next-themes, sonner, locale via URL, no zustand) → Tasks 0.6, 0.7. ✓
- §11 anchors + metadata + env rename → `SECTION_IDS` (0.6), `generateMetadata` (0.7), Task 4.3. ✓
- §12 a11y/perf → Tasks 4.1 (reduced motion), 4.5 (Lighthouse), contrast tokens (0.2). ✓
- Testimonials dropped → never created; not in messages. ✓

**Placeholder scan:** Two intentional, user-facing TODOs flagged for the user (OG image asset in 4.3; résumé PDF source). All code steps contain full code. No "TBD"/"add error handling"/"similar to Task N" in code.

**Type consistency:** `makeContactSchema`/`ContactValues` (3.2) match usage in `contact.tsx` (3.3). `PROJECTS`/`ProjectKey` (0.6) match `portfolio.tsx` (3.1) and message keys `items.<key>` (0.4). `SECTION_IDS` keys (0.6) match Header nav + section ids. `SKILLS`, `AGE`, `EXPERIENCE_YEARS`, `CURRENT_YEAR`, `GPA`, `EMAIL`, `SOCIAL_LINKS`, `RESUME_URL` (0.6) match all consumers. Message namespaces in en.json/tr.json (0.4) match every `useTranslations(...)` call.

**Open risks to watch during execution:**
- shadcn `init` may rewrite `globals.css` `--primary`; Task 0.5 Step 1 explicitly re-checks emerald.
- `geist` font import path (`geist/font/sans`) — if the installed major differs, check the package's README; it exports `GeistSans`/`GeistMono`.
- GSAP `SplitText` is bundled free in 3.13+; if the install resolves older, bump `gsap` to `^3.13.0` (already pinned in 0.1).

---

## Execution Handoff

**Plan complete and saved to `docs/superpowers/plans/2026-05-30-portfolio-redesign.md`. Two execution options:**

**1. Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration.

**2. Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints.

**Which approach?**
