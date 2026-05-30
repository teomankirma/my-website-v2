# Animation Enhancements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the portfolio's motion continuous and noticeably more alive — re-triggering reveals, animated stat counters, heading text reveals, magnetic/tilt hover, and scroll parallax — all reduced-motion safe.

**Architecture:** Reusable GSAP primitives + two small hooks, each section opts in. Everything runs inside `useGSAP` with scoped refs and a `gsap.matchMedia` reduced-motion (and pointer/desktop) gate. No new dependencies — GSAP 3.13 + `@gsap/react` are installed and `ScrollTrigger`/`SplitText`/`useGSAP` are already registered in `src/lib/gsap.ts`.

**Tech Stack:** Next.js 16, React 19, TypeScript, GSAP 3.13 (ScrollTrigger, SplitText, quickTo, matchMedia), `@gsap/react` (useGSAP).

**Reference spec:** `docs/superpowers/specs/2026-05-30-animation-enhancements-design.md`

---

## Conventions for this plan

- **No test framework.** Per-task gates: `npx tsc --noEmit` clean, `npm run lint` clean, `npm run build` clean, plus the **browser check** described in each task (run `npm run dev`, verify, then stop the server with `lsof -ti tcp:3000 | xargs kill -9`).
- **Branch:** `redesign/dark-technical` (already checked out). Do NOT touch `main`.
- **Commits:** Conventional Commits, one per task, ending with the `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>` trailer.
- **GSAP property names matter:** use `x`/`y` (translate px), `rotationX`/`rotationY`/`rotation` (degrees — NOT `rotateX`), `transformPerspective`. `gsap.quickTo`, `gsap.utils.clamp`, `gsap.utils.snap` are core (no extra plugin).
- All animated components are `'use client'`. Selectors live inside `useGSAP(..., {scope: ref})`.

---

## Task 1: Reveals replay on scroll

**Files:** Modify `src/components/common/reveal.tsx`

Currently the reveal uses `once: true` (fires one time). Switch to `toggleActions` so it plays on enter and reverses when scrolled back up — re-triggering each pass.

- [ ] **Step 1: Edit the scrollTrigger config**

In `src/components/common/reveal.tsx`, inside the `mm.add('(prefers-reduced-motion: no-preference)', ...)` callback, change the `gsap.from(...)` `scrollTrigger` from:

```ts
scrollTrigger: {trigger: ref.current!, start: 'top 80%', once: true},
```
to:
```ts
scrollTrigger: {
  trigger: ref.current!,
  start: 'top 80%',
  end: 'bottom 20%',
  toggleActions: 'play none none reverse',
},
```

Leave everything else (variants, stagger, delay, matchMedia wrapper, cleanup) unchanged.

- [ ] **Step 2: Gates**

```bash
npx tsc --noEmit && npm run lint && npm run build
```
Expected: all clean.

- [ ] **Step 3: Browser check**

`npm run dev`. At `http://localhost:3000/en`: scroll down to About, then scroll back up above it and down again — the About/Resume/Contact blocks should re-animate (fade/slide) each time, not just once. Stop the server.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat(anim): reveals replay on scroll (toggleActions)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 2: Animated stat counter

**Files:** Create `src/components/common/counter.tsx`; Modify `src/components/sections/about.tsx`

- [ ] **Step 1: Create `src/components/common/counter.tsx`**

```tsx
'use client';

import {useRef} from 'react';
import {gsap, useGSAP} from '@/lib/gsap';

export function Counter({
  value,
  suffix = '',
  className,
}: {
  value: number;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = ref.current!;
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        el.textContent = `0${suffix}`;
        const obj = {n: 0};
        gsap.to(obj, {
          n: value,
          duration: 1.4,
          ease: 'power2.out',
          snap: {n: 1},
          onUpdate: () => {
            el.textContent = `${Math.round(obj.n)}${suffix}`;
          },
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none reset',
          },
        });
      });

      mm.add('(prefers-reduced-motion: reduce)', () => {
        el.textContent = `${value}${suffix}`;
      });

      return () => mm.revert();
    },
    {scope: ref, dependencies: [value, suffix]},
  );

  return (
    <span ref={ref}>
      {value}
      {suffix}
    </span>
  );
}
```

- [ ] **Step 2: Wire into About stats**

