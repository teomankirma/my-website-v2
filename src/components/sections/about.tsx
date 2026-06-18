import {useTranslations} from 'next-intl';
import {Section} from '@/components/common/section';
import {SectionHeader} from '@/components/common/section-header';
import {Reveal} from '@/components/common/reveal';
import {DownloadResumeButton} from '@/components/common/download-resume-button';
import {SECTION_IDS, EMAIL, AGE, EXPERIENCE_YEARS} from '@/lib/site';
import {Counter} from '@/components/common/counter';

export function About() {
  const t = useTranslations('about');

  const facts = [
    {label: t('facts.nameLabel'), value: t('facts.name')},
    {label: t('facts.fromLabel'), value: t('facts.from')},
    {label: t('facts.ageLabel'), value: String(AGE)},
    {label: t('facts.emailLabel'), value: EMAIL},
  ];

  return (
    <Section id={SECTION_IDS.about}>
      <SectionHeader index="01" title={t('heading')} />
      <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
        <Reveal variant="slideRight">
          <h3 className="max-w-[18ch] text-2xl font-semibold tracking-tight md:text-3xl">
            {t('whoAmI')}
          </h3>
          <p className="mt-6 max-w-[58ch] leading-relaxed text-muted-foreground">{t('bodyA')}</p>
          <p className="mt-4 max-w-[58ch] leading-relaxed text-muted-foreground">{t('bodyB')}</p>
          <div className="mt-8">
            <DownloadResumeButton />
          </div>
        </Reveal>

        <Reveal variant="slideLeft">
          <dl>
            {facts.map((f) => (
              <div
                key={f.label}
                className="flex items-center justify-between border-t border-border py-4 first:border-t-0 md:first:border-t"
              >
                <dt className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
                  {f.label}
                </dt>
                <dd className="text-sm font-medium">{f.value}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-10 grid grid-cols-2 gap-px overflow-hidden border border-border bg-border">
            <div className="bg-background p-6">
              <div className="font-mono text-4xl font-bold tracking-tight text-primary tnum">
                <Counter value={EXPERIENCE_YEARS} suffix="+" />
              </div>
              <div className="mt-2 text-xs text-muted-foreground">{t('stats.experienceText')}</div>
            </div>
            <div className="bg-background p-6">
              <div className="font-mono text-4xl font-bold tracking-tight text-primary tnum">
                <Counter value={Number(t('stats.projectsNumber'))} suffix="+" />
              </div>
              <div className="mt-2 text-xs text-muted-foreground">{t('stats.projectsLabel')}</div>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
