import Image from 'next/image';
import {useTranslations} from 'next-intl';
import {Section} from '@/components/common/section';
import {SectionHeader} from '@/components/common/section-header';
import {Reveal} from '@/components/common/reveal';
import {SkillsMarquee} from '@/components/common/skills-marquee';
import {SECTION_IDS, GPA} from '@/lib/site';
import school from '@/assets/nisantasi-university.png';
import company from '@/assets/bytesandpixels.jpeg';

export function Resume() {
  const t = useTranslations('resume');

  const entries = [
    {
      kind: t('expTitle'),
      logo: company,
      title: t('expRole'),
      subtitle: t('companyName'),
      meta: t('expLocation'),
      dates: t('expDates'),
      extra: null as string | null,
    },
    {
      kind: t('eduTitle'),
      logo: school,
      title: t('schoolName'),
      subtitle: t('degree'),
      meta: null,
      dates: t('eduYears'),
      extra: `${t('gpaLabel')} ${GPA}`,
    },
  ];

  return (
    <Section id={SECTION_IDS.resume}>
      <SectionHeader index="02" title={t('heading')} />

      <Reveal stagger={0.12}>
        {entries.map((e) => (
          <div
            key={e.kind}
            className="group grid grid-cols-[auto_1fr] items-start gap-x-5 gap-y-3 border-t border-border py-8 last:border-b md:grid-cols-[3.5rem_1fr_auto] md:gap-x-8"
          >
            <Image
              src={e.logo}
              alt={e.subtitle}
              className="size-12 border border-border object-cover md:size-14"
            />
            <div className="min-w-0">
              <p className="font-mono text-xs uppercase tracking-[0.15em] text-primary">
                {e.kind}
              </p>
              <h3 className="mt-1.5 text-xl font-semibold tracking-tight md:text-2xl">
                {e.title}
              </h3>
              <p className="mt-0.5 text-muted-foreground">{e.subtitle}</p>
              {e.meta && (
                <p className="mt-0.5 text-sm text-muted-foreground">{e.meta}</p>
              )}
            </div>
            <div className="col-span-2 flex items-center gap-3 font-mono text-sm text-muted-foreground md:col-span-1 md:flex-col md:items-end md:gap-1 md:text-right">
              <span className="tnum">{e.dates}</span>
              {e.extra && <span className="text-foreground">{e.extra}</span>}
            </div>
          </div>
        ))}
      </Reveal>

      <div className="mt-14">
        <p className="mb-5 font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
          {t('skillsLabel')}
        </p>
        <SkillsMarquee />
      </div>
    </Section>
  );
}
