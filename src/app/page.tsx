import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ExploratoryLink } from "@/components/ExploratoryLink";
import { ConfettiLink } from "@/components/ConfettiLink";
import { ConfettiTrigger } from "@/components/ConfettiTrigger";
import { InteractiveMapClient } from "@/components/InteractiveMapClient";
import { RotatingFeaturedResources } from "@/components/RotatingFeaturedResources";
import { getFeaturedResources } from "@/lib/featured-resources";
import { mapLocations } from "@/lib/map-locations";

const knowledgeCards = [
  {
    title: "Introduction",
    description: "An introduction to Ethereum Localism.",
    href: "/knowledge-garden/introduction",
    cta: "Read →",
  },
  {
    title: "Library",
    description: "Curated collection of resources foundational to the movement.",
    href: "/knowledge-garden/library",
    cta: "Learn →",
  },
  {
    title: "Resources",
    description: "Tools, templates, and community to support your localism work.",
    href: "/knowledge-garden/resources",
    cta: "Explore →",
  },
  {
    title: "Action Kit",
    description: "Get started creating local impact, powered by Ethereum.",
    href: "/action-kit",
    cta: "Act →",
  },
];

const getInvolvedCards = [
  {
    title: "Find a Local Community Group",
    description: "Browse our Community Registry to discover Ethereum Localism initiatives in your region—from Portland to Rome to Taipei.",
    links: [
      { href: "/knowledge-garden/resources/Ethereum-Localism-Registry", label: "View Community Registry →" },
    ],
  },
  {
    title: "Connect",
    description: "Join the conversation in our Telegram chat to connect with other Ethereum Localists.",
    links: [
      { href: "https://t.me/+5Enk4J4d98MyMDkx", label: "Join on Telegram →" },
    ],
  },
  {
    title: "Contribute",
    description: "Add your experience and expertise to our Knowledge Garden.",
    links: [{ href: "/knowledge-garden/contribution-guide", label: "Contribution Guide →" }],
  },
];

