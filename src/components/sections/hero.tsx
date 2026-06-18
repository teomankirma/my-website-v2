'use client';

import {useRef} from 'react';
import Image from 'next/image';
import {useTranslations} from 'next-intl';
import {ArrowDownRight} from 'lucide-react';
import {gsap, SplitText, useGSAP} from '@/lib/gsap';
import {useMagnetic} from '@/lib/animation/use-magnetic';
import {Button} from '@/components/ui/button';
import {DownloadResumeButton} from '@/components/common/download-resume-button';
import {SECTION_IDS} from '@/lib/site';
import me from '@/assets/me.png';

export function Hero() {
  const t = useTranslations('hero');
  const ref = useRef<HTMLDivElement>(null);
  const contactCtaRef = useMagnetic<HTMLAnchorElement>();
  const resumeCtaRef = useMagnetic<HTMLAnchorElement>();

  const [first, ...rest] = t('name').split(' ');
  const last = rest.join(' ');

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const split = new SplitText('.hero-name', {type: 'chars'});
        const tl = gsap.timeline({defaults: {ease: 'power3.out'}});
        tl.from('.hero-topbar', {opacity: 0, y: -12, duration: 0.5})
          .from(split.chars, {yPercent: 115, duration: 0.9, stagger: 0.022}, 0.1)
          .from('.hero-fade', {opacity: 0, y: 18, duration: 0.6, stagger: 0.08}, 0.5)
          .from('.hero-portrait', {opacity: 0, scale: 0.96, duration: 0.9}, 0.3);
        return () => split.revert();
      });
      mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
        const st = {
          trigger: ref.current!,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        } as const;
        gsap.to('.hero-gridbg', {yPercent: 14, ease: 'none', scrollTrigger: st});
        gsap.to('.hero-portrait', {yPercent: -10, ease: 'none', scrollTrigger: st});
      });
      return () => mm.revert();
    },
    {scope: ref},
  );

  return (
    <section
      id={SECTION_IDS.home}
      ref={ref}
      className="relative flex min-h-[100dvh] flex-col justify-center overflow-hidden pt-24 pb-12"
    >
      <div className="hero-gridbg grid-lines pointer-events-none absolute inset-0 text-foreground/[0.05] [mask-image:radial-gradient(ellipse_90%_70%_at_50%_30%,#000_50%,transparent_100%)]" />

      <div className="mx-auto w-full max-w-6xl px-5 md:px-8">
        {/* top meta bar */}
        <div className="hero-topbar mb-10 flex items-center justify-between border-t border-foreground pt-4 font-mono text-xs text-muted-foreground md:mb-14">
          <span className="text-primary">{t('prompt')}</span>
          <span className="uppercase tracking-[0.18em]">{t('location')}</span>
        </div>

        <div className="grid items-end gap-10 lg:grid-cols-[1fr_auto]">
          {/* giant wordmark */}
          <div>
            <p className="hero-fade mb-4 font-mono text-sm uppercase tracking-[0.2em] text-muted-foreground">
              {t('role')}
            </p>
            <h1 className="hero-name overflow-hidden text-[clamp(3.25rem,14vw,11rem)] font-bold uppercase leading-[0.86] tracking-tighter">
              <span className="block">{first}</span>
              <span className="block">
                {last}
                <span className="text-primary">.</span>
              </span>
            </h1>
          </div>

          {/* portrait */}
          <div className="hero-portrait order-first w-40 shrink-0 sm:w-48 lg:order-none lg:w-56">
            <div className="relative overflow-hidden border border-border">
              <Image
                src={me}
                alt={t('name')}
                priority
                placeholder="blur"
                className="aspect-[4/5] w-full object-cover grayscale transition-[filter] duration-500 hover:grayscale-0"
              />
            </div>
          </div>
        </div>

        {/* bottom row */}
        <div className="mt-10 grid gap-8 border-t border-border pt-8 md:mt-14 md:grid-cols-[1fr_auto] md:items-end">
          <p className="hero-fade max-w-[46ch] text-lg leading-relaxed text-muted-foreground md:text-xl">
            {t('tagline')}
          </p>
          <div className="hero-fade flex flex-wrap gap-3">
            <Button asChild size="lg">
              <a ref={contactCtaRef} href={`#${SECTION_IDS.contact}`}>
                {t('ctaContact')} <ArrowDownRight strokeWidth={1.75} />
              </a>
            </Button>
            <DownloadResumeButton anchorRef={resumeCtaRef} />
          </div>
        </div>
      </div>
    </section>
  );
}
