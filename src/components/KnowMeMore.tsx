import { Spacer, Button, Link } from "@heroui/react";
import { SectionHeader } from "@/components/common";
import { useAppStore } from "@/hooks/useAppStore";
import { translations } from "@/i18n";

export const KnowMeMore = () => {
  const resume = `${import.meta.env.BASE_URL}teoman-kirma-resume.pdf`;
  const { language, email } = useAppStore();
  const {
    name,
    knowMeMore,
    whoAmIA,
    whoAmIB,
    aboutMe,
    myExperiences,
    nameLabel,
    emailLabel,
    ageLabel,
    age,
    fromLabel,
    from,
    downloadResume,
    experienceYear,
    experienceText,
    projectsNumber,
    projectsLabel,
  } = translations[language];

  return (
    <div id="aboutMe">
      <div>
        <SectionHeader header={knowMeMore} />
      </div>
      <Spacer y={3} />
      <div>
        <div>
          <div>
            <h3>
              {whoAmIA} <span className="text-accent">{name}</span>, {whoAmIB}.
            </h3>
            <h3>{aboutMe}</h3>
            <Spacer y={1} />
            <h3>{myExperiences}</h3>
          </div>
        </div>
        <div>
          <ul>
            <li>
              <h3>
                <b className="li-b">{nameLabel}: </b>
                {name}
              </h3>
              <hr className="li-hr" />
            </li>
            <li>
              <h3>
                <b>{emailLabel}: </b>
                <Link href={`mailto: ${email}`}>{email}</Link>
              </h3>
              <hr />
            </li>
            <li>
              <h3>
                <b className="li-b">{ageLabel}: </b>
                {age}
              </h3>
              <hr className="li-hr" />
            </li>
            <li>
              <h3>
                <b className="li-b">{fromLabel}: </b>
                {from}
              </h3>
            </li>
            <Spacer y={1} />
            <li className="center-item">
              <a href={resume} download>
                <Button color="success" size="lg" radius="full">
                  {downloadResume}
                </Button>
              </a>
            </li>
          </ul>
        </div>
        <div>
          <div>
            <h2>{experienceYear}+</h2>
            <h6>{experienceText}</h6>
          </div>
          <div>
            <h2>{projectsNumber}+</h2>
            <h6>{projectsLabel}</h6>
          </div>
        </div>
      </div>
      <Spacer y={3} />
    </div>
  );
};
