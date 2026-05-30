import {use} from 'react';
import {setRequestLocale} from 'next-intl/server';
import {Header} from '@/components/sections/header';
import {Hero} from '@/components/sections/hero';
import {About} from '@/components/sections/about';
import {Resume} from '@/components/sections/resume';
import {Portfolio} from '@/components/sections/portfolio';
import {Contact} from '@/components/sections/contact';
import {Footer} from '@/components/sections/footer';

export default function Page({params}: {params: Promise<{locale: string}>}) {
  const {locale} = use(params);
  setRequestLocale(locale);
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Resume />
        <Portfolio />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
