import type { NextAuthConfig } from "next-auth"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"

export default {
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnAdminPage = nextUrl.pathname.startsWith("/admin")

      if (isOnAdminPage) {
        if (isLoggedIn) return true
        return false // Redirect unauthenticated users to login page
      }

      return true
    },
    async session({ session, user }) {
      // Add user id and profile info to session
      if (session.user) {
        session.user.id = user.id
      }
      return session
    },
  },
} satisfies NextAuthConfig
