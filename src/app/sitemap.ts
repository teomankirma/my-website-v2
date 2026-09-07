import type {MetadataRoute} from 'next';
import {SITE_URL} from '@/lib/site';
export default function sitemap(): MetadataRoute.Sitemap {
  return ['en', 'tr'].map((locale) => ({
    url: `${SITE_URL}/${locale}`,
    alternates: {languages: {en: `${SITE_URL}/en`, tr: `${SITE_URL}/tr`}},
  }));
}
