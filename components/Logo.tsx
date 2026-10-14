import { cn } from '@/lib/utils';

/**
 * The JiiJ Designs wordmark, redrawn as SVG so it follows the theme: the
 * letters take `currentColor` and the two i's take the clay brand colour.
 * The old PNGs were white-on-transparent and vanished on light backgrounds.
 */
export function Logo({
  className,
  title = 'JiiJ Designs',
}: {
  className?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 1170 280"
      role="img"
      aria-label={title}
      className={cn('h-auto w-full', className)}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="13"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* J */}
        <path d="M24 34H104V186a54 54 0 0 1-54 54h-4a38 38 0 0 1-26-11" />
        {/* J */}
        <path d="M334 34H414V186a54 54 0 0 1-54 54h-4a38 38 0 0 1-26-11" />
      </g>

      {/* ii: the brand accent */}
      <g className="fill-brand">
        <circle cx="205" cy="22" r="16" />
        <rect x="194" y="66" width="22" height="160" rx="3" />
        <circle cx="285" cy="22" r="16" />
        <rect x="274" y="66" width="22" height="160" rx="3" />
      </g>

      {/* divider */}
      <rect x="484" y="0" width="4" height="280" rx="2" fill="currentColor" />

      {/* Titillium squeezed to 62% width stands in for the condensed face of
          the original artwork. */}
      <text
        transform="translate(522 0) scale(0.62 1)"
        x="0"
        y="204"
        fill="currentColor"
        fontSize="182"
        fontWeight="700"
        textLength="1030"
        lengthAdjust="spacing"
        style={{ fontFamily: 'var(--font-titillium-web), sans-serif' }}
      >
        DESIGNS
      </text>
    </svg>
  );
}
