import {useTranslations} from 'next-intl';
import {ArrowUpRight, ArrowUp} from 'lucide-react';
import {CURRENT_YEAR, SOCIAL_LINKS} from '@/lib/site';
export function Footer() {
  const t = useTranslations('footer');
  return (
    <footer className="site-footer">
      <a href="#home" className="footer-wordmark">
        {t('name')}
        <span>.</span>
      </a>
      <div className="footer-socials">
        <a href={SOCIAL_LINKS.github} target="_blank" rel="noreferrer">
          GitHub <ArrowUpRight size={13} />
        </a>
        <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noreferrer">
          LinkedIn <ArrowUpRight size={13} />
        </a>
        <a href={SOCIAL_LINKS.x} target="_blank" rel="noreferrer">
          X <ArrowUpRight size={13} />
        </a>
      </div>
      <p>
        © {CURRENT_YEAR} · {t('copyright')}
      </p>
      <a className="back-top" href="#home">
        {t('backTop')} <ArrowUp size={16} />
      </a>
    </footer>
  );
}
