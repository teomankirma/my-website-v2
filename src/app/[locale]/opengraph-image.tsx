import {ImageResponse} from 'next/og';
import {getTranslations} from 'next-intl/server';
export const alt = 'Teoman Kirma';
export const size = {width: 1200, height: 630};
export const contentType = 'image/png';
export default async function OGImage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'socialImage'});
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          background: '#0c0d0f',
          padding: 75,
          color: '#fff',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            right: -160,
            bottom: -230,
            width: 650,
            height: 650,
            borderRadius: '50%',
            background: '#202529',
          }}
        />
        <div style={{fontSize: 21, letterSpacing: 3, marginBottom: 45, display: 'flex'}}>
          {t('role')}
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 105,
            letterSpacing: -7,
            fontWeight: 600,
            lineHeight: 1,
          }}
        >
          {t('nameFirst')}
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 105,
            letterSpacing: -7,
            fontWeight: 600,
            lineHeight: 1,
          }}
        >
          {t('nameLast')}
          <span style={{color: '#ff854d'}}>.</span>
        </div>
        <div style={{display: 'flex', fontSize: 23, marginTop: 40, color: '#aeb4ba'}}>
          {t('tagline')}
        </div>
      </div>
    ),
    size,
  );
}
