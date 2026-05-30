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
