import { Link } from "@heroui/react";
import { DownloadResumeButton, PageSection } from "@/components/common";
import { useAppStore } from "@/hooks/useAppStore";
import { translations } from "@/i18n";

export const KnowMeMore = () => {
  const { language, email } = useAppStore();

  const t = translations[language];

  return (
    <PageSection menuIndex={1} header={t.about.knowMeMore}>
      <div className="container mx-auto px-6 md:px-10">

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left: Intro copy */}
          <div className="lg:col-span-7 space-y-6">
            <h3 className="text-2xl md:text-3xl font-semibold tracking-tight leading-snug">
              {t.about.whoAmIA} <span className="text-accent font-bold">{t.name}</span>,{" "}
              {t.about.whoAmIB}.
            </h3>
            <p className="text-base md:text-lg text-foreground/80">{t.about.aboutMe}</p>
            <p className="text-base md:text-lg text-foreground/80">
              {t.about.myExperiences}
            </p>
          </div>

          {/* Right: Details list + resume */}
          <div className="lg:col-span-5">
            <ul className="text-sm md:text-base">
              <li className="py-2 border-b border-foreground/20">
                <div className="flex items-baseline gap-2">
                  <b className="min-w-16 opacity-80">{t.profile.nameLabel}:</b>
                  <span>{t.name}</span>
                </div>
              </li>
              <li className="py-2 border-b border-foreground/20">
                <div className="flex items-baseline gap-2">
                  <b className="min-w-16 opacity-80">{t.profile.emailLabel}:</b>
                  <Link
                    href={`mailto:${email}`}
                    className="font-bold"
                    color="success"
                  >
                    {email}
                  </Link>
                </div>
              </li>
              <li className="py-2 border-b border-foreground/20">
                <div className="flex items-baseline gap-2">
                  <b className="min-w-16 opacity-80">{t.profile.ageLabel}:</b>
                  <span>{t.profile.age}</span>
                </div>
              </li>
              <li className="py-2">
                <div className="flex items-baseline gap-2">
                  <b className="min-w-16 opacity-80">{t.profile.fromLabel}:</b>
                  <span>{t.profile.from}</span>
                </div>
              </li>
              <li className="pt-4 flex justify-center">
                <DownloadResumeButton />
              </li>
            </ul>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 gap-8 items-center">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              {t.stats.experienceYear}+
            </h2>
            <p className="mt-1 text-sm md:text-base opacity-80">
              {t.stats.experienceText}
            </p>
          </div>
          <div className="text-center border-l border-foreground/20 pl-8">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              {t.stats.projectsNumber}+
            </h2>
            <p className="mt-1 text-sm md:text-base opacity-80">
              {t.stats.projectsLabel}
            </p>
          </div>
        </div>
      </div>
    </PageSection>
  );
};
