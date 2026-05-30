'use client';

import {useRef} from 'react';
import Image from 'next/image';
import {useTranslations} from 'next-intl';
import {ExternalLink} from 'lucide-react';
import {gsap, useGSAP} from '@/lib/gsap';
import {useTilt} from '@/lib/animation/use-tilt';
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
          // Use clientWidth (excludes the scrollbar) so the pan reaches the
          // edge correctly even with always-visible scrollbars. Function-based
          // values recompute on refresh/resize via invalidateOnRefresh.
          const getDistance = () =>
            track.current!.scrollWidth - document.documentElement.clientWidth;
          if (getDistance() <= 0) return;
          gsap.to(track.current, {
            x: () => -getDistance(),
            ease: 'none',
            scrollTrigger: {
              trigger: wrap.current,
              start: 'top top',
              end: () => `+=${getDistance()}`,
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
              <button className="group block w-[80vw] max-w-sm shrink-0 snap-start text-left md:w-[22rem]">
                <TiltInner>
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
                </TiltInner>
              </button>
            </DialogTrigger>

            <DialogContent className="w-[92vw] sm:max-w-3xl md:max-w-4xl max-h-[90vh] overflow-y-auto sm:p-6">
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

function TiltInner({children}: {children: React.ReactNode}) {
  const ref = useTilt<HTMLDivElement>({max: 6});
  return (
    <div
      ref={ref}
      className="overflow-hidden rounded-xl border border-border bg-card transition-[border-color,box-shadow] duration-300 group-hover:border-primary/60"
    >
      {children}
    </div>
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
