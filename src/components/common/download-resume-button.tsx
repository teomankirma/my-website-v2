import {type Ref} from 'react';
import {Download} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {Button} from '@/components/ui/button';
import {RESUME_URL} from '@/lib/site';

export function DownloadResumeButton({
  variant = 'outline',
  size = 'lg',
  anchorRef,
}: {
  variant?: 'outline' | 'default';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  anchorRef?: Ref<HTMLAnchorElement>;
}) {
  const t = useTranslations();
  return (
    <Button asChild variant={variant} size={size}>
      <a ref={anchorRef} href={RESUME_URL} download>
        <Download strokeWidth={1.75} /> {t('downloadResume')}
      </a>
    </Button>
  );
}
