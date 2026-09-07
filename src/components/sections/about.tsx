import {useTranslations} from 'next-intl';
import {ArrowDownRight, ArrowUpRight, Download} from 'lucide-react';
import {RESUME_URL, SOCIAL_LINKS, SKILLS} from '@/lib/site';
export function About() {
  const t = useTranslations('about');
  return (
    <section id="about" className="about-section section-pad" aria-labelledby="about-title">
      <div className="about-top">
        <p className="eyebrow" data-reveal>
          02 / {t('heading')}
        </p>
        <span className="location-tag">{t('facts.from')}</span>
      </div>
      <h2 id="about-title" className="about-headline" data-reveal>
        {t('headlineA')}
        <br />
        <span>{t('headlineB')}</span>
        <ArrowDownRight aria-hidden="true" />
      </h2>
      <div className="about-grid">
        <div className="about-symbol" aria-hidden="true">
          <svg data-orbit viewBox="0 0 300 300" fill="none">
            <g stroke="currentColor" strokeWidth="2">
              {[0, 30, 60, 90, 120, 150].map((angle) => (
                <ellipse
                  key={angle}
                  cx="150"
                  cy="150"
                  rx="137"
                  ry="45"
                  transform={`rotate(${angle} 150 150)`}
                />
              ))}
            </g>
            <circle cx="150" cy="150" r="18" fill="currentColor" />
          </svg>
          <span>{t('symbolCaption')}</span>
        </div>
        <div className="about-copy" data-reveal>
          <h3>{t('whoAmI')}</h3>
          <p>{t('bodyA')}</p>
          <p>{t('bodyB')}</p>
          <div className="about-links">
            <a className="pill-link" href={RESUME_URL} download>
              <Download size={16} />
              {t('download')}
            </a>
            <a className="text-link" href={SOCIAL_LINKS.github} target="_blank" rel="noreferrer">
              GitHub <ArrowUpRight size={17} />
            </a>
          </div>
        </div>
      </div>
      <div className="skills-band" aria-label={t('skillsLabel')}>
        {SKILLS.map((skill, i) => (
          <span key={skill}>
            {skill}
            <span aria-hidden="true">{i % 2 ? '✳' : '↗'}</span>
          </span>
        ))}
      </div>
    </section>
  );
}