In `src/components/sections/about.tsx`, add the import:
```tsx
import {Counter} from '@/components/common/counter';
```
Replace the two stat number `<div>`s. Find:
```tsx
<div className="font-mono text-3xl font-bold text-primary">{EXPERIENCE_YEARS}+</div>
```
→
```tsx
<div className="font-mono text-3xl font-bold text-primary">
  <Counter value={EXPERIENCE_YEARS} suffix="+" />
</div>
```
and find:
```tsx
<div className="font-mono text-3xl font-bold text-primary">{t('stats.projectsNumber')}+</div>
```
→
```tsx
<div className="font-mono text-3xl font-bold text-primary">
  <Counter value={Number(t('stats.projectsNumber'))} suffix="+" />
</div>
```

- [ ] **Step 3: Gates**

```bash
npx tsc --noEmit && npm run lint && npm run build
```
Expected: all clean.

- [ ] **Step 4: Browser check**

`npm run dev`, `/en`: scroll to About — the "6+" and "40+" numbers should tick up from 0. Scroll away and back — they re-count. Toggle DevTools → Rendering → `prefers-reduced-motion: reduce`: numbers show final value instantly. Stop the server.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat(anim): animated stat counters in About

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 3: Heading text reveals (SplitText)

**Files:** Modify `src/components/common/section-header.tsx`

Turn `SectionHeader` into a client component that splits its title into words and staggers them in on scroll, re-triggering.

- [ ] **Step 1: Replace `src/components/common/section-header.tsx`**

```tsx
'use client';

import {useRef} from 'react';
import {gsap, SplitText, useGSAP} from '@/lib/gsap';
import {cn} from '@/lib/utils';

export function SectionHeader({
  title,
  className,
}: {
  title: string;
  className?: string;
}) {
  const ref = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const el = ref.current!;
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const split = new SplitText(el, {type: 'words'});
        gsap.from(split.words, {
          yPercent: 110,
          opacity: 0,
          duration: 0.6,
          ease: 'power3.out',
          stagger: 0.08,
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            end: 'bottom 30%',
            toggleActions: 'play none none reverse',
          },
        });
        return () => split.revert();
      });
      return () => mm.revert();
    },
    {scope: ref},
  );

  return (
    <h2
      ref={ref}
      className={cn(
        'mb-10 overflow-hidden text-3xl font-bold tracking-tight md:text-4xl',
        className,
      )}
    >
      {title}
    </h2>
  );
}
```

> `overflow-hidden` clips the word-rise so descenders don't peek before animating. The split words wrap inline; `overflow-hidden` is safe on the `h2`.

- [ ] **Step 2: Gates**

```bash
npx tsc --noEmit && npm run lint && npm run build
```
Expected: all clean. (`SectionHeader` is used by About, Resume, Portfolio, Contact — all now get the reveal. Those sections render fine as server components importing a client child.)

- [ ] **Step 3: Browser check**

`npm run dev`, `/en` and `/tr`: scrolling each section in animates the heading word-by-word; scrolling back up and down replays it. Reduced-motion: headings static. Stop the server.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat(anim): heading word-stagger reveal via SplitText

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 4: Magnetic hover hook + wire CTAs

**Files:** Create `src/lib/animation/use-magnetic.ts`; Modify `src/components/sections/hero.tsx`, `src/components/sections/contact.tsx`

> Design note: the spec mentioned a `MagneticButton` wrapper, but the hero CTAs use `<Button asChild><a>…</a></Button>` (the anchor is the real element), so a generic wrapper is awkward. The reusable unit is the **hook**, applied directly to each target's ref. This is the intended, DRY approach.

- [ ] **Step 1: Create `src/lib/animation/use-magnetic.ts`**

```ts
'use client';

import {useRef} from 'react';
import {gsap, useGSAP} from '@/lib/gsap';

export function useMagnetic<T extends HTMLElement>(
  {strength = 0.35, max = 8}: {strength?: number; max?: number} = {},
) {
  const ref = useRef<T>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (!window.matchMedia('(pointer: fine)').matches) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const xTo = gsap.quickTo(el, 'x', {duration: 0.4, ease: 'power3'});
      const yTo = gsap.quickTo(el, 'y', {duration: 0.4, ease: 'power3'});

      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        xTo(gsap.utils.clamp(-max, max, dx * strength));
        yTo(gsap.utils.clamp(-max, max, dy * strength));
      };
      const leave = () => {
        xTo(0);
        yTo(0);
      };

      el.addEventListener('pointermove', move);
      el.addEventListener('pointerleave', leave);
      return () => {
        el.removeEventListener('pointermove', move);
        el.removeEventListener('pointerleave', leave);
      };
    },
    {scope: ref},
  );

  return ref;
}
```

