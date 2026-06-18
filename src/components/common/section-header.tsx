'use client';

import {useRef} from 'react';
import {gsap, SplitText, useGSAP} from '@/lib/gsap';
import {cn} from '@/lib/utils';

export function SectionHeader({
  index,
  title,
  description,
  className,
}: {
  index?: string;
  title: string;
  description?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = ref.current!;
      const h = root.querySelector('h2')!;
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const split = new SplitText(h, {type: 'words'});
        const tl = gsap.timeline({
          scrollTrigger: {trigger: root, start: 'top 85%', once: true},
        });
        tl.from(root.querySelector('.sh-rule'), {
          scaleX: 0,
          transformOrigin: 'left',
          duration: 0.7,
          ease: 'power3.inOut',
        })
          .from(
            split.words,
            {yPercent: 110, opacity: 0, duration: 0.6, ease: 'power3.out', stagger: 0.08},
            0.15,
          )
          .from(
            root.querySelector('.sh-index'),
            {opacity: 0, duration: 0.4},
            0.2,
          );
        return () => split.revert();
      });
      return () => mm.revert();
    },
    {scope: ref},
  );

  return (
    <div ref={ref} className={cn('mb-12 md:mb-16', className)}>
      <div className="sh-rule h-px w-full bg-foreground" />
      <div className="mt-4 flex items-baseline gap-4 md:gap-6">
        {index && (
          <span className="sh-index font-mono text-sm font-medium text-primary tnum">
            {index}
          </span>
        )}
        <h2 className="overflow-hidden text-balance text-4xl font-bold tracking-tighter md:text-6xl">
          {title}
        </h2>
      </div>
      {description && (
        <p className="mt-5 max-w-[52ch] text-base leading-relaxed text-muted-foreground md:ml-[calc(1.75rem+1.5rem)]">
          {description}
        </p>
      )}
    </div>
  );
}
