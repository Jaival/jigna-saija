# 012 — Restore page-level metadata (server/client split)

- **Status**: DONE
- **Commit**: `a6425c7`
- **Severity**: LOW (but a real SEO defect)
- **Category**: Correctness (non-motion)
- **Estimated scope**: 4 files edited (1 new), ~60 lines changed
- **Depends on**: plan 003 (which removes the decoration that forced the client boundary)

## Problem

Three of the site's four routes ship **no page-level metadata**. Only `/projects/[id]` has any, via `generateMetadata`.

The home page is a client component purely so it can host decorative motion, and that forced its metadata export to be commented out:

```tsx
// app/page.tsx:1-12 — current
'use client';
import { motion } from 'motion/react';
import AboutMeComponent from '@/components/aboutMe';
import DesignProcessComponent from '@/components/designProcess';
import Hero from '@/components/hero';
import React from 'react';
// import type { Metadata } from 'next';

// export const metadata: Metadata = {
//   title: 'Home',
//   description:
//     'Jigna Saija - Professional architect and interior designer specializing in modern and sustainable design solutions.',
// };
```

`export const metadata` is not allowed in a file marked `'use client'`, so the author commented it out rather than restructuring. The page now inherits only the root default from `app/layout.tsx:28-31`.

The other two routes are already server components and simply never had metadata added:

```tsx
// app/projects/page.tsx — current, complete file
import ProjectsComponent from '@/components/projects';

export default function Projects() {
  return (
    <ProjectsComponent/>
  );
}
```

```tsx
// app/contact-me/page.tsx — current, complete file
import ContactMeComponent from '@/components/contactMe';

export default function ContactMe() {
  return (
    <ContactMeComponent/>
  );
}
```

The consequence: `/projects` and `/contact-me` both show "Jigna Saija | Architect & Interior Designer" in search results and link previews, with the identical generic description. For a portfolio whose whole purpose is being found and shared, that is the page most worth fixing.

## Target

### A. Make `app/page.tsx` a server component again

After plan 003 deletes `FloatingElements`, the only motion left in `app/page.tsx` is `SectionWrapper` and the two dividers. Move those into a small client component and the page can be a server component with real metadata.

```tsx
/* target — new file components/SectionWrapper.tsx */
'use client';

import { motion } from 'motion/react';
import { enterTransition } from '@/lib/motion';
import React from 'react';

export function SectionWrapper({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={enterTransition}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function SectionDivider() {
  return (
    <motion.div
      className="my-12 md:my-16 mx-auto w-24 h-1 rounded-full divider-brand"
      initial={{ scaleX: 0, opacity: 0 }}
      whileInView={{ scaleX: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={enterTransition}
      style={{ transformOrigin: 'center' }}
    />
  );
}
```

```tsx
/* target — app/page.tsx, complete file */
import AboutMeComponent from '@/components/aboutMe';
import DesignProcessComponent from '@/components/designProcess';
import Hero from '@/components/hero';
import { SectionWrapper, SectionDivider } from '@/components/SectionWrapper';
import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Home',
  description:
    'Jigna Saija - Professional architect and interior designer specializing in modern and sustainable design solutions.',
};

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background gradient wash */}
      <div
        className="fixed inset-0 pointer-events-none opacity-25"
        style={{
          background: `radial-gradient(circle at 20% 50%, rgba(29, 103, 147, 0.04) 0%, transparent 60%),
          radial-gradient(circle at 80% 20%, rgba(164, 14, 76, 0.03) 0%, transparent 60%),
          radial-gradient(circle at 40% 80%, rgba(251, 146, 60, 0.02) 0%, transparent 60%)`,
        }}
      />

      <main className="relative z-10">
        <SectionWrapper>
          <Hero />
        </SectionWrapper>

        <SectionDivider />

        <SectionWrapper>
          <AboutMeComponent />
        </SectionWrapper>

        <SectionDivider />

        <SectionWrapper>
          <DesignProcessComponent />
        </SectionWrapper>

        <div className="h-16 md:h-24" />
      </main>
    </div>
  );
}
```

`Hero`, `AboutMeComponent` and `DesignProcessComponent` already carry their own `'use client'` directives, so they continue to work unchanged as children of a server component.

### B. `/projects`

```tsx
/* target — app/projects/page.tsx, complete file */
import ProjectsComponent from '@/components/projects';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'Browse interior design and architecture projects by Jigna Saija — residences, offices, showrooms and more.',
  openGraph: {
    title: 'Projects | Jigna Saija',
    description:
      'Browse interior design and architecture projects by Jigna Saija — residences, offices, showrooms and more.',
  },
};

export default function Projects() {
  return <ProjectsComponent />;
}
```

### C. `/contact-me`

```tsx
/* target — app/contact-me/page.tsx, complete file */
import ContactMeComponent from '@/components/contactMe';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Get in touch with Jigna Saija to discuss an interior design or architecture project.',
  openGraph: {
    title: 'Contact | Jigna Saija',
    description:
      'Get in touch with Jigna Saija to discuss an interior design or architecture project.',
  },
};

export default function ContactMe() {
  return <ContactMeComponent />;
}
```

The root layout's `title.template` is `'%s | Jigna Saija'` (`app/layout.tsx:29`), so `title: 'Projects'` renders as "Projects | Jigna Saija" automatically.

## Repo conventions to follow