- [ ] **Step 2: Wire hero CTAs (`src/components/sections/hero.tsx`)**

Add import:
```tsx
import {useMagnetic} from '@/lib/animation/use-magnetic';
```
Inside the `Hero` component body (top, with other hooks), add two refs:
```tsx
const contactCtaRef = useMagnetic<HTMLAnchorElement>();
const resumeCtaRef = useMagnetic<HTMLAnchorElement>();
```
Attach `contactCtaRef` to the "Get in touch" anchor. Find:
```tsx
<Button asChild size="lg">
  <a href={`#${SECTION_IDS.contact}`}>
    {t('ctaContact')} <ArrowRight strokeWidth={1.75} />
  </a>
</Button>
```
→ add `ref={contactCtaRef}` to the `<a>`:
```tsx
<Button asChild size="lg">
  <a ref={contactCtaRef} href={`#${SECTION_IDS.contact}`}>
    {t('ctaContact')} <ArrowRight strokeWidth={1.75} />
  </a>
</Button>
```
For the résumé CTA: `DownloadResumeButton` renders its own anchor internally, so it can't take this ref directly. Add an optional `anchorRef` prop to `DownloadResumeButton` and forward it. In `src/components/common/download-resume-button.tsx`, change the signature/usage:
```tsx
import {type Ref} from 'react';
// ...
export function DownloadResumeButton({
  variant = 'outline',
  size = 'lg',
  anchorRef,
}: {
  variant?: 'outline' | 'default';
  size?: 'default' | 'lg';
  anchorRef?: Ref<HTMLAnchorElement>;
}) {
  const t = useTranslations();
  return (
    <Button asChild variant={variant} size={size}>
      <a ref={anchorRef} href={RESUME_URL} download>
        <Download strokeWidth={1.75} /> {t('downloadResume')}
      </a>
    </Button>
  );
}
```
(If `size` was already a prop from an earlier fix, keep its existing default of `'lg'` and just add `anchorRef`.) Then in `hero.tsx` pass it:
```tsx
<DownloadResumeButton anchorRef={resumeCtaRef} />
```

- [ ] **Step 3: Wire contact submit (`src/components/sections/contact.tsx`)**

Add import:
```tsx
import {useMagnetic} from '@/lib/animation/use-magnetic';
```
In the component body:
```tsx
const submitRef = useMagnetic<HTMLButtonElement>();
```
Attach to the submit button. Find:
```tsx
<Button type="submit" disabled={isSubmitting || !isValid} className="w-fit">
```
→
```tsx
<Button ref={submitRef} type="submit" disabled={isSubmitting || !isValid} className="w-fit">
```
(The shadcn `Button` forwards its ref. The magnetic effect on a disabled button is harmless — no pull is noticeable while disabled; do not gate it on validity.)

- [ ] **Step 4: Gates**

```bash
npx tsc --noEmit && npm run lint && npm run build
```
Expected: all clean.

- [ ] **Step 5: Browser check**

`npm run dev`, `/en` (desktop pointer): hover the hero "Get in touch" / "Download résumé" and the contact "Send message" — each should subtly pull toward the cursor (~≤8px) and spring back on leave. Reduced-motion or touch: no pull. Stop the server.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat(anim): magnetic hover on hero CTAs + contact submit

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 5: Portfolio card tilt

**Files:** Create `src/lib/animation/use-tilt.ts`; Modify `src/components/sections/portfolio.tsx`

- [ ] **Step 1: Create `src/lib/animation/use-tilt.ts`**

```ts
'use client';

import {useRef} from 'react';
import {gsap, useGSAP} from '@/lib/gsap';

