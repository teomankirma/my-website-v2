import type {ReactNode} from 'react';
import {NextIntlClientProvider, hasLocale} from 'next-intl';
import {setRequestLocale, getTranslations, getMessages} from 'next-intl/server';
import {notFound} from 'next/navigation';
import type {Metadata} from 'next';
import {SITE_URL} from '@/lib/site';
import {routing} from '@/i18n/routing';
import {SiteToaster} from '@/components/common/site-toaster';
import {HtmlLang} from '@/components/common/html-lang';

type Props = {children: ReactNode; params: Promise<{locale: string}>};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export async function generateMetadata({params}: Omit<Props, 'children'>): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'metadata'});
  return {
    metadataBase: new URL(SITE_URL),
    title: t('title'),
    description: t('description'),
    alternates: {canonical: `/${locale}`, languages: {en: '/en', tr: '/tr', 'x-default': '/en'}},
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: `/${locale}`,
      locale: locale === 'tr' ? 'tr_TR' : 'en_US',
      type: 'website',
    },
    twitter: {card: 'summary_large_image'},
    icons: {icon: '/icon.svg'},
  };
}

export default async function LocaleLayout({children, params}: Props) {
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const messages = await getMessages();
  const clientMessages = Object.fromEntries(
    ['navigation', 'story', 'contact', 'validation'].map((key) => [key, messages[key]]),
  );

  return (
    <NextIntlClientProvider messages={clientMessages}>
      <HtmlLang locale={locale} />
      {children}
      <SiteToaster />
    </NextIntlClientProvider>
  );
}
