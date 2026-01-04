import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isOnAdminPage = req.nextUrl.pathname.startsWith("/admin")
  const isOnAuthPage = req.nextUrl.pathname.startsWith("/auth")

  // Protect admin routes - require authentication
  if (isOnAdminPage && !isLoggedIn) {
    return NextResponse.redirect(new URL("/auth/signin", req.nextUrl.origin))
  }

  // Redirect authenticated users away from auth pages
  if (isOnAuthPage && isLoggedIn) {
    return NextResponse.redirect(new URL("/admin", req.nextUrl.origin))
  }

  return NextResponse.next()
})

// Configure which routes the middleware runs on
export const config = {
  matcher: [
    // Match all admin routes
    "/admin/:path*",
    // Match auth pages
    "/auth/:path*",
  ],
}

// Use Node.js runtime instead of Edge runtime for Auth.js compatibility
export const runtime = "nodejs"
