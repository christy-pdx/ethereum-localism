import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: "Action Kit | Ethereum Localism",
  description:
    "Practical tools, templates, and guidance to create local impact—find a local group, host events, run funding rounds, start a Regen Hub.",
};

const kitComponents = [
  {
    title: "Find a Local Community Group",
    description: "Browse the Community Registry to discover initiatives in your region—from Portland to Rome to Taipei.",
    href: "/knowledge-garden/resources/Ethereum-Localism-Registry",
    external: false,
  },
  {
    title: "Host an Eth Localism Event",
    description: "Resources for hosting local gatherings",
    href: "/knowledge-garden/introduction/action-kit/host-an-event",
    external: false,
  },
  {
    title: "Host an AlloIRL Funding Round",
    description: "Resource for operating a local on-chain funding round",
    href: "https://irl.allo.capital",
    external: true,
  },
  {
    title: "Start a Regen Hub",
    description: "Initiate a space for your community to come together",
    href: "/knowledge-garden/library/Implementation-Guides/Regen-Hub-Playbook",
    external: false,
  },
  {
    title: "Learn from Others",
    description: "Read Field Reports from communities in Boulder, Portland, Taiwan, and beyond—real experiments and lessons learned.",
    href: "/knowledge-garden/library/Field-Reports",
    external: false,
  },
  {
    title: "Document Your Experiment",
    description: "Add your experience to the Knowledge Garden. Share what you've learned so others can build on it.",
    href: "/knowledge-garden/contribution-guide",
    external: false,
  },
];

export default function ActionKitPage() {
  return (
    <div className="min-h-screen bg-teal-50 dark:bg-stone-950">
      <Header />

      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-stone-500 dark:text-stone-400">
          <Link href="/" className="text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300">
            Home
          </Link>
          <span className="mx-2">›</span>
          <span className="text-stone-900 dark:text-stone-200">Action Kit</span>
        </nav>

        {/* Hero */}
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="font-serif text-3xl font-light text-stone-900 dark:text-teal-50 sm:text-4xl">
            Ethereum Localism Action Kit
          </h1>
          <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">2 min read</p>

          <div className="mt-8 space-y-4 text-stone-600 dark:text-stone-400">
            <p>
              The Ethereum Localism Action Kit is designed to help you bring the principles of Ethereum Localism to life in your community. Whether you&apos;re new to blockchain technology or an experienced developer, {`this kit provides practical tools, templates, and guidance to create local\u00A0impact.`}
            </p>
            <p>
              This kit is modular by design—you can use the parts that make sense for your community and adapt them to your local context. The goal is to empower you to experiment with new forms of local coordination, governance, and economic activity using Ethereum as infrastructure.
            </p>
          </div>
        </div>

        {/* Pathway */}
        <p className="mt-10 text-center text-stone-600 dark:text-stone-400">
          Find a group → Join or host an event → Share your story
        </p>

        {/* Map callout */}
        <div className="mt-8 flex justify-center">
          <Link
            href="/#local-groups-map"
            className="inline-flex items-center gap-2 rounded-full border border-teal-700/30 bg-teal-50/50 px-5 py-2.5 text-sm font-medium text-teal-800 transition hover:border-teal-700/50 hover:bg-teal-50 dark:border-teal-400/30 dark:bg-teal-950/30 dark:text-teal-200 dark:hover:border-teal-400/50 dark:hover:bg-teal-950/50"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            See who&apos;s near you
          </Link>
        </div>

        {/* Kit Components */}
        <section className="mt-14">
          <h2 className="font-serif text-2xl font-light text-stone-900 dark:text-teal-50 sm:text-3xl">
            Get Started
          </h2>
          <p className="mt-3 max-w-2xl text-stone-600 dark:text-stone-400">
            Choose the path that fits your community. Each resource includes guidance you can adapt to your local context.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {kitComponents.map((component) => (
              <div
                key={component.title}
                className="rounded-xl border border-teal-950/10 bg-white p-6 dark:border-teal-100/10 dark:bg-stone-900/30 transition hover:border-teal-700/20 dark:hover:border-teal-400/20"
              >
                <h3 className="font-semibold text-stone-900 dark:text-teal-50">
                  {component.title}
                </h3>
                <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">
                  {component.description}
                </p>
                {component.external ? (
                  <a
                    href={component.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300"
                  >
                    Explore →
                    <svg
                      className="h-3.5 w-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                ) : (
                  <Link
                    href={component.href}
                    className="mt-4 inline-flex items-center text-sm font-medium text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300"
                  >
                    Explore →
                  </Link>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Looking for Support */}
        <section className="mt-14 rounded-xl border border-teal-950/10 bg-white p-6 dark:border-teal-100/10 dark:bg-stone-900/30 sm:p-8">
          <h2 className="font-serif text-xl font-light text-stone-900 dark:text-teal-50 sm:text-2xl">
            Looking for Support?
          </h2>
          <p className="mt-3 max-w-2xl text-stone-600 dark:text-stone-400">
            Join our community chat on Telegram to connect with others interested in and implementing Ethereum Localism.
          </p>
          <a
            href="https://t.me/+5Enk4J4d98MyMDkx"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300"
          >
            Join the Telegram Group
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </section>
      </main>

      <Footer />
    </div>
  );
}
