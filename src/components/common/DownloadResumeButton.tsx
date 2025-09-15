import { Button, Link } from "@heroui/react";
import { Hover } from "@/components/common";
import { useAppStore } from "@/hooks/useAppStore";
import { translations } from "@/i18n";

export const DownloadResumeButton = () => {
  const { language } = useAppStore();
  const t = translations[language];
  const downloadResume = t.profile.downloadResume;

  const resume = `${import.meta.env.BASE_URL}teoman-kirma-resume.pdf`;
  return (
    <Hover>
      <Link href={resume} download className="inline-flex">
        <Button
          color="success"
          size="lg"
          radius="full"
          className="text-white font-semibold"
        >
          <i aria-hidden className="fa-solid fa-download" />
          {downloadResume}
        </Button>
      </Link>
    </Hover>
  );
};