export function useTilt<T extends HTMLElement>({max = 6}: {max?: number} = {}) {
  const ref = useRef<T>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (!window.matchMedia('(pointer: fine)').matches) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      gsap.set(el, {transformPerspective: 800, transformOrigin: 'center'});
      const rotX = gsap.quickTo(el, 'rotationX', {duration: 0.4, ease: 'power3'});
      const rotY = gsap.quickTo(el, 'rotationY', {duration: 0.4, ease: 'power3'});

      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5; // -0.5..0.5
        const py = (e.clientY - r.top) / r.height - 0.5;
        rotY(px * max * 2);
        rotX(-py * max * 2);
      };
      const leave = () => {
        rotX(0);
        rotY(0);
      };

      el.addEventListener('pointermove', move);
      el.addEventListener('pointerleave', leave);
      return () => {
        el.removeEventListener('pointermove', move);
        el.removeEventListener('pointerleave', leave);
      };
    },
    {scope: ref},
  );

  return ref;
}
```

- [ ] **Step 2: Apply to portfolio cards (`src/components/sections/portfolio.tsx`)**

The card button currently has a CSS hover transform (`hover:-translate-y-1`) which would fight GSAP's transform on the same element. Remove that translate (keep the border-glow), and let GSAP own the transform.

Add import:
```tsx
import {useTilt} from '@/lib/animation/use-tilt';
```
The cards are rendered with `.map()`, so the tilt ref must be created per-card. Extract the card into a small inner component within the same file so each instance gets its own hook. Add this component (above the default export or below it) in `portfolio.tsx`:
```tsx
function TiltCard({children}: {children: React.ReactNode}) {
  const ref = useTilt<HTMLButtonElement>({max: 6});
  return (
    <button
      ref={ref}
      className="group w-[80vw] max-w-sm shrink-0 snap-start overflow-hidden rounded-xl border border-border bg-card text-left transition-[border-color,box-shadow] duration-300 hover:border-primary/60 md:w-[22rem]"
    >
      {children}
    </button>
  );
}
```
Then in the `.map()`, replace the existing `<DialogTrigger asChild><button className="group ...hover:-translate-y-1...">…</button></DialogTrigger>` so the trigger wraps `TiltCard`:
```tsx
<DialogTrigger asChild>
  <TiltCard>
    {/* the existing inner content: <div className="aspect-[16/10]...">…image…</div> and the <div className="p-5">…title/desc/badges…</div> */}
  </TiltCard>
</DialogTrigger>
```
Move the card's existing inner markup (the image wrapper + the `p-5` content block) inside `TiltCard` as its children. Key changes vs the old button: the old `hover:-translate-y-1` is removed (GSAP owns transform now), `transition-all` narrowed to `transition-[border-color,box-shadow]` so CSS never animates `transform`. The image's `group-hover:scale-105` stays (it's on the inner image, a separate element — no conflict).

> `DialogTrigger asChild` passes its props/ref to the single child. `TiltCard` must forward neither (the Dialog needs the button's onClick/aria). To keep it simple, render `TiltCard` to output exactly one `<button>` and accept the Dialog's injected props by spreading them. Update `TiltCard` to accept and spread props:
> ```tsx
> function TiltCard({children, ...props}: React.ComponentProps<'button'>) {
>   const ref = useTilt<HTMLButtonElement>({max: 6});
>   return (
>     <button ref={ref} {...props} className="group w-[80vw] max-w-sm shrink-0 snap-start overflow-hidden rounded-xl border border-border bg-card text-left transition-[border-color,box-shadow] duration-300 hover:border-primary/60 md:w-[22rem]">
>       {children}
>     </button>
>   );
> }
> ```
> `DialogTrigger asChild` will inject `onClick`, `aria-*`, `data-state`, and a ref. The injected ref and our `useTilt` ref both need the node — use a merged ref. Simplest robust approach: let `DialogTrigger` own the trigger ref and apply tilt to an inner wrapper instead. To avoid ref-merging complexity, restructure so the `<button>` is the DialogTrigger and the **tilt is applied to an inner `div` wrapper** that holds the card content:
> ```tsx
> <DialogTrigger asChild>
>   <button className="group block w-[80vw] max-w-sm shrink-0 snap-start text-left md:w-[22rem]">
>     <TiltInner>
>       {/* image wrapper + p-5 content */}
>     </TiltInner>
>   </button>
> </DialogTrigger>
> ```
> where:
> ```tsx
> function TiltInner({children}: {children: React.ReactNode}) {
>   const ref = useTilt<HTMLDivElement>({max: 6});
>   return (
>     <div ref={ref} className="overflow-hidden rounded-xl border border-border bg-card transition-[border-color,box-shadow] duration-300 group-hover:border-primary/60">
>       {children}
>     </div>
>   );
> }
> ```
> This keeps the Dialog trigger ref on the `<button>` and the tilt ref on the inner `<div>` — no ref merging, no transform conflict.

Use the `TiltInner` approach above (the inner-wrapper version) as the implementation.

- [ ] **Step 3: Gates**

```bash
npx tsc --noEmit && npm run lint && npm run build
```
Expected: all clean.

- [ ] **Step 4: Browser check**

`npm run dev`, `/en` (desktop): hover a portfolio card and move the cursor — the card tilts toward the pointer (≤6°) and resets on leave; clicking still opens the Dialog. On reduced-motion/touch: no tilt, click still works. Stop the server.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat(anim): 3D cursor tilt on portfolio cards

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 6: Nav underline + active-section highlight

**Files:** Modify `src/components/sections/header.tsx`

- [ ] **Step 1: Add active-section state + ScrollTriggers**

In `src/components/sections/header.tsx` (already `'use client'`), import `useState` and the gsap helpers if not present:
```tsx
import {useState} from 'react';
import {ScrollTrigger, useGSAP} from '@/lib/gsap';
```
Add state for the active section and a `useGSAP` that creates one ScrollTrigger per nav target:
```tsx
const [activeId, setActiveId] = useState<string>(SECTION_IDS.home);

