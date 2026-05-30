'use client';

import {useTheme} from 'next-themes';
import {Moon, Sun, Laptop} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {Button} from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function ThemeSwitcher() {
  const {setTheme} = useTheme();
  const t = useTranslations('theme');
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={t('toggle')}>
          <Sun className="size-[1.1rem] dark:hidden" strokeWidth={1.75} />
          <Moon className="hidden size-[1.1rem] dark:block" strokeWidth={1.75} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme('light')}>
          <Sun strokeWidth={1.75} /> {t('light')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          <Moon strokeWidth={1.75} /> {t('dark')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>
          <Laptop strokeWidth={1.75} /> {t('system')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
