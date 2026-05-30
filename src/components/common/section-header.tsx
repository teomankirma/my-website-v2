import {cn} from '@/lib/utils';

export function SectionHeader({
  title,
  className,
}: {
  title: string;
  className?: string;
}) {
  return (
    <h2
      className={cn(
        'mb-10 text-3xl font-bold tracking-tight md:text-4xl',
        className,
      )}
    >
      {title}
    </h2>
  );
}
