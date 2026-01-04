import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { sql } from "@vercel/postgres"

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const submissionId = parseInt(params.id)

    if (isNaN(submissionId)) {
      return NextResponse.json(
        { error: "Invalid submission ID" },
        { status: 400 }
      )
    }

    // Get the submission
    const submission = await sql`
      SELECT * FROM submissions WHERE id = ${submissionId}
    `

    if (submission.rows.length === 0) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 }
      )
    }

    const sub = submission.rows[0]

    // Insert into resources table
    await sql`
      INSERT INTO resources (
        type,
        name,
        description,
        link,
        image,
        conference_date,
        cfp_date,
        tags
      )
      VALUES (
        ${sub.type},
        ${sub.name},
        ${sub.description},
        ${sub.link},
        ${sub.image},
        ${sub.conference_date},
        ${sub.cfp_date},
        ${sub.tags}
      )
    `

    // Update submission status
    await sql`
      UPDATE submissions
      SET status = 'approved'
      WHERE id = ${submissionId}
    `

    return NextResponse.json({
      success: true,
      message: "Submission approved and added to resources",
    })
  } catch (error) {
    console.error("Approve submission error:", error)
    return NextResponse.json(
      {
        error: "Failed to approve submission",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
