import { Card, Chip, Image } from "@heroui/react";
import { toSectionHref } from "@/utils";
import { useAppStore } from "@/hooks/useAppStore";
import { translations, sharedI18n } from "@/i18n";
import {
  SectionHeader,
  DownloadResumeButton,
  SkillLogo,
} from "@/components/common";
import uniLogo from "@/assets/nisantasi-university.png";
import companyLogo from "@/assets/bytesandpixels.jpeg";
import reactLogo from "@/assets/react.svg";
import tsLogo from "@/assets/typescript.svg";
import tailwindLogo from "@/assets/tailwind.svg";
import nextLogo from "@/assets/nextjs.svg";
import zustandLogo from "@/assets/zustand.svg";
import tanstackLogo from "@/assets/tanstack.svg";

export const Resume = () => {
  const { language } = useAppStore();
  const {
    menuItems,
    eduTitle,
    expTitle,
    schoolName,
    degree,
    gpaLabel,
    expRole,
    expDates,
    expLocation,
  } = translations[language];
  const {
    eduYears,
    companyName,
    gpa,
    react,
    typescript,
    tailwind,
    nextjs,
    zustand,
    tanstack,
  } = sharedI18n;
  const headerLabel = menuItems[2];
  const sectionId = toSectionHref(headerLabel).slice(1);

  return (
    <section id={sectionId} className="section py-20 md:py-28">
      <div className="container mx-auto px-6 md:px-10">
        <SectionHeader header={headerLabel} />

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Education */}
          <div>
            <h3 className="text-xl md:text-2xl font-semibold mb-6">
              {eduTitle}
            </h3>
            <Card shadow="sm" className="p-6 rounded-2xl">
              <div className="flex items-start gap-5">
                <Image
                  src={uniLogo}
                  alt="Nisantasi University Logo"
                  className="rounded-lg object-contain bg-content2"
                  width={72}
                  height={72}
                />
                <div className="flex-1">
                  <Chip
                    color="success"
                    variant="solid"
                    className="text-white"
                    classNames={{ content: "font-semibold" }}
                  >
                    {eduYears}
                  </Chip>
                  <div className="mt-3 space-y-1">
                    <h4 className="text-lg md:text-xl font-semibold tracking-tight">
                      {schoolName}
                    </h4>
                    <p className="text-foreground/80">{degree}</p>
                    <p className="text-foreground/70">
                      {gpaLabel}: {gpa}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Experience (placeholder for now) */}
          <div>
            <h3 className="text-xl md:text-2xl font-semibold mb-6">
              {expTitle}
            </h3>
            <Card shadow="sm" className="p-6 rounded-2xl">
              <div className="flex items-start gap-5">
                <Image
                  src={companyLogo}
                  alt="BytesandPixels Logo"
                  className="rounded-lg object-contain bg-content2"
                  width={72}
                  height={72}
                />
                <div className="flex-1">
                  <Chip
                    color="success"
                    variant="solid"
                    className="text-white"
                    classNames={{ content: "font-semibold" }}
                  >
                    {expDates}
                  </Chip>
                  <div className="mt-3 space-y-1">
                    <h4 className="text-lg md:text-xl font-semibold tracking-tight">
                      {companyName}
                    </h4>
                    <p className="text-foreground/80">{expRole}</p>
                    <p className="text-foreground/70">{expLocation}</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
      {/* Skills section */}
      <div className="container mx-auto px-6 md:px-10 mt-16">
        <h3 className="text-xl md:text-2xl font-semibold mb-6">My Skills</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          <SkillLogo label={react} src={reactLogo} badgeColor="#61DBFB" />
          <SkillLogo label={typescript} src={tsLogo} badgeColor="#3078c6" />
          <SkillLogo label={tailwind} src={tailwindLogo} badgeColor="#06B6D4" />
          <SkillLogo
            label={nextjs}
            src={nextLogo}
            badgeColor="#000000"
            imgClassName="dark:invert"
          />
          <SkillLogo label={zustand} src={zustandLogo} badgeColor="#443e38" />
          <SkillLogo
            label={tanstack}
            src={tanstackLogo}
            imgClassName="invert dark:invert-0"
          />
        </div>
        <div className="mt-16 flex justify-center">
          <DownloadResumeButton />
        </div>
      </div>
    </section>
  );
};
