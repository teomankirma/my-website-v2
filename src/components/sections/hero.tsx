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