- Metadata is typed with `import type { Metadata } from 'next';` and exported as `export const metadata: Metadata = { … }`. Exemplar: the `generateMetadata` function in `app/projects/[id]/page.tsx:11-38`, which also shows the `openGraph` shape this project uses.
- Client components live in `components/` with `'use client'` on line 1. Exemplar: `components/provider.tsx`.
- Route files in `app/` stay server components by default; push interactivity down into `components/`.

## Steps

1. Confirm plan 003 has landed — `app/page.tsx` must no longer contain `FloatingElements`. If it still does, STOP.
2. Create `components/SectionWrapper.tsx` with the contents of target A.
3. Replace `app/page.tsx` entirely with target A's page file. Note the `'use client'` directive and the `motion` import are both gone.
4. Replace `app/projects/page.tsx` with target B.
5. Replace `app/contact-me/page.tsx` with target C.
6. Run `bun run lint`, then `bun run build`.

## Boundaries

- Do NOT change `app/layout.tsx`, its root `metadata` object, or the `title.template`.
- Do NOT change `app/projects/[id]/page.tsx` — its `generateMetadata` and `generateStaticParams` are already correct.
- Do NOT change the descriptions' factual claims; they are the author's own copy from the commented-out block and the root layout.
- Do NOT add `'use client'` to any `app/**/page.tsx`.
- Do NOT add new dependencies.
- If `lib/motion.ts` does not exist, STOP — plan 001 must land first.

## Verification

- **Mechanical**:
  - `grep -n "use client" app/page.tsx app/projects/page.tsx app/contact-me/page.tsx` returns nothing.
  - `bun run build` succeeds. In the build output, `/`, `/projects` and `/contact-me` should be listed as static (`○`) — confirm none of them regressed to dynamic.
  - `bun run lint` passes.
- **Rendered check** — run `bun run build && bun run start`, then for each of `/`, `/projects`, `/contact-me`:
  - `curl -s http://localhost:3000/projects | grep -o '<title>[^<]*</title>'` returns `<title>Projects | Jigna Saija</title>`.
  - `curl -s http://localhost:3000/contact-me | grep -o 'name="description" content="[^"]*"'` returns the contact description, not the site default.
  - Confirm the same for `/` returning `Home | Jigna Saija`.
  - The titles must be present in the **initial HTML**, not injected by client JS — that is the whole point of the change.
- **Feel check**: load `/` and confirm the section entrances and dividers still animate exactly as they did before the refactor. Nothing visual should change.
- **Done when**: all four routes have distinct titles and descriptions in server-rendered HTML, no `app/**/page.tsx` is a client component, and the home page's motion is unchanged.

## Implementation notes

Deviations from the targets above, each found by the rendered check:

1. **`min-h-svh` kept.** The target quotes `min-h-screen`; plan 014 had already changed the wrapper to `min-h-svh` on purpose. This isn't drift, so the newer value stays.
2. **Home title uses `title.absolute`.** With the target's `title: 'Home'` the page rendered `<title>Home</title>`. Per the Next 16 docs (`generate-metadata.md`, "template"), `title.template` only applies to *child* segments, and `app/page.tsx` shares the root segment with `app/layout.tsx`. The fix is `title: { absolute: 'Home | Jigna Saija' }`, which matches this plan's verification line without touching the layout.
3. **Open Graph fields restored with a shared module, `app/shared-metadata.ts` (new file).** Metadata merges shallowly (`generate-metadata.md`, "Merging"), so the targets' page-level `openGraph` replaced the root object wholesale. `/projects` and `/contact-me` lost `og:image` (the file-generated `/opengraph-image`), `og:site_name`, `og:type`, `og:locale` and `og:url`, which would have left their link previews without an image. The docs' recommended pattern is a shared-fields module. The two pages spread `sharedOpenGraph` (type, locale, siteName, the 1200×630 image) and set their own `url`. `app/layout.tsx` is untouched, per Boundaries, so its copy of those values is now duplicated in the shared module.

Found, not fixed (outside Boundaries):

- `twitter:title` is still the site-wide default on every route, because the pages don't set `twitter`. The image is inherited correctly.
- The root layout could import `sharedOpenGraph` to remove the duplication, but the layout is off-limits.

## Verification results

- `grep -n "use client"` across the three route files: no output. PASS.
- `bun run build`: `/`, `/projects` and `/contact-me` are all `○ (Static)`. PASS.
- `bun run lint`: unchanged baseline (the pre-existing `projects.tsx` set-state-in-effect error plus 2 warnings in `app/opengraph-image.tsx`). No new problems.
- `tsc --noEmit`: clean.
- Rendered check (`next start`, curl of the initial HTML, no JS):
  - `/`: `<title>Home | Jigna Saija</title>` and the home description; og tags (including the image) inherited from the root.
  - `/projects`: `<title>Projects | Jigna Saija</title>`, the projects description, `og:title` "Projects | Jigna Saija", `og:url` …/projects, `og:image` …/opengraph-image, `og:site_name`, `og:type`.
  - `/contact-me`: `<title>Contact | Jigna Saija</title>`, the contact description, and the matching og tags.
  - PASS.
- Feel check (headless Chrome against the prod build, sampling computed opacity and transform):
  - The hero fades in from `translateY(12px)` about 300ms after hydration.
  - The dividers grow from `scaleX(0)` and the sections rise as they scroll into view.
  - With reduced motion, the transforms are `none` and the elements fade only.
  - The values and timing match the pre-refactor code, since `SectionWrapper` and `SectionDivider` are the same JSX moved to a file. PASS.
