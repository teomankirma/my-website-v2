import {useTranslations} from 'next-intl';
import {CURRENT_YEAR} from '@/lib/site';

export function Footer() {
  const t = useTranslations();
  return (
    <footer className="border-t border-border py-8">
      <p className="text-center font-mono text-xs text-muted-foreground">
        {t('footer.copyrightLabel')} © {CURRENT_YEAR} {t('header.name')}. {t('footer.copyright')}
      </p>
    </footer>
  );
}
