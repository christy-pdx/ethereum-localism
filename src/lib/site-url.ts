/** Canonical site origin for metadata, sitemap, and structured data. */
export function getSiteUrl(): string {
  return process.env.SITE_URL ?? "https://www.ethereumlocalism.xyz";
}
