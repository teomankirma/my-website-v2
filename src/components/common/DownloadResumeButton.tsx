import { Button, Link } from "@heroui/react";
import { useAppStore } from "@/hooks/useAppStore";
import { translations } from "@/i18n";

export const DownloadResumeButton = () => {
  const { language } = useAppStore();
  const { downloadResume } = translations[language];

  const resume = `${import.meta.env.BASE_URL}teoman-kirma-resume.pdf`;
  return (
    <Link href={resume} download className="inline-flex">
      <Button color="success" size="lg" radius="full" className="text-white">
        <i aria-hidden className="fa-solid fa-download" />
        {downloadResume}
      </Button>
    </Link>
  );
};
