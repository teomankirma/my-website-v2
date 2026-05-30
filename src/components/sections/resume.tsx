import Image from 'next/image';
import {useTranslations} from 'next-intl';
import {Section} from '@/components/common/section';
import {SectionHeader} from '@/components/common/section-header';
import {Reveal} from '@/components/common/reveal';
import {Card, CardContent} from '@/components/ui/card';
import {Badge} from '@/components/ui/badge';
import {SkillsMarquee} from '@/components/common/skills-marquee';
import {SECTION_IDS, GPA} from '@/lib/site';
import school from '@/assets/nisantasi-university.png';
import company from '@/assets/bytesandpixels.jpeg';

export function Resume() {
  const t = useTranslations('resume');

  return (
    <Section id={SECTION_IDS.resume} className="bg-card/30">
      <SectionHeader title={t('heading')} />
      <Reveal stagger={0.12} className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardContent className="flex gap-4 p-6">
            <Image src={school} alt={t('schoolName')} className="size-16 rounded-lg border border-border object-cover" />
            <div>
              <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">{t('eduTitle')}</p>
              <h3 className="mt-1 font-semibold">{t('schoolName')}</h3>
              <p className="text-sm text-muted-foreground">{t('degree')}</p>
              <div className="mt-2 flex items-center gap-2">
                <Badge className="font-mono">{t('eduYears')}</Badge>
                <span className="text-xs text-muted-foreground">{t('gpaLabel')} {GPA}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex gap-4 p-6">
            <Image src={company} alt={t('companyName')} className="size-16 rounded-lg border border-border object-cover" />
            <div>
              <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">{t('expTitle')}</p>
              <h3 className="mt-1 font-semibold">{t('expRole')}</h3>
              <p className="text-sm text-muted-foreground">{t('companyName')}</p>
              <p className="text-xs text-muted-foreground">{t('expLocation')}</p>
              <div className="mt-2">
                <Badge className="font-mono">{t('expDates')}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </Reveal>

      <div className="mt-12">
        <p className="mb-4 font-mono text-xs uppercase tracking-wider text-muted-foreground">{t('skillsLabel')}</p>
        <SkillsMarquee />
      </div>
    </Section>
  );
}
