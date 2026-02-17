import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: "Introduction | Ethereum Localism",
  description:
    "An introduction to Ethereum Localism—bridging digital innovation with real-world impact through community-driven initiatives.",
};

export default function IntroductionPage() {
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
          <span className="text-stone-900 dark:text-stone-200">Introduction</span>
        </nav>

        <div className="mx-auto max-w-2xl text-center">
          <h1 className="font-serif text-3xl font-light text-stone-900 dark:text-teal-50 sm:text-4xl">
            An Introduction to Ethereum Localism
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-stone-600 dark:text-stone-400">
            Ethereum Localism represents a growing movement at the intersection of blockchain technology and local community empowerment. It explores how Ethereum&apos;s decentralized infrastructure can strengthen local economies, governance systems, and social networks.
          </p>
          <p className="mt-4 text-stone-600 dark:text-stone-400">
            Unlike many blockchain projects that focus primarily on global applications, Ethereum Localism emphasizes the importance of place, community, and local context. Tools and mechanisms like quadratic funding, local stablecoins, and decentralized governance expand Ethereum&apos;s utility beyond digital spaces to create tangible local impacts.
          </p>
          <blockquote className="mt-6 border-l-4 border-teal-600 pl-4 text-left italic text-stone-600 dark:border-teal-500 dark:text-stone-400">
            Ethereum Localism balances blockchain&apos;s global power and intelligence with values-aligned, on-the-ground communities that bring life to the technology—enabling an ecosystem that roots down deeper to rise up higher.
          </blockquote>
          <p className="mt-6 text-stone-600 dark:text-stone-400">
            This movement and knowledge hub only exist with your participation. Explore the full introduction, principles, and use cases in our Knowledge Garden.
          </p>
          <Link
            href="/knowledge-garden/introduction"
            className="mt-8 inline-block rounded-full bg-stone-900 px-6 py-3 text-sm font-medium text-teal-50 hover:bg-stone-800 dark:bg-teal-50 dark:text-stone-900 dark:hover:bg-teal-100"
          >
            Read full introduction →
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
