'use client';

import {useRef} from 'react';
import {gsap, useGSAP} from '@/lib/gsap';

export function useTilt<T extends HTMLElement>({max = 6}: {max?: number} = {}) {
  const ref = useRef<T>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (!window.matchMedia('(pointer: fine)').matches) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      gsap.set(el, {transformPerspective: 800, transformOrigin: 'center'});
      const rotX = gsap.quickTo(el, 'rotationX', {duration: 0.4, ease: 'power3'});
      const rotY = gsap.quickTo(el, 'rotationY', {duration: 0.4, ease: 'power3'});

      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5; // -0.5..0.5
        const py = (e.clientY - r.top) / r.height - 0.5;
        rotY(px * max * 2);
        rotX(-py * max * 2);
      };
      const leave = () => {
        rotX(0);
        rotY(0);
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
