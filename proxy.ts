import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  console.log(`[proxy] ${request.method} ${pathname}`);

  const response = NextResponse.next();

  response.headers.set("x-book-tracker", "active");

  return response;
}

export const config = {
  matcher: ["/library", "/stats"],
};
