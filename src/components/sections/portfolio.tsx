'use client';

import {useRef, useState} from 'react';
import Image from 'next/image';
import {useTranslations} from 'next-intl';
import {ArrowUpRight, ExternalLink} from 'lucide-react';
import {gsap, useGSAP} from '@/lib/gsap';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription,
} from '@/components/ui/dialog';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {SectionHeader} from '@/components/common/section-header';
import {PROJECTS} from '@/lib/projects';
import {SECTION_IDS} from '@/lib/site';

type QuickTo = ReturnType<typeof gsap.quickTo>;

export function Portfolio() {
  const t = useTranslations('portfolio');
  const wrap = useRef<HTMLDivElement>(null);
  const preview = useRef<HTMLDivElement>(null);
  const xTo = useRef<QuickTo | null>(null);
  const yTo = useRef<QuickTo | null>(null);
  const [active, setActive] = useState<number | null>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        '(min-width: 768px) and (hover: hover) and (prefers-reduced-motion: no-preference)',
        () => {
          gsap.set(preview.current, {xPercent: -50, yPercent: -50, opacity: 0, scale: 0.85});
          xTo.current = gsap.quickTo(preview.current, 'x', {duration: 0.55, ease: 'power3'});
          yTo.current = gsap.quickTo(preview.current, 'y', {duration: 0.55, ease: 'power3'});
        },
      );
      return () => mm.revert();
    },
    {scope: wrap},
  );

  function handleMove(e: React.MouseEvent) {
    xTo.current?.(e.clientX);
    yTo.current?.(e.clientY);
  }

  function show(i: number) {
    setActive(i);
    gsap.to(preview.current, {opacity: 1, scale: 1, duration: 0.3, ease: 'power3.out'});
  }

  function hide() {
    setActive(null);
    gsap.to(preview.current, {opacity: 0, scale: 0.85, duration: 0.3, ease: 'power3.out'});
  }

  return (
    <section id={SECTION_IDS.portfolio} className="scroll-mt-20 py-20 md:py-28">
      <div ref={wrap} className="mx-auto w-full max-w-6xl px-5 md:px-8">
        <SectionHeader index="03" title={t('heading')} description={t('subtitle')} />

        {/* floating cursor preview (desktop, hover devices) */}
        <div
          ref={preview}
          aria-hidden
          className="pointer-events-none fixed left-0 top-0 z-40 hidden aspect-[16/10] w-[24rem] overflow-hidden border border-border bg-card shadow-2xl will-change-transform md:block"
        >
          {active !== null && (
            <Image
              key={PROJECTS[active].key}
              src={PROJECTS[active].image}
              alt=""
              placeholder="blur"
              className="size-full object-cover"
            />
          )}
        </div>

        <div onMouseMove={handleMove} onMouseLeave={hide}>
          {PROJECTS.map((p, i) => {
            const year = t(`items.${p.key}.date`).trim().split(' ').pop();
            return (
              <Dialog key={p.key}>
                <DialogTrigger asChild>
                  <button
                    onMouseEnter={() => show(i)}
                    data-active={active === i}
                    className="group relative block w-full border-t border-border text-left transition-colors last:border-b data-[active=true]:text-foreground md:data-[active=true]:[&_.row-pad]:px-4"
                  >
                    <span className="row-pad grid grid-cols-[auto_1fr_auto] items-center gap-4 py-6 transition-[padding,background-color] duration-300 group-hover:bg-secondary/40 md:gap-8 md:py-7">
                      <span className="font-mono text-sm text-muted-foreground tnum transition-colors group-hover:text-primary">
                        {String(i + 1).padStart(2, '0')}
                      </span>

                      <span className="min-w-0">
                        <span className="flex items-center gap-2">
                          <span className="truncate text-2xl font-semibold tracking-tight md:text-3xl">
                            {p.title}
                          </span>
                          <ArrowUpRight
                            strokeWidth={1.75}
                            className="size-5 shrink-0 text-muted-foreground opacity-0 -translate-x-1 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-hover:text-primary"
                          />
                        </span>
                        <span className="mt-2 flex flex-wrap gap-1.5">
                          {p.technologies.split(',').slice(0, 4).map((tech) => (
                            <Badge key={tech} variant="secondary" className="font-mono text-[11px] font-normal">
                              {tech.trim()}
                            </Badge>
                          ))}
                        </span>
                      </span>

                      <span className="self-start font-mono text-sm text-muted-foreground tnum md:self-center">
                        {year}
                      </span>
                    </span>

                    {/* mobile thumbnail */}
                    <span className="mb-6 block overflow-hidden border border-border md:hidden">
                      <Image
                        src={p.image}
                        alt={p.title}
                        placeholder="blur"
                        className="aspect-[16/10] w-full object-cover"
                      />
                    </span>
                  </button>
                </DialogTrigger>

                <DialogContent className="max-h-[90vh] w-[92vw] overflow-y-auto sm:max-w-3xl sm:p-6 md:max-w-4xl">
                  <div className="overflow-hidden border border-border">
                    <Image src={p.image} alt={p.title} placeholder="blur" className="h-auto w-full object-cover" />
                  </div>
                  <DialogHeader>
                    <DialogTitle className="text-2xl tracking-tight">{p.title}</DialogTitle>
                    <DialogDescription>{t(`items.${p.key}.description`)}</DialogDescription>
                  </DialogHeader>
                  <dl className="text-sm">
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
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Row({label, value}: {label: string; value: string}) {
  return (
    <div className="flex justify-between gap-6 border-b border-border py-2.5 last:border-0">
      <dt className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">{label}</dt>
      <dd className="text-right">{value}</dd>
    </div>
  );
}
