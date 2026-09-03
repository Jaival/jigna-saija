import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';

export const alt = 'Jigna Saija | Architect & Interior Designer';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const BUTTON_BLUE = '#1d6793';
const AMARANTH_PURPLE = '#a40e4c';
const GOLD = '#fb923c';
const BLUE_DARK = '#001b29';
const BLACK = '#00171f';
const WHITE = '#f2f5ff';
const PERIWINKLE = '#c3c9e9';

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
    const match = css.match(/src: url\(([^)]+)\) format\('(?:opentype|truetype)'\)/);
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

  const [portraitSrc, logoSrc, boldFont, regularFont] = await Promise.all([
    toDataUri('images/jignasaija_small.jpg', 'image/jpeg'),
    toDataUri('logos/JiiJ_Designs_White.png', 'image/png'),
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
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
          backgroundColor: BLACK,
          backgroundImage: `linear-gradient(135deg, ${BLUE_DARK} 0%, ${BLACK} 60%)`,
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
            background: `radial-gradient(circle, ${BUTTON_BLUE}55 0%, transparent 70%)`,
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
            background: `radial-gradient(circle, ${AMARANTH_PURPLE}4d 0%, transparent 70%)`,
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
            background: `radial-gradient(circle, ${GOLD}33 0%, transparent 70%)`,
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
            background: `linear-gradient(90deg, ${BUTTON_BLUE}, ${AMARANTH_PURPLE}, ${GOLD})`,
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
                color: GOLD,
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
                color: WHITE,
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
                background: `linear-gradient(90deg, ${BUTTON_BLUE}, ${AMARANTH_PURPLE}, ${GOLD})`,
              }}
            />

            <div
              style={{
                display: 'flex',
                color: PERIWINKLE,
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
                color: WHITE,
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
              background: `linear-gradient(135deg, ${BUTTON_BLUE}, ${AMARANTH_PURPLE}, ${GOLD})`,
            }}
          >
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

        {/* Logo watermark */}
        <img
          src={logoSrc}
          alt=""
          width={72}
          height={72}
          style={{
            position: 'absolute',
            bottom: 32,
            left: 72,
            opacity: 0.9,
          }}
        />
      </div>
    ),
    {
      ...size,
      fonts: fonts.length ? fonts : undefined,
    },
  );
}
