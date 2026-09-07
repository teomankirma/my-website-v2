'use client';
import {useEffect, useState} from 'react';
import {useLocale, useTranslations} from 'next-intl';
import {Menu, X, ArrowUpRight} from 'lucide-react';
import {useMotion} from '@/components/experience/motion-provider';

const NAV = ['portfolio', 'about', 'resume', 'contact'] as const;
export function Header() {
  const t = useTranslations('navigation');
  const locale = useLocale();
  const {reduced, system, toggle} = useMotion();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        document.getElementById('menu-toggle')?.focus();
      }
    };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [open]);
  return (
    <>
      <a className="skip-link" href="#portfolio">
        {t('skip')}
      </a>
      <header className="site-header">
        <a className="wordmark" href="#home" onClick={() => setOpen(false)}>
          {t('name')}
          <span>.</span>
        </a>
        <nav id="site-navigation" className="site-nav" data-open={open} aria-label={t('label')}>
          {NAV.map((key) => (
            <a key={key} href={`#${key}`} onClick={() => setOpen(false)}>
              {t(key)}
              {key === 'contact' ? <ArrowUpRight size={13} /> : null}
            </a>
          ))}
        </nav>
        <div className="header-controls">
          <a
            href={`/${locale === 'en' ? 'tr' : 'en'}`}
            hrefLang={locale === 'en' ? 'tr' : 'en'}
            aria-label={t('language')}
          >
            {locale === 'en' ? 'TR' : 'EN'}
          </a>
          <button
            className="motion-toggle"
            type="button"
            role="switch"
            aria-checked={!reduced}
            aria-label={t('animations')}
            aria-describedby={system ? 'system-motion-note' : undefined}
            disabled={system}
            onClick={toggle}
            title={system ? t('systemMotion') : t('animations')}
          >
            <span className="motion-track" aria-hidden="true">
              <span />
            </span>
            <span className="motion-label">{t('animations')}</span>
            <span className="motion-state" aria-hidden="true">
              {t(reduced ? 'motionOff' : 'motionOn')}
            </span>
          </button>
          {system ? (
            <span id="system-motion-note" className="sr-only">
              {t('systemMotion')}
            </span>
          ) : null}
          <button
            id="menu-toggle"
            className="menu-toggle"
            type="button"
            aria-label={open ? t('closeMenu') : t('openMenu')}
            aria-expanded={open}
            aria-controls="site-navigation"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>
    </>
  );
}
