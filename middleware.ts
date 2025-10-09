import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // This is a simple middleware for MVP
  // In production, you'd verify JWT tokens here
  return NextResponse.next()
}

export const config = {
  matcher: ["/feed/:path*", "/chat/:path*", "/profile/:path*"],
}
