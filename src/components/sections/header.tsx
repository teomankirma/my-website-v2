'use client';

import {useRef, useState} from 'react';
import {useTranslations} from 'next-intl';
import {Menu} from 'lucide-react';
import {ScrollTrigger, useGSAP} from '@/lib/gsap';
import {Button} from '@/components/ui/button';
import {Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription} from '@/components/ui/sheet';
import {ThemeSwitcher} from '@/components/common/theme-switcher';
import {LanguageSwitcher} from '@/components/common/language-switcher';
import {SECTION_IDS} from '@/lib/site';

const NAV = [
  {id: SECTION_IDS.home, key: 'home', n: '00'},
  {id: SECTION_IDS.about, key: 'about', n: '01'},
  {id: SECTION_IDS.resume, key: 'resume', n: '02'},
  {id: SECTION_IDS.portfolio, key: 'portfolio', n: '03'},
  {id: SECTION_IDS.contact, key: 'contact', n: '04'},
] as const;

export function Header() {
  const t = useTranslations('header');
  const ta11y = useTranslations('a11y');
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

  const [activeId, setActiveId] = useState<string>(SECTION_IDS.home);

  useGSAP(() => {
    const triggers = NAV.map((item) =>
      ScrollTrigger.create({
        trigger: `#${item.id}`,
        start: 'top center',
        end: 'bottom center',
        onToggle: (self) => {
          if (self.isActive) setActiveId(item.id);
        },
      }),
    );
    return () => triggers.forEach((t) => t.kill());
  });

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 border-b border-transparent bg-background/80 backdrop-blur-md transition-colors duration-300 data-[scrolled=true]:border-border"
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:px-8">
        <a
          href={`#${SECTION_IDS.home}`}
          className="group flex items-center gap-2.5 text-sm font-semibold tracking-tight"
        >
          <span className="size-2.5 bg-primary transition-transform duration-300 group-hover:rotate-45" />
          {t('name')}
        </a>

        <nav className="hidden items-center gap-7 md:flex">
          {NAV.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              data-active={activeId === item.id}
              className="group relative flex items-center gap-1.5 py-1 text-sm text-muted-foreground transition-colors hover:text-foreground data-[active=true]:text-foreground"
            >
              <span className="font-mono text-[10px] text-muted-foreground/60 tnum transition-colors group-hover:text-primary group-data-[active=true]:text-primary">
                {item.n}
              </span>
              {t(`menu.${item.key}`)}
              <span className="pointer-events-none absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100 group-data-[active=true]:scale-x-100" />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <LanguageSwitcher />
          <ThemeSwitcher />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" aria-label={ta11y('openMenu')}>
                <Menu strokeWidth={1.75} />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetTitle className="flex items-center gap-2.5 text-sm font-semibold tracking-tight">
                <span className="size-2.5 bg-primary" />
                {t('name')}
              </SheetTitle>
              <SheetDescription className="sr-only">
                {ta11y('siteNavigation')}
              </SheetDescription>
              <nav className="mt-4 flex flex-col">
                {NAV.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={() => setOpen(false)}
                    className="flex items-baseline gap-3 border-t border-border py-4 text-lg font-medium tracking-tight transition-colors last:border-b hover:text-primary"
                  >
                    <span className="font-mono text-xs text-muted-foreground tnum">{item.n}</span>
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
