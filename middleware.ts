import { auth } from "@/auth"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isOnAdminPage = req.nextUrl.pathname.startsWith("/admin")

  // Protect admin routes - require authentication
  if (isOnAdminPage && !isLoggedIn) {
    return Response.redirect(new URL("/auth/signin", req.nextUrl.origin))
  }

  return
})

// Configure which routes the middleware runs on
export const config = {
  matcher: [
    // Match all admin routes
    "/admin/:path*",
  ],
}

// Use Node.js runtime instead of Edge runtime for Auth.js compatibility
export const runtime = "nodejs"
