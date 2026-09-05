'use client';

import {
  createContext,
  useContext,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from 'react';
import {gsap, useGSAP} from '@/lib/gsap';

const MotionContext = createContext({reduced: false, system: false, toggle: () => {}});
const STORAGE_KEY = 'portfolio-reduced-motion';
const serverSnapshot = () => false;
function subscribe(callback: () => void) {
  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  media.addEventListener('change', callback);
  window.addEventListener('storage', callback);
  window.addEventListener('portfolio-motion', callback);
  return () => {
    media.removeEventListener('change', callback);
    window.removeEventListener('storage', callback);
    window.removeEventListener('portfolio-motion', callback);
  };
}
const systemSnapshot = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const manualSnapshot = () => {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
};
export const useMotion = () => useContext(MotionContext);
export function MotionProvider({children}: {children: ReactNode}) {
  const root = useRef<HTMLDivElement>(null);
  const system = useSyncExternalStore(subscribe, systemSnapshot, serverSnapshot);
  const stored = useSyncExternalStore(subscribe, manualSnapshot, serverSnapshot);
  const [sessionPreference, setSessionPreference] = useState<boolean | undefined>();
  const manual = sessionPreference ?? stored;
  const reduced = system || manual;
  const toggle = () => {
    try {
      localStorage.setItem(STORAGE_KEY, String(!manual));
      setSessionPreference(undefined);
    } catch {
      setSessionPreference(!manual);
    }
    window.dispatchEvent(new Event('portfolio-motion'));
  };
  useGSAP(
    () => {
      if (reduced) return;
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        root.current?.querySelectorAll<HTMLElement>('[data-reveal]').forEach((element) => {
          gsap.from(element, {
            y: 38,
            opacity: 0,
            duration: 0.85,
            ease: 'power3.out',
            scrollTrigger: {trigger: element, start: 'top 92%', once: true},
          });
        });
        root.current?.querySelectorAll<HTMLElement>('[data-parallax]').forEach((element) => {
          gsap.fromTo(
            element,
            {yPercent: -4, rotation: -3},
            {
              yPercent: 4,
              rotation: 3,
              ease: 'none',
              scrollTrigger: {
                trigger: element.parentElement,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
              },
            },
          );
        });
        root.current?.querySelectorAll<HTMLElement>('[data-orbit]').forEach((element) => {
          gsap.to(element, {
            rotation: 100,
            ease: 'none',
            scrollTrigger: {
              trigger: element.parentElement,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          });
        });
        gsap.fromTo(
          '[data-timeline-line]',
          {scaleY: 0},
          {
            scaleY: 1,
            transformOrigin: 'top',
            ease: 'none',
            scrollTrigger: {
              trigger: '[data-timeline]',
              start: 'top 75%',
              end: 'bottom 75%',
              scrub: true,
            },
          },
        );
      });
      return () => mm.revert();
    },
    {scope: root, dependencies: [reduced], revertOnUpdate: true},
  );
  return (
    <MotionContext value={{reduced, system, toggle}}>
      <div ref={root} className="site" data-motion={reduced ? 'off' : 'on'}>
        {children}
      </div>
    </MotionContext>
  );
}
