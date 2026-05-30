import {Download} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {Button} from '@/components/ui/button';
import {RESUME_URL} from '@/lib/site';

export function DownloadResumeButton({variant = 'outline'}: {variant?: 'outline' | 'default'}) {
  const t = useTranslations();
  return (
    <Button asChild variant={variant}>
      <a href={RESUME_URL} download>
        <Download strokeWidth={1.75} /> {t('downloadResume')}
      </a>
    </Button>
  );
}
