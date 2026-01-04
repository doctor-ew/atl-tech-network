import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()

    // Check against environment variable
    const adminPassword = process.env.ADMIN_SECRET

    if (!adminPassword) {
      return NextResponse.json({ error: "Admin secret not configured" }, { status: 500 })
    }

    if (password === adminPassword) {
      // Set cookie for 7 days
      const cookieStore = await cookies()
      cookieStore.set("admin_token", adminPassword, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      })

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: "Invalid password" }, { status: 401 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
