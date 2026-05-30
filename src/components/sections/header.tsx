'use client';

import {useRef, useState} from 'react';
import {useTranslations} from 'next-intl';
import {Menu} from 'lucide-react';
import {ScrollTrigger, useGSAP} from '@/lib/gsap';
import {Button} from '@/components/ui/button';
import {Sheet, SheetContent, SheetTrigger, SheetTitle} from '@/components/ui/sheet';
import {ThemeSwitcher} from '@/components/common/theme-switcher';
import {LanguageSwitcher} from '@/components/common/language-switcher';
import {SECTION_IDS} from '@/lib/site';

const NAV = [
  {id: SECTION_IDS.home, key: 'home'},
  {id: SECTION_IDS.about, key: 'about'},
  {id: SECTION_IDS.resume, key: 'resume'},
  {id: SECTION_IDS.portfolio, key: 'portfolio'},
  {id: SECTION_IDS.contact, key: 'contact'},
] as const;

export function Header() {
  const t = useTranslations('header');
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const st = ScrollTrigger.create({
      start: 8,
      onUpdate: (self) =>
        headerRef.current?.setAttribute('data-scrolled', String(self.scroll() > 8)),
    });
    return () => st.kill();
  });

  return (
    <header ref={headerRef} className="sticky top-0 z-50 border-b border-border/0 bg-background/70 backdrop-blur-md transition-colors data-[scrolled=true]:border-border">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:px-8">
        <a href={`#${SECTION_IDS.home}`} className="font-mono text-sm font-semibold">
          <span className="text-primary">●</span> {t('name')}
        </a>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {t(`menu.${item.key}`)}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <LanguageSwitcher />
          <ThemeSwitcher />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu strokeWidth={1.75} />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <SheetTitle className="font-mono text-primary">{t('name')}</SheetTitle>
              <nav className="mt-6 flex flex-col gap-1">
                {NAV.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={() => setOpen(false)}
                    className="rounded-md px-3 py-2 text-base text-muted-foreground hover:bg-accent hover:text-foreground"
                  >
                    {t(`menu.${item.key}`)}
                  </a>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
