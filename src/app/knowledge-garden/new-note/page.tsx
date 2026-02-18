import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { KgSidebar } from "@/components/KgSidebar";
import { getNewFileOnGitHubUrl } from "@/lib/github";
import { NewNoteTemplate } from "./NewNoteTemplate";

const GITHUB_NEW_FILE = getNewFileOnGitHubUrl("content/library/Field-Reports/your-note-title.md");

const TEMPLATE = `---
title: "Your Note Title"
date: "${new Date().toISOString().slice(0, 10)}"
author: "Your Name"
tags:
  - format/field-report
  - theme/ethereum-localism
---

Your content goes here. Use [Markdown formatting](https://www.markdownguide.org/cheat-sheet/).

- Start with context: where, when, who
- Share what happened, what you learned
- Link to related pages: [Field Reports](library/Field-Reports), [Implementation Guides](library/Implementation-Guides)
`;

export const metadata = {
  title: "New Note | Ethereum Localism Knowledge Garden",
  description:
    "Contribute a new note to the Ethereum Localism Knowledge Garden. Share field reports, guides, and reflections.",
};

export default function NewNotePage() {
  return (
    <div className="min-h-screen bg-teal-50 dark:bg-stone-950">
      <Header />

      <main className="border-t border-teal-950/10 dark:border-teal-100/10">
        <div className="mx-auto flex max-w-6xl">
          <KgSidebar isKnowledgeHome={false} />

          <div className="min-w-0 flex-1 border-y border-teal-950/10 bg-white dark:border-teal-100/10 dark:bg-stone-900/30">
            <div className="mx-auto max-w-4xl px-5 py-12 sm:px-6 sm:py-16">
              <Link
                href="/knowledge-garden"
                className="mb-6 inline-block text-sm font-medium text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-teal-200"
              >
                ← Back to Knowledge Garden
              </Link>

              <h1 className="mb-2 font-serif text-3xl font-light text-stone-900 dark:text-teal-50 sm:text-4xl">
                New Note
              </h1>
              <p className="mb-8 text-stone-600 dark:text-stone-400">
                Add your field report, implementation guide, or reflection to the Knowledge Garden.
              </p>

              <div className="space-y-8">
                <section>
                  <h2 className="mb-3 font-semibold text-stone-900 dark:text-teal-50">
                    Two ways to contribute
                  </h2>
                  <div className="space-y-4">
                    <div className="rounded-lg border border-teal-950/10 bg-teal-50/50 p-4 dark:border-teal-100/10 dark:bg-teal-950/20">
                      <h3 className="font-medium text-stone-900 dark:text-teal-50">
                        Option 1: Via GitHub
                      </h3>
                      <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">
                        If you have write access, create a new file directly in the repo. Copy the
                        template below, then open GitHub to add your note.
                      </p>
                      <a
                        href={GITHUB_NEW_FILE}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-teal-700 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300"
                      >
                        Create new file on GitHub
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </a>
                    </div>
                    <div className="rounded-lg border border-teal-950/10 bg-stone-50 p-4 dark:border-teal-100/10 dark:bg-stone-900/50">
                      <h3 className="font-medium text-stone-900 dark:text-teal-50">
                        Option 2: Share with curators
                      </h3>
                      <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">
                        Don&apos;t have GitHub access? Share a Google Doc or markdown file with the
                        curators. See the{" "}
                        <Link
                          href="/knowledge-garden/contribution-guide"
                          className="font-medium text-teal-700 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300"
                        >
                          Contribution Guide
                        </Link>{" "}
                        for details.
                      </p>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="mb-3 font-semibold text-stone-900 dark:text-teal-50">
                    Copy this template
                  </h2>
                  <p className="mb-3 text-sm text-stone-600 dark:text-stone-400">
                    Use the template below. Edit the frontmatter and add your content.{" "}
                    <Link
                      href="/knowledge-garden/tag-index"
                      className="font-medium text-teal-700 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300"
                    >
                      View the Tag Index
                    </Link>{" "}
                    for available tags.
                  </p>
                  <NewNoteTemplate template={TEMPLATE} />
                </section>

                <section>
                  <h2 className="mb-3 font-semibold text-stone-900 dark:text-teal-50">
                    Where to put your note
                  </h2>
                  <ul className="list-inside list-disc space-y-1 text-sm text-stone-600 dark:text-stone-400">
                    <li>
                      <strong>Field Reports</strong> → <code>content/library/Field Reports/</code>
                    </li>
                    <li>
                      <strong>Implementation Guides</strong> →{" "}
                      <code>content/library/Implementation Guides/</code>
                    </li>
                    <li>
                      <strong>Ethereum Localism articles</strong> →{" "}
                      <code>content/library/Ethereum Localism/</code>
                    </li>
                    <li>
                      <strong>GFEL docs</strong> → <code>content/library/GFEL/</code>
                    </li>
                  </ul>
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
