'use client';
import {Toaster} from 'sonner';
export function SiteToaster() {
  return (
    <Toaster
      theme="dark"
      richColors
      closeButton
      position="bottom-right"
      toastOptions={{style: {fontFamily: 'var(--font-geist-sans)', borderRadius: 14}}}
    />
  );
}
