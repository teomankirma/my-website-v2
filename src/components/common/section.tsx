import type {ReactNode} from 'react';
import {cn} from '@/lib/utils';

export function Section({
  id,
  className,
  children,
}: {
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn('scroll-mt-20 py-20 md:py-28', className)}
    >
      <div className="mx-auto w-full max-w-6xl px-5 md:px-8">{children}</div>
    </section>
  );
}
