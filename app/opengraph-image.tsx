import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';

export const alt = 'Jigna Saija | Architect & Interior Designer';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Hex mirrors of the globals.css palette; Satori can't read CSS variables.
const PINE = '#246a7e';
const CLAY = '#b45431';
const OCHRE = '#e4ac59';
const STONE_DARK = '#2a2522';
const INK = '#120f0c';
const PAPER = '#f8f5ef';
const PINE_TINT = '#81c4d0';

async function loadGoogleFont(
  family: string,
  weight: number,
  text: string,
): Promise<ArrayBuffer | null> {
  try {
    const url = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
      family,
    )}:wght@${weight}&text=${encodeURIComponent(text)}`;
    const css = await (
      await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } })
    ).text();
    const match = css.match(
      /src: url\(([^)]+)\) format\('(?:opentype|truetype)'\)/,
    );
    const fontUrl = match?.[1];
    if (!fontUrl) return null;
    const res = await fetch(fontUrl);
    if (res.status !== 200) return null;
    return await res.arrayBuffer();
  } catch {
    return null;
  }
}

async function toDataUri(relativePath: string, mime: string) {
  const buffer = await readFile(join(process.cwd(), 'public', relativePath));
  return `data:${mime};base64,${buffer.toString('base64')}`;
}

export default async function Image() {
  const titleText = 'Jigna Saija';
  const bodyText =
    'ARCHITECT & INTERIOR DESIGNER Modern Sustainable Design Solutions jignasaija.vercel.app';

  const [portraitSrc, boldFont, regularFont] = await Promise.all([
    toDataUri('images/jignasaija_small.jpg', 'image/jpeg'),
    loadGoogleFont('Titillium Web', 700, titleText),
    loadGoogleFont('Titillium Web', 400, bodyText),
  ]);

  const fonts = [];
  if (boldFont) {
    fonts.push({
      name: 'Titillium Web',
      data: boldFont,
      weight: 700 as const,
      style: 'normal' as const,
    });
  }
  if (regularFont) {
    fonts.push({
      name: 'Titillium Web',
      data: regularFont,
      weight: 400 as const,
      style: 'normal' as const,
    });
  }

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        position: 'relative',
        backgroundColor: INK,
        backgroundImage: `linear-gradient(135deg, ${STONE_DARK} 0%, ${INK} 60%)`,
        fontFamily: fonts.length ? 'Titillium Web' : 'sans-serif',
      }}
    >
      {/* Decorative glow blobs */}
      <div
        style={{
          position: 'absolute',
          top: -140,
          left: -100,
          width: 420,
          height: 420,
          borderRadius: '50%',
          display: 'flex',
          background: `radial-gradient(circle, ${PINE}55 0%, transparent 70%)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: -160,
          right: -80,
          width: 480,
          height: 480,
          borderRadius: '50%',
          display: 'flex',
          background: `radial-gradient(circle, ${CLAY}4d 0%, transparent 70%)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 120,
          right: 380,
          width: 240,
          height: 240,
          borderRadius: '50%',
          display: 'flex',
          background: `radial-gradient(circle, ${OCHRE}33 0%, transparent 70%)`,
        }}
      />

      {/* Top brand gradient bar */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: 10,
          display: 'flex',
          background: `linear-gradient(90deg, ${PINE}, ${CLAY}, ${OCHRE})`,
        }}
      />

      {/* Main content row */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          width: '100%',
          height: '100%',
          padding: '0 72px',
        }}
      >
        {/* Left: text block */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            paddingRight: 48,
          }}
        >
          <div
            style={{
              display: 'flex',
              color: OCHRE,
              fontSize: 26,
              fontWeight: 700,
              letterSpacing: 6,
              textTransform: 'uppercase',
              marginBottom: 22,
            }}
          >
            Architect &amp; Interior Designer
          </div>

          <div
            style={{
              display: 'flex',
              color: PAPER,
              fontSize: 92,
              fontWeight: 700,
              lineHeight: 1.05,
              marginBottom: 26,
            }}
          >
            {titleText}
          </div>

          <div
            style={{
              display: 'flex',
              width: 140,
              height: 8,
              borderRadius: 999,
              marginBottom: 26,
              background: `linear-gradient(90deg, ${PINE}, ${CLAY}, ${OCHRE})`,
            }}
          />

          <div
            style={{
              display: 'flex',
              color: PINE_TINT,
              fontSize: 32,
              lineHeight: 1.4,
              maxWidth: 560,
            }}
          >
            Modern &amp; sustainable design solutions
          </div>

          <div
            style={{
              display: 'flex',
              color: PAPER,
              opacity: 0.55,
              fontSize: 24,
              marginTop: 44,
              letterSpacing: 1,
            }}
          >
            jignasaija.vercel.app
          </div>
        </div>

        {/* Right: portrait */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 360,
            height: 452,
            borderRadius: 28,
            padding: 6,
            background: `linear-gradient(135deg, ${PINE}, ${CLAY}, ${OCHRE})`,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse renders
                plain HTML; next/image is not supported inside it. */}
          <img
            src={portraitSrc}
            alt=""
            width={348}
            height={440}
            style={{
              borderRadius: 24,
              objectFit: 'cover',
            }}
          />
        </div>
      </div>

      {/* Logo watermark: the JiiJ mark from components/Logo.tsx, drawn
            inline so it needs no font and no raster asset. */}
      <svg
        viewBox="0 0 440 280"
        width={110}
        height={70}
        style={{ position: 'absolute', bottom: 32, left: 72, opacity: 0.9 }}
      >
        <path
          d="M24 34H104V186a54 54 0 0 1-54 54h-4a38 38 0 0 1-26-11"
          fill="none"
          stroke={PAPER}
          strokeWidth={13}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M334 34H414V186a54 54 0 0 1-54 54h-4a38 38 0 0 1-26-11"
          fill="none"
          stroke={PAPER}
          strokeWidth={13}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx={205} cy={22} r={16} fill={CLAY} />
        <rect x={194} y={66} width={22} height={160} rx={3} fill={CLAY} />
        <circle cx={285} cy={22} r={16} fill={CLAY} />
        <rect x={274} y={66} width={22} height={160} rx={3} fill={CLAY} />
      </svg>
    </div>,
    {
      ...size,
      fonts: fonts.length ? fonts : undefined,
    },
  );
}