export default function Home() {
  const featuredResources = getFeaturedResources();
  return (
    <div className="min-h-screen bg-teal-50 dark:bg-stone-950">
      <Header />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="relative aspect-[3/1] w-full min-h-[min(420px,85vh)] sm:min-h-[min(480px,80vh)]">
            <Image
              src="/hero-graphic.png"
              alt=""
              fill
              className="object-cover object-top"
              priority
              sizes="100vw"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-teal-50/85 via-teal-50/60 to-teal-50/45 dark:from-stone-950/85 dark:via-stone-950/65 dark:to-stone-950/50"
              aria-hidden
            />
          </div>
          <div className="absolute inset-0 flex items-center justify-center overflow-y-auto overflow-x-hidden px-5 py-8 sm:overflow-visible sm:px-6 sm:py-10">
            <div className="w-full min-w-0 max-w-3xl break-words py-4 text-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)] dark:drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] sm:py-0">
              <h1 className="font-serif text-3xl font-light tracking-tight text-stone-900 dark:text-teal-50 sm:text-4xl lg:text-5xl xl:text-6xl">
                Ethereum Localism
              </h1>
              <p className="mt-4 text-base leading-relaxed text-stone-700 dark:text-teal-100 sm:mt-6 sm:text-lg lg:text-xl">
                Ethereum Localism connects digital tools with on-the-ground action, empowering communities to build more resilient local economies through local currencies and marketplaces, innovative funding models, community-led governance, and more.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-4 sm:mt-8 sm:gap-6">
                <Link
                  href="/introduction"
                  className="text-base font-medium text-teal-800 underline decoration-teal-700/60 underline-offset-4 hover:decoration-teal-700 dark:text-teal-200 dark:decoration-teal-300/60 dark:hover:decoration-teal-300"
                >
                  An Introduction to Ethereum Localism →
                </Link>
                <Link
                  href="/knowledge-garden/resources/Ethereum-Localism-Registry"
                  className="text-base font-medium text-teal-800 underline decoration-teal-700/60 underline-offset-4 hover:decoration-teal-700 dark:text-teal-200 dark:decoration-teal-300/60 dark:hover:decoration-teal-300"
                >
                  Find a local community group →
                </Link>
              </div>
              <p className="mt-8 text-base font-medium text-teal-800 sm:mt-10 dark:text-teal-200">
                Join the movement!{" "}
                <ConfettiTrigger>#ethereumlocalism</ConfettiTrigger>
              </p>
            </div>
          </div>
        </section>

        {/* Body sections with parallax background - desktop only; mobile uses clean solid background */}
        <div className="relative bg-teal-50 dark:bg-stone-950 body-parallax-bg">
          {/* Gradient overlay for light/dark mode - desktop only, when image is shown */}
          <div
            className="pointer-events-none absolute inset-0 hidden bg-gradient-to-b from-teal-50/75 via-teal-50/55 to-teal-50/75 md:block dark:from-stone-950/75 dark:via-stone-950/55 dark:to-stone-950/75"
            aria-hidden
          />

          <div className="relative z-10">
        {/* Knowledge Garden */}
        <section className="border-y border-teal-950/10 bg-white px-4 py-16 dark:border-teal-100/10 dark:bg-stone-900/30 sm:px-6 sm:py-24 md:bg-white/70 md:backdrop-blur-sm dark:md:bg-stone-900/40">
          <div className="mx-auto max-w-5xl">
            <h2 className="font-serif text-2xl font-light text-stone-900 dark:text-teal-50 sm:text-3xl">
              Explore Our Digital Knowledge Garden
            </h2>
            <p className="mt-4 max-w-2xl text-stone-600 dark:text-stone-400">
              An interconnected collection of ideas, concepts, and resources on Ethereum Localism. The Knowledge Garden grows through community contributions and provides a rich, networked understanding of the movement.
            </p>
            <p className="mt-2 italic text-stone-500 dark:text-stone-500">
              What is heavy should be local. What is light should be global and shared.
            </p>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {knowledgeCards.map((card) => (
                <div
                  key={card.title}
                  className="rounded-lg border border-teal-950/10 bg-teal-50/50 p-6 transition hover:border-teal-700/30 dark:border-teal-100/10 dark:bg-stone-900/50 dark:hover:border-teal-400/20"
                >
                  <h3 className="font-semibold text-stone-900 dark:text-teal-50">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">
                    {card.description}
                  </p>
                  {card.href === "/action-kit" ? (
                    <ConfettiLink
                      href={card.href}
                      className="mt-4 inline-block text-sm font-medium text-teal-700 hover:text-teal-800 dark:text-teal-300 dark:hover:text-teal-200"
                    >
                      {card.cta}
                    </ConfettiLink>
                  ) : (
                    <Link
                      href={card.href}
                      className="mt-4 inline-block text-sm font-medium text-teal-700 hover:text-teal-800 dark:text-teal-300 dark:hover:text-teal-200"
                    >
                      {card.cta}
                    </Link>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <ExploratoryLink
                href="/knowledge-garden"
                className="bg-stone-900 text-teal-50 hover:bg-stone-800 dark:bg-teal-50 dark:text-stone-900 dark:hover:bg-teal-100"
              >
                Explore the Garden
              </ExploratoryLink>
              <Link
                href="/knowledge-garden/contribution-guide"
                className="inline-flex items-center justify-center rounded-full border border-stone-300 px-6 py-3 text-sm font-medium text-stone-700 hover:border-stone-400 hover:bg-stone-100 dark:border-stone-600 dark:text-stone-300 dark:hover:border-stone-500 dark:hover:bg-stone-800"
              >
                Contribute
              </Link>
            </div>

            <div id="local-groups-map" className="mt-12 rounded-xl border border-teal-700/20 bg-teal-50/80 p-6 dark:border-teal-400/20 dark:bg-teal-950/30 sm:p-8">
              <h3 className="font-serif text-xl font-light text-stone-900 dark:text-teal-50 sm:text-2xl">
                Find a Local Community Group Near You
              </h3>
              <p className="mt-2 max-w-xl text-stone-600 dark:text-stone-400">
                Connect with Ethereum Localism communities across Asia, Europe, North America, and South America. Explore the map and browse the full registry to find a group in your region.
              </p>
              <InteractiveMapClient locations={mapLocations} />
              <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/knowledge-garden/resources/Ethereum-Localism-Registry"
                  className="inline-flex items-center justify-center rounded-full bg-stone-900 px-5 py-2.5 text-sm font-medium text-teal-50 hover:bg-stone-800 dark:bg-teal-50 dark:text-stone-900 dark:hover:bg-teal-100"
                >
                  Browse Community Registry →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Get Involved */}
        <section className="px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-5xl">
            <h2 className="font-serif text-2xl font-light text-stone-900 dark:text-teal-50 sm:text-3xl">
              Get Involved
            </h2>
            <p className="mt-4 max-w-2xl text-stone-600 dark:text-stone-400">
              Join the growing community network of Ethereum Localists working toward more resilient, equitable, and regenerative local systems.
            </p>

            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              {getInvolvedCards.map((card) => (
                <div
                  key={card.title}
                  className="rounded-lg border border-teal-950/10 bg-white p-6 dark:border-teal-100/10 dark:bg-stone-900/30 md:bg-white/80 md:backdrop-blur-sm dark:md:bg-stone-900/40"
                >
                  <h3 className="font-semibold text-stone-900 dark:text-teal-50">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">
                    {card.description}
                  </p>
                  <div className="mt-4 flex flex-col gap-2">
                    {card.links.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        target={link.href.startsWith("http") ? "_blank" : undefined}
                        rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="text-sm font-medium text-teal-700 hover:text-teal-800 dark:text-teal-300 dark:hover:text-teal-200"
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="relative mt-12 aspect-[16/9] overflow-hidden rounded-lg">
              <Image
                src="/knowledge-garden/assets/gfel-bouldercircle.jpg"
                alt="GFEL Boulder community circle"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 1024px"
              />
            </div>
          </div>
        </section>

        {/* Featured: Rotating resources */}
        <section className="border-t border-teal-950/10 bg-stone-100 px-4 py-16 dark:border-teal-100/10 dark:bg-stone-900/50 sm:px-6 sm:py-24 md:bg-stone-100/70 md:backdrop-blur-sm dark:md:bg-stone-900/40">
          <div className="mx-auto max-w-5xl">
            <h2 className="font-serif text-2xl font-light text-stone-900 dark:text-teal-50 sm:text-3xl">
              Featured Resource
            </h2>
            <div className="mt-10">
                <RotatingFeaturedResources
                resources={featuredResources}
                intervalSeconds={6}
              />
            </div>
          </div>
        </section>

        {/* Keep Reading - Book */}
        <section className="border-t border-teal-950/10 px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-5xl">
            <h2 className="font-serif text-2xl font-light text-stone-900 dark:text-teal-50 sm:text-3xl">
              Keep Reading
            </h2>
            <div className="mt-10 flex flex-col gap-8 md:flex-row md:items-start">
              <div className="shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/knowledge-garden/assets/ELbookcover.png"
                  alt="Ethereum Localism: Grounding the Future of Coordination - book cover"
                  width={280}
                  height={420}
                  className="rounded-lg object-cover"
                />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-stone-900 dark:text-teal-50">
                  Ethereum Localism: Grounding the Future of Coordination
                </h3>
                <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
                  Collated by The Open Machine (February 2025)
                </p>
                <p className="mt-4 text-stone-600 dark:text-stone-400">
                  Explore the book as navigable Knowledge Garden pages, buy a physical copy, download the PDF, or claim a free NFT version on Manifold.
                </p>
                <div className="mt-6 flex flex-wrap gap-4">
                  <Link
                    href="/knowledge-garden/library/Ethereum-Localism/ethereum-localism-book"
                    className="inline-block rounded-full bg-stone-900 px-5 py-2.5 text-sm font-medium text-teal-50 hover:bg-stone-800 dark:bg-teal-50 dark:text-stone-900 dark:hover:bg-teal-100"
                  >
                    Start Reading →
                  </Link>
                  <a
                    href="https://www.blurb.com/b/12470725-ethereum-localism"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block rounded-full border border-stone-300 px-5 py-2.5 text-sm font-medium text-stone-700 hover:border-stone-400 dark:border-stone-600 dark:text-stone-300"
                  >
                    Buy Physical Copy
                  </a>
                  <a
                    href="https://qxvqdga4v2uhlcgh7bvl5m6rukrhmesy6uzingqov76jw5miy3ka.arweave.net/hesBmByuqHWIx_hqvrPRoqJ2Elj1MoaaDq_8m3WIxtQ"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block rounded-full border border-stone-300 px-5 py-2.5 text-sm font-medium text-stone-700 hover:border-stone-400 dark:border-stone-600 dark:text-stone-300"
                  >
                    Download PDF
                  </a>
                  <a
                    href="https://app.manifold.xyz/c/ethereum-localism"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block rounded-full border border-stone-300 px-5 py-2.5 text-sm font-medium text-stone-700 hover:border-stone-400 dark:border-stone-600 dark:text-stone-300"
                  >
                    Claim NFT
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
