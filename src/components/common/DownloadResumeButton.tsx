import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/hooks/useAppStore";
import { translations } from "@/i18n";

export function DownloadResumeButton() {
  const language = useAppStore((s) => s.language);
  const t = translations[language];
  const resume = `${import.meta.env.BASE_URL}teoman-kirma-resume.pdf`;

  return (
    <Button asChild size="lg" className="rounded-full font-semibold">
      <a href={resume} download>
        <Download className="h-4 w-4" />
        {t.profile.downloadResume}
      </a>
    </Button>
  );
}
