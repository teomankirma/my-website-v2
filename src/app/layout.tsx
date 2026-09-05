import type {ReactNode} from 'react';
import {getLocale} from 'next-intl/server';
import {GeistSans} from 'geist/font/sans';
import {GeistMono} from 'geist/font/mono';
import '@/styles/globals.css';

export default async function RootLayout({children}: {children: ReactNode}) {
  const locale = await getLocale();

  return (
    <html lang={locale} className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
