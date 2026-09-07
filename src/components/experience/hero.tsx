'use client';

import {useCallback, useMemo, useRef, useState} from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import {useTranslations} from 'next-intl';
import {ArrowUpRight, ArrowDown} from 'lucide-react';
import {gsap, useGSAP} from '@/lib/gsap';
import portrait from '@/assets/me.png';
import {useMotion} from './motion-provider';
import {PROJECTS} from '@/lib/projects';
import {STORY_CHAPTERS, SCREEN_IMAGES, getStoryChapter, type StoryMotion} from '@/lib/scroll-story';
import styles from './hero.module.css';

const LaptopScene = dynamic(() => import('./laptop-scene'), {ssr: false});
const FEATURED = ['cirkle', 'jobFlow', 'clueClash'] as const;

export function Hero() {
  const t = useTranslations('story');
  const root = useRef<HTMLDivElement>(null);
  const story = useRef<HTMLElement>(null);
  const invalidate = useRef<(() => void) | null>(null);
  const motion = useMemo<StoryMotion>(() => ({progress: 0, pointerX: 0, pointerY: 0}), []);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [chapter, setChapter] = useState(0);
  const activeChapter = useRef(0);
  const {reduced} = useMotion();
  const motionOff = reduced || failed;
  const screenCopy = useMemo(
    () => ({
      codeLabel: t('codeLabel'),
      screenCaption: t('screenCaption'),
      menu: t('screenMenu'),
      codeMenu: t('codeMenu'),
      safariMenu: t('safariMenu'),
      finderTitle: t('finderTitle'),
      finderSidebar: t('finderSidebar'),
      screenDate: t('screenDate'),
    }),
    [t],
  );
  const onReady = useCallback(() => setReady(true), []);
  const onFailure = useCallback(() => setFailed(true), []);

  useGSAP(
    () => {
      if (motionOff || !story.current) return;
      const mm = gsap.matchMedia();
      mm.add(
        {
          motion: '(prefers-reduced-motion: no-preference)',
          mobile: '(max-width: 767px)',
          desktop: '(min-width: 768px)',
        },
        (context) => {
          if (!context.conditions?.motion) return;
          const mobile = context.conditions.mobile;
          const tl = gsap.timeline({
            defaults: {ease: 'none'},
            scrollTrigger: {
              trigger: story.current,
              start: 'top top',
              end: 'bottom bottom',
              scrub: 0.65,
              invalidateOnRefresh: true,
            },
            onUpdate: () => {
              invalidate.current?.();
              story.current?.setAttribute('data-scene-progress', motion.progress.toFixed(3));
              const next = getStoryChapter(motion.progress);
              if (activeChapter.current !== next) {
                activeChapter.current = next;
                setChapter(next);
              }
            },
          });
          tl.to(motion, {progress: 1, duration: 1}, 0)
            .to('[data-stage]', {backgroundColor: '#101214', duration: 0.14}, 0.18)
            .to('[data-stage]', {backgroundColor: '#0c0e10', duration: 0.1}, 0.37)
            .to('[data-stage]', {backgroundColor: '#131517', duration: 0.09}, 0.53)
            .to('[data-stage]', {backgroundColor: '#0d0f11', duration: 0.09}, 0.665)
            .to('[data-stage]', {backgroundColor: '#151719', duration: 0.09}, 0.87)
            .to('[data-studio-light]', {rotation: 35, scale: 1.2, duration: 0.78}, 0.09)
            .to('[data-studio-light]', {opacity: 0, duration: 0.08}, 0.87)
            .to('[data-intro]', {autoAlpha: 0, y: -35, duration: 0.09}, 0.08)
            .fromTo(
              '[data-caption="code"]',
              {autoAlpha: 0, y: 18},
              {autoAlpha: 1, y: 0, duration: 0.045},
              0.21,
            )
            .to('[data-caption="code"]', {autoAlpha: 0, y: -14, duration: 0.025}, 0.345)
            .fromTo(
              '[data-caption="cirkle"]',
              {autoAlpha: 0, y: 16},
              {autoAlpha: 1, y: 0, duration: 0.035},
              0.38,
            )
            .to('[data-caption="cirkle"]', {autoAlpha: 0, y: -14, duration: 0.025}, 0.515)
            .fromTo(
              '[data-caption="jobFlow"]',
              {autoAlpha: 0, y: 16},
              {autoAlpha: 1, y: 0, duration: 0.035},
              0.545,
            )
            .to('[data-caption="jobFlow"]', {autoAlpha: 0, y: -14, duration: 0.02}, 0.65)
            .fromTo(
              '[data-caption="clueClash"]',
              {autoAlpha: 0, y: 16},
              {autoAlpha: 1, y: 0, duration: 0.025},
              0.68,
            )
            .to('[data-caption="clueClash"]', {autoAlpha: 0, y: -14, duration: 0.025}, 0.765)
            .to('[data-ground]', {opacity: 0, duration: 0.1}, 0.82)
            .to('[data-laptop-stage]', {opacity: 0, duration: 0.035}, 0.93);

          const shardTargets = mobile
            ? [
                {x: -0.23, y: -0.1, rotate: -12},
                {x: 0.23, y: -0.04, rotate: 9},
                {x: 0, y: 0.19, rotate: -4},
              ]
            : [
                {x: -0.29, y: -0.12, rotate: -9},
                {x: 0.28, y: -0.18, rotate: 8},
                {x: 0.19, y: 0.24, rotate: -5},
              ];
          shardTargets.forEach((position, index) => {
            const selector = `[data-shard="${index}"]`;
            tl.fromTo(
              selector,
              {autoAlpha: 0, scale: 0.24, x: 0, y: -20, rotation: 0},
              {
                autoAlpha: 1,
                scale: 1,
                x: () => position.x * window.innerWidth,
                y: () => position.y * window.innerHeight,
                rotation: position.rotate,
                duration: 0.095,
                ease: 'power2.out',
              },
              0.765 + index * 0.012,
            ).to(
              selector,
              {
                autoAlpha: 0,
                scale: 0.91,
                y: () => position.y * window.innerHeight - 40,
                duration: 0.025,
              },
              0.87 + index * 0.009,
            );
          });
          tl.fromTo(
            '[data-reveal-line]',
            {autoAlpha: 0, scaleX: 0.14, y: 70},
            {autoAlpha: 1, scaleX: 1, y: 35, duration: 0.035},
            0.875,
          )
            .to(
              '[data-reveal-line]',
              {y: mobile ? -95 : -80, duration: 0.05, ease: 'power2.inOut'},
              0.91,
            )
            .fromTo(
              '[data-signature]',
              {autoAlpha: 1, clipPath: 'inset(100% 0% 0% 0%)', y: 18},
              {clipPath: 'inset(0% 0% 0% 0%)', y: 0, duration: 0.05, ease: 'power2.inOut'},
              0.91,
            )
            .to('[data-reveal-line]', {autoAlpha: 0, duration: 0.012}, 0.958)
            .fromTo(
              '[data-signature-detail]',
              {autoAlpha: 0, y: 12},
              {autoAlpha: 1, y: 0, duration: 0.025},
              0.945,
            );

          const element = story.current!;
          const pointer = (event: PointerEvent) => {
            if (document.hidden || event.pointerType !== 'mouse') return;
            motion.pointerX = event.clientX / window.innerWidth - 0.5;
            motion.pointerY = event.clientY / window.innerHeight - 0.5;
            invalidate.current?.();
          };
          const leave = () => {
            motion.pointerX = 0;
            motion.pointerY = 0;
            invalidate.current?.();
          };
          element.addEventListener('pointermove', pointer, {passive: true});
          element.addEventListener('pointerleave', leave);
          return () => {
            element.removeEventListener('pointermove', pointer);
            element.removeEventListener('pointerleave', leave);
            motion.progress = 0;
          };
        },
      );
      return () => mm.revert();
    },
    {scope: root, dependencies: [motionOff, motion], revertOnUpdate: true},
  );

  function goTo(progress: number) {
    if (!story.current) return;
    const top = story.current.getBoundingClientRect().top + window.scrollY;
    const travel = story.current.offsetHeight - window.innerHeight;
    window.scrollTo({
      top: top + Math.max(0, travel) * progress,
      behavior: motionOff ? 'instant' : 'smooth',
    });
  }

  return (
    <div
      ref={root}
      className={styles.heroRoot}
      data-motion={motionOff ? 'off' : 'on'}
      data-ready={ready}
    >
      <noscript>
        <style>{`[data-scroll-story]{height:100svh!important}[data-chapter-navigation]{display:none!important}`}</style>
      </noscript>
      <section
        ref={story}
        id="home"
        className={styles.story}
        data-scroll-story
        aria-label={t('storyLabel')}
      >
        <div className={styles.stage} data-stage>
          <div className={styles.studioLight} data-studio-light aria-hidden="true" />
          <div className={styles.ground} data-ground aria-hidden="true" />
          <div className={styles.poster} aria-hidden="true">
            <picture>
              <source media="(max-width: 767px)" srcSet="/experience/laptop-poster-mobile.webp" />
              <Image
                src="/experience/laptop-poster.webp"
                alt=""
                fill
                priority
                unoptimized
                className={styles.posterImage}
              />
            </picture>
          </div>
          {!motionOff ? (
            <div className={styles.canvas} aria-hidden="true">
              <div data-laptop-stage className={styles.laptopStage}>
                <LaptopScene
                  motion={motion}
                  invalidateRef={invalidate}
                  copy={screenCopy}
                  onReady={onReady}
                  onFailure={onFailure}
                />
              </div>
            </div>
          ) : null}

          <div data-intro className={styles.intro}>
            <p className={styles.role}>{t('role')}</p>
            <h1>
              {t('introLineA')}
              <br />
              <span>{t('introLineB')}</span>
            </h1>
            <p className={styles.introDescription}>{t('introDescription')}</p>
            <div className={styles.explore}>
              <span>
                <ArrowDown size={14} />
                {t('scrollHint')}
              </span>
              <a href="#portfolio">
                {t('skipShort')} <ArrowUpRight size={13} />
              </a>
            </div>
          </div>
          <p className="sr-only">{t('sequenceDescription')}</p>

          <div className={styles.captions} aria-hidden="true">
            <div data-caption="code" className={styles.caption}>
              <p className={styles.captionTag}>{t('codeTag')}</p>
              <h2>{t('codeHeading')}</h2>
              <p>{t('codeDescription')}</p>
            </div>
            {FEATURED.map((key) => (
              <div key={key} data-caption={key} className={styles.caption}>
                <p className={styles.captionTag}>{t(`projects.${key}.category`)}</p>
                <h2>{PROJECTS.find((project) => project.key === key)!.title}</h2>
                <p>{t(`projects.${key}.short`)}</p>
              </div>
            ))}
          </div>

          <div className={styles.shards} aria-hidden="true">
            {SCREEN_IMAGES.map((src, index) => (
              <div data-shard={index} key={src} className={styles.shard}>
                <Image src={src} alt="" fill sizes="(max-width: 767px) 40vw, 25vw" />
              </div>
            ))}
          </div>
          <div className={styles.signature} aria-hidden="true">
            <div className={styles.revealLine} data-reveal-line />
            <div className={styles.signatureComposition} data-signature>
              <div className={styles.signaturePortrait}>
                <Image src={portrait} alt="" fill sizes="(max-width: 767px) 42vw, 26vw" />
              </div>
              <div>
                <p className={styles.signatureEyebrow}>{t('makerLabel')}</p>
                <h2 className={styles.signatureName}>
                  {t('nameFirst')}
                  <br />
                  {t('nameLast')}
                  <span className={styles.signatureDot}>.</span>
                </h2>
                <p className={styles.signatureDetail} data-signature-detail>
                  {t('signatureDescription')}
                </p>
              </div>
            </div>
          </div>

          <nav
            data-chapter-navigation
            className={styles.chapterNav}
            aria-label={t('chapterNavigation')}
          >
            {STORY_CHAPTERS.map((item, index) => (
              <button
                type="button"
                key={item.key}
                onClick={() => goTo(item.progress)}
                aria-current={chapter === index ? 'step' : undefined}
              >
                <span className={styles.chapterDot} />
                {t(`chapters.${item.key}`)}
              </button>
            ))}
          </nav>
        </div>
      </section>
    </div>
  );
}
