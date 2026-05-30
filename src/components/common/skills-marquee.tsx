'use client';

import {useRef} from 'react';
import {gsap, useGSAP} from '@/lib/gsap';
import {SKILLS} from '@/lib/site';

export function SkillsMarquee() {
  const ref = useRef<HTMLDivElement>(null);
  const tween = useRef<gsap.core.Tween | null>(null);

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

  const items = [...SKILLS, ...SKILLS];

  return (
    <div
      ref={ref}
      className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]"
      onMouseEnter={() => tween.current?.pause()}
      onMouseLeave={() => tween.current?.resume()}
    >
      <div className="marquee-track flex w-max gap-3">
        {/* Skill names render as text labels, so no per-skill Tooltip (spec §9.4 deviation, intentional). */}
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