useGSAP(() => {
  const triggers = NAV.map((item) =>
    ScrollTrigger.create({
      trigger: `#${item.id}`,
      start: 'top center',
      end: 'bottom center',
      onToggle: (self) => {
        if (self.isActive) setActiveId(item.id);
      },
    }),
  );
  return () => triggers.forEach((t) => t.kill());
});
```
(`NAV` already exists in the file — the array of `{id, key}`. The existing scroll-border `useGSAP` from a prior task stays; this is a second `useGSAP` call, which is fine.)

- [ ] **Step 2: Add the underline + active styling to desktop nav links**

In the desktop `<nav>` link map, give each `<a>` a `data-active` attribute and underline classes. Replace the desktop nav anchor:
```tsx
<a
  key={item.id}
  href={`#${item.id}`}
  className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
>
  {t(`menu.${item.key}`)}
</a>
```
with:
```tsx
<a
  key={item.id}
  href={`#${item.id}`}
  data-active={activeId === item.id}
  className="relative px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground data-[active=true]:text-foreground after:pointer-events-none after:absolute after:bottom-1 after:left-3 after:right-3 after:h-px after:origin-left after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 hover:after:scale-x-100 data-[active=true]:after:scale-x-100"
>
  {t(`menu.${item.key}`)}
</a>
```

- [ ] **Step 3: Gates**

```bash
npx tsc --noEmit && npm run lint && npm run build
```
Expected: all clean.

- [ ] **Step 4: Browser check**

`npm run dev`, `/en` (desktop): hovering a nav link slides an emerald underline in from the left; as you scroll the page, the underline + foreground color track the section currently in view. Stop the server.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat(anim): nav underline + scroll-synced active section

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 7: Hero parallax depth

**Files:** Modify `src/components/sections/hero.tsx`

Move the dot-grid and emerald glow slower than the foreground content as the hero scrolls away (desktop only, reduced-motion off).

- [ ] **Step 1: Add classNames to the background layers**

In `hero.tsx`, the two background divs currently are:
```tsx
<div className="dot-grid pointer-events-none absolute inset-0 text-foreground/[0.12]" />
<div className="pointer-events-none absolute left-1/4 top-1/3 size-[36rem] -translate-x-1/2 rounded-full bg-primary/15 blur-[120px]" />
```
Add marker classes:
```tsx
<div className="hero-dotgrid dot-grid pointer-events-none absolute inset-0 text-foreground/[0.12]" />
<div className="hero-glow pointer-events-none absolute left-1/4 top-1/3 size-[36rem] -translate-x-1/2 rounded-full bg-primary/15 blur-[120px]" />
```

- [ ] **Step 2: Add a parallax matchMedia branch inside the existing hero `useGSAP`**

In the hero's `useGSAP` callback, after the existing `mm.add('(prefers-reduced-motion: no-preference)', ...)` block (the load timeline), add a second branch on the same `mm`:
```tsx
mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
  const st = {
    trigger: ref.current!,
    start: 'top top',
    end: 'bottom top',
    scrub: 1,
  } as const;
  gsap.to('.hero-dotgrid', {yPercent: 12, ease: 'none', scrollTrigger: st});
  gsap.to('.hero-glow', {yPercent: 30, ease: 'none', scrollTrigger: st});
});
```
Keep the existing `return () => mm.revert();` (it reverts all branches). If the load timeline block declared its own `const mm = gsap.matchMedia()`, reuse that same `mm` for this branch — do NOT create a second matchMedia instance.

> Note: `.hero-glow` already has a `-translate-x-1/2` (CSS transform). GSAP animating `yPercent` writes to the transform too; to avoid GSAP clobbering the CSS translateX, set the x offset via GSAP instead: add `xPercent: -50` to a `gsap.set('.hero-glow', {xPercent: -50})` at the top of this branch and remove `-translate-x-1/2` from the div's className (replace it with the same centering via the left position already present). Concretely: change the glow div className to drop `-translate-x-1/2`, and in this branch first call `gsap.set('.hero-glow', {xPercent: -50})` before the `gsap.to`. This keeps horizontal centering while GSAP owns the transform.

- [ ] **Step 3: Gates**

```bash
npx tsc --noEmit && npm run lint && npm run build
```
Expected: all clean.

- [ ] **Step 4: Browser check**

`npm run dev`, `/en` (desktop ≥768px): as you scroll the hero out of view, the dot-grid and the emerald glow drift slower than the headline/portrait (parallax). Confirm the glow stays horizontally centered behind the headline (didn't jump left). Mobile (<768px) and reduced-motion: no parallax. Stop the server.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat(anim): hero dot-grid + glow parallax on scroll

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 8: Full reduced-motion + cross-locale verification

**Files:** none (verification + any fixes surfaced)

- [ ] **Step 1: Build + lint**

```bash
npx tsc --noEmit && npm run lint && npm run build
```
Expected: all clean.

- [ ] **Step 2: Motion verification (`npm run dev`)**

At `/en` and `/tr`, desktop width, confirm all of:
- Reveals (About/Resume/Contact blocks) replay when scrolled out and back in.
- Section headings animate word-by-word and replay.
- About stat counters tick up and re-count.
- Hero CTAs + contact submit have magnetic pull; portfolio cards tilt.
- Nav underline animates on hover and tracks the active section on scroll.
- Hero dot-grid/glow parallax on scroll; glow stays centered.

- [ ] **Step 3: Reduced-motion audit**

DevTools → Rendering → emulate `prefers-reduced-motion: reduce`, reload `/en`:
- No magnetic pull, no card tilt, no parallax.
- Counters show final values immediately.
- Reveals + headings render fully visible and static (no hidden content).
- Page is fully usable; no console errors.

- [ ] **Step 4: Mobile check**

Resize to ~390px: no magnetic/tilt (touch), no hero parallax; reveals/counters/heading reveals still work; nothing janky. Stop the server.

- [ ] **Step 5: Commit (if any fixes were needed)**

```bash
git add -A && git commit -m "fix(anim): reduced-motion + cross-locale polish"
# (include the Co-Authored-By trailer; skip the commit if no changes were needed)
```

---

## Self-Review

**Spec coverage:**
- §2 re-trigger reveals → Task 1. ✓
- §2/§5.2 stat counters → Task 2. ✓
- §2/§5.3 heading text reveals → Task 3. ✓
- §2/§5.4 magnetic CTAs → Task 4. ✓
- §2/§5.5 card tilt → Task 5. ✓
- §2/§5.6 nav underline + active highlight → Task 6. ✓
- §2/§5.7 parallax → Task 7 (hero dot-grid + glow). Per-heading parallax was "optional" in the spec and is intentionally dropped to avoid a dual-ScrollTrigger transform conflict on the heading element — noted here as a deliberate scope trim; hero parallax delivers the "parallax depth on scroll" requirement. ✓
- §2 reduced-motion mandatory → every task gates on `prefers-reduced-motion`; Task 8 audits it. ✓
- §3 no new deps → only GSAP core APIs used. ✓

**Placeholder scan:** No TBD/TODO; every code step has complete code. The only judgment items (exact magnitudes) are given concrete defaults (max 8px magnetic, 6° tilt, 12/30 yPercent parallax) and flagged for browser tuning in Task 8 — not placeholders.

**Type consistency:** `Counter({value, suffix, className})`, `useMagnetic<T>({strength,max})→ref`, `useTilt<T>({max})→ref` are used consistently across tasks. `DownloadResumeButton` gains `anchorRef?: Ref<HTMLAnchorElement>` and keeps `size`/`variant`. `NAV`/`SECTION_IDS`/`activeId` names match the existing header. GSAP property names (`x`,`y`,`rotationX`,`rotationY`,`yPercent`,`xPercent`,`transformPerspective`) are GSAP-correct.

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-05-30-animation-enhancements.md`. Two execution options:

1. **Subagent-Driven (recommended)** — fresh subagent per task, review + browser-verify between tasks.
2. **Inline Execution** — batch with checkpoints.

Which approach?
