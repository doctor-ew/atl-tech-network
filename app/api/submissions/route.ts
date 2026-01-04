import { NextRequest, NextResponse } from "next/server"
import { sql } from "@vercel/postgres"
import { validateSubmission } from "@/lib/validations/submission"
import { checkRateLimit, getClientIP } from "@/lib/rate-limit"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Check honeypot field first (silent rejection)
    if (body.website && body.website.length > 0) {
      console.warn("Honeypot triggered - bot detected")
      // Return success to not alert bots
      return NextResponse.json(
        {
          success: true,
          message: "Submission received! We'll review it and add it to the site soon.",
        },
        { status: 201 },
      )
    }

    // Rate limiting
    const clientIP = getClientIP(request)
    const rateLimitResult = await checkRateLimit(clientIP)

    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          error: "Too many submissions. Please try again later.",
          limit: rateLimitResult.limit,
          remaining: rateLimitResult.remaining,
          reset: new Date(rateLimitResult.reset).toISOString(),
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": rateLimitResult.limit.toString(),
            "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
            "X-RateLimit-Reset": rateLimitResult.reset.toString(),
          },
        },
      )
    }

    // Validate with Zod
    const validation = validateSubmission(body)

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validation.errors,
        },
        { status: 400 },
      )
    }

    const { type, name, description, link, image, conferenceDate, cfpDate, tags, submittedBy, submitterEmail } =
      validation.data

    // Insert submission into database
    const result = await sql`
      INSERT INTO submissions (
        type,
        name,
        description,
        link,
        image,
        conference_date,
        cfp_date,
        tags,
        submitted_by,
        submitter_email,
        status
      )
      VALUES (
        ${type},
        ${name},
        ${description},
        ${link},
        ${image || null},
        ${conferenceDate || null},
        ${cfpDate || null},
        ${tags || []},
        ${submittedBy},
        ${submitterEmail || null},
        'pending'
      )
      RETURNING id
    `

    return NextResponse.json(
      {
        success: true,
        message: "Submission received! We'll review it and add it to the site soon.",
        submissionId: result.rows[0].id,
      },
      {
        status: 201,
        headers: {
          "X-RateLimit-Limit": rateLimitResult.limit.toString(),
          "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
          "X-RateLimit-Reset": rateLimitResult.reset.toString(),
        },
      },
    )
  } catch (error) {
    console.error("Submission error:", error)
    return NextResponse.json(
      {
        error: "Failed to submit resource. Please try again later.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status") || "pending"

    // Get submissions (for admin review)
    const result = await sql`
      SELECT * FROM submissions
      WHERE status = ${status}
      ORDER BY submitted_at DESC
    `

    return NextResponse.json({
      submissions: result.rows,
    })
  } catch (error) {
    console.error("Get submissions error:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch submissions",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
