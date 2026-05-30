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
            once: true,
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
    <span ref={ref} className={className}>
      {value}
      {suffix}
    </span>
  );
}
