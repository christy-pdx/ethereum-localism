import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Commas in a path segment break Next.js matching for optional catch-all routes
 * (`[[...slug]]`): the page is prerendered but requests return 404. Stripping commas
 * matches the slug we derive from filenames (see pathToSlug in content.ts).
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!pathname.includes(",")) {
    return NextResponse.next();
  }
  const url = request.nextUrl.clone();
  url.pathname = pathname.replace(/,/g, "");
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: "/knowledge-garden/:path*",
};
