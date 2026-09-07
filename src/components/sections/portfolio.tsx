import Image from 'next/image';
import {useTranslations} from 'next-intl';
import {ArrowUpRight, Plus} from 'lucide-react';
import {PROJECTS} from '@/lib/projects';
const FEATURED = ['cirkle', 'jobFlow', 'clueClash'] as const;
export function Portfolio() {
  const t = useTranslations('work');
  const archive = PROJECTS.filter((project) => !FEATURED.some((key) => key === project.key));
  return (
    <section
      id="portfolio"
      className="work-section section-pad"
      aria-labelledby="work-title"
      tabIndex={-1}
    >
      <div className="section-heading" data-reveal>
        <p className="eyebrow">01 / {t('eyebrow')}</p>
        <h2 id="work-title">
          {t('headingA')}
          <br />
          <span>{t('headingB')}</span>
        </h2>
        <p className="section-intro">{t('intro')}</p>
      </div>
      <div className="featured-projects">
        {FEATURED.map((key, index) => {
          const project = PROJECTS.find((item) => item.key === key)!;
          return (
            <article key={key} className="featured-project" data-project={key}>
              <div className="project-copy" data-reveal>
                <span className="project-index">0{index + 1}</span>
                <p className="eyebrow">{t(`projects.${key}.category`)}</p>
                <h3>{project.title}</h3>
                <p className="project-description">{t(`projects.${key}.description`)}</p>
                <ul className="tech-list" aria-label={t('technologyLabel')}>
                  {project.technologies
                    .split(', ')
                    .slice(0, 4)
                    .map((tech) => (
                      <li key={tech}>{tech}</li>
                    ))}
                </ul>
                <a className="text-link" href={project.href} target="_blank" rel="noreferrer">
                  {t('visit')} <ArrowUpRight size={17} />
                  <span className="sr-only">
                    {project.title} · {t('newTab')}
                  </span>
                </a>
              </div>
              <a
                className="project-art"
                href={project.href}
                target="_blank"
                rel="noreferrer"
                aria-label={`${project.title} · ${t('visit')} · ${t('newTab')}`}
              >
                <div className="project-art-shape" aria-hidden="true" />
                <div className="project-image-frame" data-parallax>
                  <Image
                    src={project.image}
                    alt={t(`projects.${key}.imageAlt`)}
                    sizes="(max-width: 767px) 88vw, 58vw"
                  />
                </div>
                <span className="project-open" aria-hidden="true">
                  <ArrowUpRight size={23} />
                </span>
              </a>
            </article>
          );
        })}
      </div>
      <div className="archive" data-reveal>
        <div className="archive-heading">
          <div>
            <p className="eyebrow">{t('archiveEyebrow')}</p>
            <h3>{t('archiveHeading')}</h3>
          </div>
          <span className="archive-count">0{archive.length}</span>
        </div>
        <div className="archive-list">
          {archive.map((project) => (
            <a
              key={project.key}
              href={project.href}
              target="_blank"
              rel="noreferrer"
              className="archive-project"
            >
              <div className="archive-thumb">
                <Image src={project.image} alt="" sizes="100px" />
              </div>
              <div>
                <h4>{project.title}</h4>
                <p>{project.technologies}</p>
              </div>
              <span className="archive-date">{project.year}</span>
              <Plus size={20} aria-hidden="true" />
              <span className="sr-only">{t('newTab')}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
