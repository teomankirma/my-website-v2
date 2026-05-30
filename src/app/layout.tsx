import type {ReactNode} from 'react';
import {GeistSans} from 'geist/font/sans';
import {GeistMono} from 'geist/font/mono';
import '@/styles/globals.css';

export default function RootLayout({children}: {children: ReactNode}) {
  return (
    <html
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
