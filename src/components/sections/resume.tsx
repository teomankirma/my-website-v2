import {useTranslations} from 'next-intl';
import Image from 'next/image';
import {ArrowUpRight, Download} from 'lucide-react';
import {GPA, RESUME_URL} from '@/lib/site';
import school from '@/assets/nisantasi-university.png';
import company from '@/assets/bytesandpixels.jpeg';
export function Resume() {
  const t = useTranslations('resume');
  return (
    <section id="resume" className="resume-section section-pad" aria-labelledby="resume-title">
      <div className="resume-heading" data-reveal>
        <p className="eyebrow">03 / {t('heading')}</p>
        <h2 id="resume-title">
          {t('headlineA')}
          <br />
          <span>{t('headlineB')}</span>
        </h2>
        <p>{t('intro')}</p>
        <a className="text-link" href={RESUME_URL} download>
          <Download size={16} />
          {t('download')}
        </a>
      </div>
      <div className="timeline" data-timeline>
        <span className="timeline-line" aria-hidden="true" />
        <span className="timeline-progress" data-timeline-line aria-hidden="true" />
        <article className="timeline-entry" data-reveal>
          <div className="timeline-dot" aria-hidden="true" />
          <p className="eyebrow">{t('expDates')}</p>
          <Image src={company} alt="" className="timeline-logo" />
          <p className="timeline-kind">{t('expTitle')}</p>
          <h3>{t('expRole')}</h3>
          <a href="https://bytesandpixels.co/" target="_blank" rel="noreferrer">
            {t('companyName')} <ArrowUpRight size={16} />
          </a>
          <p className="timeline-location">{t('expLocation')}</p>
          <p className="timeline-body">{t('experienceDescription')}</p>
        </article>
        <article className="timeline-entry" data-reveal>
          <div className="timeline-dot" aria-hidden="true" />
          <p className="eyebrow">{t('eduYears')}</p>
          <Image src={school} alt="" className="timeline-logo" />
          <p className="timeline-kind">{t('eduTitle')}</p>
          <h3>{t('degree')}</h3>
          <p className="timeline-school">{t('schoolName')}</p>
          <p className="timeline-location">
            {t('gpaLabel')} {GPA} / 4.00
          </p>
        </article>
      </div>
    </section>
  );
}
