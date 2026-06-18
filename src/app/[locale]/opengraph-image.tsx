import {ImageResponse} from 'next/og';

export const runtime = 'edge';
export const alt = 'Teoman Kirma - Fullstack Developer';
export const size = {width: 1200, height: 630};
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0a0a0b',
          fontFamily: 'monospace',
          padding: '60px',
        }}
      >
        {/* Subtle dot grid accent */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
        {/* Emerald glow blob */}
        <div
          style={{
            position: 'absolute',
            top: '10%',
            left: '15%',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'rgba(52, 211, 153, 0.14)',
            filter: 'blur(120px)',
          }}
        />

        {/* Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
            position: 'relative',
          }}
        >
          {/* Prompt eyebrow */}
          <div
            style={{
              color: '#34d399',
              fontSize: '20px',
              fontFamily: 'monospace',
              letterSpacing: '0.05em',
              marginBottom: '8px',
            }}
          >
            ~/teoman
          </div>

          {/* Name */}
          <div
            style={{
              color: '#f5f5f5',
              fontSize: '80px',
              fontWeight: 700,
              letterSpacing: '-0.04em',
              lineHeight: 1,
              textAlign: 'center',
            }}
          >
            Teoman Kirma
          </div>

          {/* Role */}
          <div
            style={{
              color: '#a1a1aa',
              fontSize: '32px',
              fontFamily: 'monospace',
              letterSpacing: '0.02em',
              marginTop: '8px',
            }}
          >
            Fullstack Developer
          </div>

          {/* Divider */}
          <div
            style={{
              width: '80px',
              height: '3px',
              backgroundColor: '#34d399',
              borderRadius: '2px',
              marginTop: '24px',
            }}
          />

          {/* Location */}
          <div
            style={{
              color: '#71717a',
              fontSize: '20px',
              fontFamily: 'monospace',
              marginTop: '8px',
            }}
          >
            Izmir, Türkiye
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
