import path from "path";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getContentBySlug, getAllContentPaths } from "@/lib/content";
import {
  getRecentNotes,
  getPopularTags,
  getNotesByTag,
  getAllTags,
  POPULAR_CATEGORIES,
  CONTRIBUTE_LINKS,
} from "@/lib/kg-landing";
import { getBookNav, stripBookNavFromBody } from "@/lib/ethereum-localism-book";
import { BookNavLinks } from "@/components/BookNavLinks";
import { getEditOnGitHubUrl } from "@/lib/github";
import { buildGraphData } from "@/lib/graph-data";
import { KgSidebar } from "@/components/KgSidebar";
import { KnowledgeGraph } from "@/components/KnowledgeGraph";
import { MarkdownContent } from "@/components/MarkdownContent";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

interface PageProps {
  params: Promise<{ slug?: string[] }>;
}

export async function generateStaticParams() {
  const paths = getAllContentPaths();
  const contentDir = path.join(process.cwd(), "content");
  const params = paths.flatMap((filePath) => {
    const relative = path
      .relative(contentDir, filePath)
      .split(path.sep)
      .join("/")
      .replace(/\.md$/, "");
    const slugParts = relative.replace(/\s+/g, "-").split("/");
    if (relative === "index") {
      return [{ slug: [] as string[] }];
    }
    const result = [{ slug: slugParts }];
    // Also add parent slug for index files: resources/index -> also serve at /resources
    if (slugParts.length >= 2 && slugParts[slugParts.length - 1] === "index") {
      result.push({ slug: slugParts.slice(0, -1) });
    }
    return result;
  });
  // Ensure KG landing route exists even without content/index.md
  if (!params.some((p) => p.slug?.length === 0)) {
    params.push({ slug: [] });
  }
  // Add tag-filtered routes: /knowledge-garden/tag/theme/ethereum-localism
  const tags = getAllTags();
  for (const tag of tags) {
    params.push({ slug: ["tag", ...tag.split("/")] });
  }
  return params;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const slugStr = slug?.join("/") ?? "";
  if (!slugStr) {
    return { title: "Knowledge Garden | Ethereum Localism" };
  }
  // Tag-filtered page
  if (slug?.[0] === "tag" && slug.length > 1) {
    const tag = slug.slice(1).join("/");
    return {
      title: `#${tag} | Ethereum Localism Knowledge Garden`,
    };
  }
  const content = getContentBySlug(slugStr);
  if (!content) return { title: "Knowledge Garden | Ethereum Localism" };
  return {
    title: `${content.meta.title ?? "Page"} | Ethereum Localism Knowledge Garden`,
  };
}

