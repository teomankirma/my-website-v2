import {useTranslations} from 'next-intl';
import {ArrowUp} from 'lucide-react';
import {CURRENT_YEAR, SECTION_IDS, SOCIAL_LINKS, EMAIL} from '@/lib/site';

export function Footer() {
  const t = useTranslations();

  const nav = [
    {id: SECTION_IDS.about, key: 'about'},
    {id: SECTION_IDS.resume, key: 'resume'},
    {id: SECTION_IDS.portfolio, key: 'portfolio'},
    {id: SECTION_IDS.contact, key: 'contact'},
  ] as const;

  const socials = [
    {href: SOCIAL_LINKS.github, label: 'GitHub'},
    {href: SOCIAL_LINKS.linkedin, label: 'LinkedIn'},
    {href: SOCIAL_LINKS.x, label: 'X'},
  ];

  return (
    <footer className="border-t border-foreground">
      <div className="mx-auto max-w-6xl px-5 py-14 md:px-8">
        <div className="grid gap-10 md:grid-cols-[1fr_auto] md:items-start">
          <div>
            <a
              href={`#${SECTION_IDS.home}`}
              className="text-4xl font-bold tracking-tighter md:text-6xl"
            >
              {t('header.name')}
              <span className="text-primary">.</span>
            </a>
            <a
              href={`mailto:${EMAIL}`}
              className="mt-4 block w-fit font-mono text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              {EMAIL}
            </a>
          </div>

          <div className="flex gap-12">
            <nav className="flex flex-col gap-2.5">
              {nav.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {t(`header.menu.${item.key}`)}
                </a>
              ))}
            </nav>
            <div className="flex flex-col gap-2.5">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-xs text-muted-foreground">
            © {CURRENT_YEAR} {t('header.name')}. {t('footer.copyright')}
          </p>
          <a
            href={`#${SECTION_IDS.home}`}
            className="group inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowUp strokeWidth={1.75} className="size-3.5 transition-transform group-hover:-translate-y-0.5" />
            Top
          </a>
        </div>
      </div>
    </footer>
  );
}
