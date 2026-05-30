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
            once: true,
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
