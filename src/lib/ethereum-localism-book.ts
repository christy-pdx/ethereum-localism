/**
 * Ordered chapters of the Ethereum Localism book for prev/next navigation.
 * Mirrors the Table of Contents in content/library/Ethereum Localism/ethereum-localism-book/index.md
 */
const BOOK_BASE = "library/Ethereum-Localism/ethereum-localism-book";

export const ETHEREUM_LOCALISM_BOOK_CHAPTERS = [
  { slug: `${BOOK_BASE}/ethereum-localism-book-01-introduction`, title: "Introduction" },
  { slug: `${BOOK_BASE}/ethereum-localism-book-02-interlude`, title: "Interlude" },
  { slug: `${BOOK_BASE}/ethereum-localism-book-03-cosmo-local-plan`, title: "The Cosmo-Local Plan for our Next Civilization" },
  { slug: `${BOOK_BASE}/ethereum-localism-book-04-shift-in-perspective`, title: "Does organizing at the Cosmo-local level require a profound shift in perspective?" },
  { slug: `${BOOK_BASE}/ethereum-localism-book-05-inverted-city`, title: "The Inverted City" },
  { slug: `${BOOK_BASE}/ethereum-localism-book-06-semiotic-bridging`, title: "Semiotic Bridging" },
  { slug: `${BOOK_BASE}/ethereum-localism-book-07-interlude-2`, title: "Second Interlude" },
  { slug: `${BOOK_BASE}/ethereum-localism-book-08-manifesto`, title: "The Rooted Society Manifesto" },
  { slug: `${BOOK_BASE}/ethereum-localism-book-09-open-civics`, title: "On Open Civic Systems" },
  { slug: `${BOOK_BASE}/ethereum-localism-book-10-green-crypto`, title: "Walkthrough of the Green Crypto Handbook" },
  { slug: `${BOOK_BASE}/ethereum-localism-book-11-bioregional`, title: "Bioregional Organizing Networks" },
  { slug: `${BOOK_BASE}/ethereum-localism-book-12-interlude-3`, title: "Third Interlude" },
  { slug: `${BOOK_BASE}/ethereum-localism-book-13-neighbourhoods`, title: "Neighbourhoods" },
  { slug: `${BOOK_BASE}/ethereum-localism-book-14-dpans`, title: "dPAN's" },
  { slug: `${BOOK_BASE}/ethereum-localism-book-15-information-tsunamis`, title: "From Information Tsunamis to Local Streams" },
  { slug: `${BOOK_BASE}/ethereum-localism-book-16-mycofi`, title: "MycoFi" },
  { slug: `${BOOK_BASE}/ethereum-localism-book-17-regen-hub`, title: "We Got Us: A Regen Hub Playbook" },
] as const;

const TOC_SLUG = `${BOOK_BASE}/index`;
const TOC_TITLE = "Ethereum Localism: Grounding the Future of Coordination";

export interface BookNavItem {
  slug: string;
  title: string;
  url: string;
}

export interface BookNav {
  toc: BookNavItem;
  prev: BookNavItem | null;
  next: BookNavItem | null;
}

/** Normalize slug for comparison (handles both hyphen and path variants) */
function normalizeForMatch(slug: string): string {
  return slug.replace(/\s+/g, "-").toLowerCase();
}

/**
 * Get book navigation (prev, next, TOC) for a given content slug.
 * Returns null if the slug is not a book chapter.
 */
export function getBookNav(contentSlug: string): BookNav | null {
  const normalized = normalizeForMatch(contentSlug);
  const matchIdx = ETHEREUM_LOCALISM_BOOK_CHAPTERS.findIndex((ch) => {
    const chFilename = ch.slug.split("/").pop() ?? "";
    return normalized.endsWith(normalizeForMatch(chFilename)) || normalized === normalizeForMatch(ch.slug);
  });

  if (matchIdx < 0) return null;

  return {
    toc: {
      slug: TOC_SLUG,
      title: TOC_TITLE,
      url: `/knowledge-garden/${TOC_SLUG}`,
    },
    prev:
      matchIdx > 0
        ? {
            slug: ETHEREUM_LOCALISM_BOOK_CHAPTERS[matchIdx - 1].slug,
            title: ETHEREUM_LOCALISM_BOOK_CHAPTERS[matchIdx - 1].title,
            url: `/knowledge-garden/${ETHEREUM_LOCALISM_BOOK_CHAPTERS[matchIdx - 1].slug}`,
          }
        : null,
    next:
      matchIdx < ETHEREUM_LOCALISM_BOOK_CHAPTERS.length - 1
        ? {
            slug: ETHEREUM_LOCALISM_BOOK_CHAPTERS[matchIdx + 1].slug,
            title: ETHEREUM_LOCALISM_BOOK_CHAPTERS[matchIdx + 1].title,
            url: `/knowledge-garden/${ETHEREUM_LOCALISM_BOOK_CHAPTERS[matchIdx + 1].slug}`,
          }
        : null,
  };
}

/**
 * Remove the inline book nav line from markdown body to avoid duplicate navigation.
 * The line format: [Back to Table of Contents](...) | [Prev/Next: ...](...)
 */
export function stripBookNavFromBody(body: string): string {
  return body.replace(/\n\s*\[Back to Table of Contents\]\([^)]+\)[^\n]*\n?/g, "\n");
}
