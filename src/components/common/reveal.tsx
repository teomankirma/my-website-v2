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
