import {setRequestLocale} from 'next-intl/server';
import {MotionProvider} from '@/components/experience/motion-provider';
import {Header} from '@/components/sections/header';
import {Hero} from '@/components/experience/hero';
import {About} from '@/components/sections/about';
import {Resume} from '@/components/sections/resume';
import {Portfolio} from '@/components/sections/portfolio';
import {Contact} from '@/components/sections/contact';
import {Footer} from '@/components/sections/footer';
export default async function Page({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  return (
    <MotionProvider>
      <Header />
      <main>
        <Hero />
        <Portfolio />
        <About />
        <Resume />
        <Contact />
      </main>
      <Footer />
    </MotionProvider>
  );
}
