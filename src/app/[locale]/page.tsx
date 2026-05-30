import {use} from 'react';
import {setRequestLocale} from 'next-intl/server';
import {useTranslations} from 'next-intl';

export default function Page({params}: {params: Promise<{locale: string}>}) {
  const {locale} = use(params);
  setRequestLocale(locale);
  const t = useTranslations('hero');
  return (
    <main className="min-h-[100dvh] grid place-items-center">
      <div className="text-center">
        <p className="font-mono text-primary">{t('prompt')}</p>
        <h1 className="text-4xl font-bold tracking-tighter">{t('name')}</h1>
        <p className="text-muted-foreground">{t('role')}</p>
      </div>
    </main>
  );
}
