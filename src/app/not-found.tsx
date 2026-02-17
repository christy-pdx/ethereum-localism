import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-teal-50 dark:bg-stone-950">
      <Header />

      <main className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-xl text-center">
          <p className="font-serif text-6xl text-teal-600/40 dark:text-teal-500/30" aria-hidden>
            404
          </p>
          <h1 className="mt-4 font-serif text-2xl font-light text-stone-900 dark:text-teal-50 sm:text-3xl">
            You&apos;ve wandered off the path
          </h1>
          <p className="mt-4 text-stone-600 dark:text-stone-400">
            This page doesn&apos;t exist yet—or perhaps it&apos;s still growing somewhere in the garden.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full bg-stone-900 px-6 py-3 text-sm font-medium text-teal-50 hover:bg-stone-800 dark:bg-teal-50 dark:text-stone-900 dark:hover:bg-teal-100"
            >
              Back to home
            </Link>
            <Link
              href="/knowledge-garden/introduction"
              className="inline-flex items-center justify-center rounded-full border border-stone-300 px-6 py-3 text-sm font-medium text-stone-700 hover:border-stone-400 hover:bg-stone-100 dark:border-stone-600 dark:text-stone-300 dark:hover:border-stone-500 dark:hover:bg-stone-800"
            >
              An introduction →
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
