import {useTranslations} from 'next-intl';
import {Section} from '@/components/common/section';
import {SectionHeader} from '@/components/common/section-header';
import {Reveal} from '@/components/common/reveal';
import {DownloadResumeButton} from '@/components/common/download-resume-button';
import {SECTION_IDS, EMAIL, AGE, EXPERIENCE_YEARS} from '@/lib/site';

export function About() {
  const t = useTranslations('about');

  const facts = [
    {label: t('facts.nameLabel'), value: 'Teoman Kirma'},
    {label: t('facts.fromLabel'), value: t('facts.from')},
    {label: t('facts.ageLabel'), value: String(AGE)},
    {label: t('facts.emailLabel'), value: EMAIL},
  ];

  return (
    <Section id={SECTION_IDS.about}>
      <SectionHeader title={t('heading')} />
      <div className="grid gap-12 md:grid-cols-2">
        <Reveal variant="slideRight">
          <h3 className="text-xl font-semibold tracking-tight">{t('whoAmI')}</h3>
          <p className="mt-4 max-w-[60ch] leading-relaxed text-muted-foreground">{t('bodyA')}</p>
          <p className="mt-4 max-w-[60ch] leading-relaxed text-muted-foreground">{t('bodyB')}</p>
          <div className="mt-6">
            <DownloadResumeButton />
          </div>
        </Reveal>

        <Reveal variant="slideLeft">
          <dl className="divide-y divide-border">
            {facts.map((f) => (
              <div key={f.label} className="flex items-center justify-between py-3">
                <dt className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  {f.label}
                </dt>
                <dd className="text-sm">{f.value}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-8 flex gap-10">
            <div>
              <div className="font-mono text-3xl font-bold text-primary">{EXPERIENCE_YEARS}+</div>
              <div className="mt-1 text-xs text-muted-foreground">{t('stats.experienceText')}</div>
            </div>
            <div className="border-l border-border pl-10">
              <div className="font-mono text-3xl font-bold text-primary">{t('stats.projectsNumber')}+</div>
              <div className="mt-1 text-xs text-muted-foreground">{t('stats.projectsLabel')}</div>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