export default async function KnowledgeGardenPage({ params }: PageProps) {
  const { slug } = await params;
  const slugStr = slug?.join("/") ?? "";
  const isIndex = !slugStr;

  // Tag-filtered page: /knowledge-garden/tag/theme/ethereum-localism
  const isTagPage = slug?.[0] === "tag" && slug.length > 1;
  const tagFilter = isTagPage ? slug!.slice(1).join("/") : null;
  const notesByTag = tagFilter ? getNotesByTag(tagFilter) : null;

  const content = !isTagPage && slugStr ? getContentBySlug(slugStr) : null;
  if (!isIndex && !isTagPage && !content) {
    notFound();
  }
  if (isTagPage && (!notesByTag || notesByTag.length === 0)) {
    notFound();
  }

  // Knowledge Garden landing: sidebar + main with recent notes, tags, graph
  if (isIndex) {
    const recentNotes = getRecentNotes(6);
    const popularTags = getPopularTags(12);
    const graphData = buildGraphData();

    return (
      <div className="min-h-screen bg-teal-50 dark:bg-stone-950">
        <Header />

        <main className="border-t border-teal-950/10 dark:border-teal-100/10">
          <div className="mx-auto flex max-w-6xl">
            <KgSidebar isKnowledgeHome />

            {/* Main content */}
            <div className="min-w-0 flex-1 px-5 py-8 sm:px-6 lg:px-8">
              {/* Mobile categories */}
              <div className="mb-6 lg:hidden">
                <p className="mb-3 text-xs font-medium uppercase tracking-wider text-stone-500 dark:text-stone-400">
                  Browse the Knowledge Garden
                </p>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_CATEGORIES.slice(0, 4).map((cat) => (
                    <Link
                      key={cat.href}
                      href={cat.href}
                      className="rounded-full border border-stone-200 bg-white px-3 py-1.5 text-sm text-stone-700 dark:border-stone-600 dark:bg-stone-900 dark:text-stone-300"
                    >
                      {cat.label}
                    </Link>
                  ))}
                  {CONTRIBUTE_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="rounded-full border border-teal-200 bg-teal-50 px-3 py-1.5 text-sm font-medium text-teal-800 dark:border-teal-800 dark:bg-teal-950/50 dark:text-teal-200"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
                <div className="mt-6 border-t border-stone-200 pt-6 dark:border-stone-700" />
              </div>

              <div className="mb-10">
                <h1 className="font-serif text-3xl font-light text-stone-900 dark:text-teal-50 sm:text-4xl">
                  Knowledge Garden
                </h1>
                <p className="mt-2 max-w-2xl text-stone-600 dark:text-stone-400">
                  An interconnected collection of ideas, concepts, and resources on Ethereum Localism.
                </p>
              </div>

              {/* Knowledge Graph */}
              <section id="knowledge-graph" className="mb-12 scroll-mt-24">
                <h2 className="font-serif text-xl font-light text-stone-900 dark:text-teal-50">
                  Knowledge Graph
                </h2>
                <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
                  Connections between notes. Click a node to navigate. The graph grows as internal links are added.
                </p>
                <div className="mt-4">
                  <KnowledgeGraph data={graphData} height={360} className="w-full" />
                </div>
              </section>

              <div className="grid gap-12 lg:grid-cols-3">
                {/* Recent Notes */}
                <div className="lg:col-span-2">
                  <h2 className="font-serif text-xl font-light text-stone-900 dark:text-teal-50">
                    Recent Notes
                  </h2>
                  <ul className="mt-4 space-y-4">
                    {recentNotes.map((note) => (
                      <li key={note.slug}>
                        <Link
                          href={note.url}
                          className="block rounded-lg border border-teal-950/10 bg-white p-4 transition hover:border-teal-700/30 dark:border-teal-100/10 dark:bg-stone-900/30 dark:hover:border-teal-400/20"
                        >
                          <h3 className="font-semibold text-stone-900 dark:text-teal-50">
                            {note.title}
                          </h3>
                          <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
                            Updated {note.updatedAtLabel}
                          </p>
                          <p className="mt-2 text-sm text-stone-600 dark:text-stone-400 line-clamp-2">
                            {note.excerpt}
                          </p>
                          {note.tags.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-1.5">
                              {note.tags.slice(0, 3).map((tag) => (
                                <span
                                  key={tag}
                                  className="rounded-full bg-stone-100 px-2 py-0.5 text-xs text-stone-600 dark:bg-stone-800 dark:text-stone-400"
                                >
                                  {tag.split("/").pop() ?? tag}
                                </span>
                              ))}
                              {note.tags.length > 3 && (
                                <span className="text-xs text-stone-400">
                                  +{note.tags.length - 3}
                                </span>
                              )}
                            </div>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* About + Popular Tags */}
                <div className="space-y-8">
                  <section>
                    <h2 className="font-serif text-xl font-light text-stone-900 dark:text-teal-50">
                      About the Knowledge Garden
                    </h2>
                    <p className="mt-3 text-sm text-stone-600 dark:text-stone-400">
                      The Ethereum Localism Knowledge Garden is a collaborative space for interconnected ideas, concepts, and resources. Unlike traditional documentation, notes here are:
                    </p>
                    <ul className="mt-3 space-y-1.5 text-sm text-stone-600 dark:text-stone-400">
                      <li>• Interconnected with bidirectional links</li>
                      <li>• Evolving and growing over time</li>
                      <li>• Community-maintained and collaborative</li>
                      <li>• Focused on both theory and practical implementation</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="font-serif text-xl font-light text-stone-900 dark:text-teal-50">
                      Popular Tags
                    </h2>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {popularTags.map((t) => (
                        <Link
                          key={t.tag}
                          href={t.url}
                          className="rounded-full bg-stone-100 px-3 py-1 text-sm text-stone-700 transition hover:bg-teal-100 hover:text-teal-800 dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-stone-700 dark:hover:text-teal-200"
                        >
                          {t.tag.split("/").pop() ?? t.tag}{" "}
                          <span className="text-stone-500 dark:text-stone-500">
                            {t.count}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  // Tag-filtered page: browse content by tag
  if (isTagPage && notesByTag && tagFilter) {
    const popularTags = getPopularTags(12);
    const tagDisplay = tagFilter.split("/").pop() ?? tagFilter;

    return (
      <div className="min-h-screen bg-teal-50 dark:bg-stone-950">
        <Header />

        <main className="border-t border-teal-950/10 dark:border-teal-100/10">
          <div className="mx-auto flex max-w-6xl">
            <KgSidebar isKnowledgeHome={false} />

            <div className="flex-1 border-y border-teal-950/10 bg-white dark:border-teal-100/10 dark:bg-stone-900/30">
              <div className="mx-auto max-w-4xl px-5 py-12 sm:px-6 sm:py-16">
                <div className="mb-6 lg:hidden">
                  <p className="mb-3 text-xs font-medium uppercase tracking-wider text-stone-500 dark:text-stone-400">
                    Browse the Knowledge Garden
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {POPULAR_CATEGORIES.slice(0, 4).map((cat) => (
                      <Link
                        key={cat.href}
                        href={cat.href}
                        className="rounded-full border border-stone-200 bg-white px-3 py-1.5 text-sm text-stone-700 dark:border-stone-600 dark:bg-stone-900 dark:text-stone-300"
                      >
                        {cat.label}
                      </Link>
                    ))}
                    {CONTRIBUTE_LINKS.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="rounded-full border border-teal-200 bg-teal-50 px-3 py-1.5 text-sm font-medium text-teal-800 dark:border-teal-800 dark:bg-teal-950/50 dark:text-teal-200"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                  <div className="mt-6 border-t border-stone-200 pt-6 dark:border-stone-700" />
                </div>
                <Link
                  href="/knowledge-garden"
                  className="mb-6 inline-block text-sm font-medium text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-teal-200"
                >
                  ← Back to Knowledge Garden
                </Link>
                <h1 className="mb-2 font-serif text-3xl font-light text-stone-900 dark:text-teal-50 sm:text-4xl">
                  #{tagDisplay}
                </h1>
                <p className="mb-8 text-sm text-stone-500 dark:text-stone-400">
                  {notesByTag.length} note{notesByTag.length !== 1 ? "s" : ""} tagged with{" "}
                  <code className="rounded bg-stone-100 px-1.5 py-0.5 dark:bg-stone-800">
                    {tagFilter}
                  </code>
                </p>
                <ul className="space-y-4">
                  {notesByTag.map((note) => (
                    <li key={note.slug}>
                      <Link
                        href={note.url}
                        className="block rounded-lg border border-teal-950/10 bg-white p-4 transition hover:border-teal-700/30 dark:border-teal-100/10 dark:bg-stone-900/30 dark:hover:border-teal-400/20"
                      >
                        <h2 className="font-semibold text-stone-900 dark:text-teal-50">
                          {note.title}
                        </h2>
                        <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
                          Updated {note.updatedAtLabel}
                        </p>
                        <p className="mt-2 text-sm text-stone-600 dark:text-stone-400 line-clamp-2">
                          {note.excerpt}
                        </p>
                        {note.tags.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {note.tags.slice(0, 5).map((t) => (
                              <span
                                key={t}
                                className="rounded-full bg-stone-100 px-2 py-0.5 text-xs text-stone-600 dark:bg-stone-800 dark:text-stone-400"
                              >
                                {t.split("/").pop() ?? t}
                              </span>
                            ))}
                          </div>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="mt-12 border-t border-stone-200 pt-8 dark:border-stone-700">
                  <p className="text-sm text-stone-500 dark:text-stone-400">
                    Explore more in the{" "}
                    <Link
                      href="/knowledge-garden/tag-index"
                      className="font-medium text-teal-700 hover:text-teal-800 dark:text-teal-300 dark:hover:text-teal-200"
                    >
                      Tag Index
                    </Link>
                    {popularTags.filter((t) => t.tag !== tagFilter).length > 0 && (
                      <>
                        {" "}or browse{" "}
                        {(() => {
                          const otherTags = popularTags
                            .filter((t) => t.tag !== tagFilter)
                            .slice(0, 5);
                          return otherTags.map((t, i) => (
                            <span key={t.tag}>
                              <Link
                                href={t.url}
                                className="font-medium text-teal-700 hover:text-teal-800 dark:text-teal-300 dark:hover:text-teal-200"
                              >
                                #{t.tag.split("/").pop()}
                              </Link>
                              {i < otherTags.length - 1 ? ", " : ""}
                            </span>
                          ));
                        })()}
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  // KG subpages: sidebar + markdown content for consistent orientation
  // Back link goes one folder level up (e.g. Implementation Guides → Library → Knowledge Garden)
  const parentSlug = slugStr.split("/").slice(0, -1).join("/");
  const parentContent = parentSlug ? getContentBySlug(parentSlug) : null;
  const backHref = parentSlug ? `/knowledge-garden/${parentSlug}` : "/knowledge-garden";
  const backLabel = parentContent?.meta?.title
    ? String(parentContent.meta.title)
    : parentSlug
      ? parentSlug.split("/").pop()?.replace(/-/g, " ") ?? "Parent"
      : "Knowledge Garden";

  return (
    <div className="min-h-screen bg-teal-50 dark:bg-stone-950">
      <Header />

      <main className="border-t border-teal-950/10 dark:border-teal-100/10">
        <div className="mx-auto flex max-w-6xl">
          <KgSidebar isKnowledgeHome={false} />

          <div className="flex-1 border-y border-teal-950/10 bg-white dark:border-teal-100/10 dark:bg-stone-900/30">
            <div className="mx-auto max-w-4xl px-5 py-12 sm:px-6 sm:py-16">
              {/* Mobile categories (sidebar hidden on small screens) */}
              <div className="mb-6 lg:hidden">
                <p className="mb-3 text-xs font-medium uppercase tracking-wider text-stone-500 dark:text-stone-400">
                  Browse the Knowledge Garden
                </p>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_CATEGORIES.slice(0, 4).map((cat) => (
                    <Link
                      key={cat.href}
                      href={cat.href}
                      className="rounded-full border border-stone-200 bg-white px-3 py-1.5 text-sm text-stone-700 dark:border-stone-600 dark:bg-stone-900 dark:text-stone-300"
                    >
                      {cat.label}
                    </Link>
                  ))}
                  {CONTRIBUTE_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="rounded-full border border-teal-200 bg-teal-50 px-3 py-1.5 text-sm font-medium text-teal-800 dark:border-teal-800 dark:bg-teal-950/50 dark:text-teal-200"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
                <div className="mt-6 border-t border-stone-200 pt-6 dark:border-stone-700" />
              </div>
              {(() => {
                const bookNav = content ? getBookNav(content.slug) : null;
                return bookNav ? (
                  <div className="mb-6">
                    <BookNavLinks bookNav={bookNav} position="top" />
                  </div>
                ) : null;
              })()}
              <Link
                href={backHref}
                className="mb-6 inline-block text-sm font-medium text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-teal-200"
              >
                ← Back to {backLabel}
              </Link>
              {content && (
                <>
                  <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
                    <h1 className="font-serif text-3xl font-light text-stone-900 dark:text-teal-50 sm:text-4xl">
                      {content.meta.title
                        ? String(content.meta.title)
                        : slugStr.split("/").pop()?.replace(/-/g, " ") ?? "Page"}
                    </h1>
                    <a
                      href={getEditOnGitHubUrl(content.filePath)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      Edit on GitHub
                    </a>
                  </div>
                  <MarkdownContent
                    content={
                      getBookNav(content.slug)
                        ? stripBookNavFromBody(content.body)
                        : content.body
                    }
                    baseSlug={content.slug}
                  />
                  {(() => {
                    const bookNav = getBookNav(content.slug);
                    return bookNav ? (
                      <BookNavLinks bookNav={bookNav} position="bottom" />
                    ) : null;
                  })()}
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
