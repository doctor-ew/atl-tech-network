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

    // Update submission status
    const result = await sql`
      UPDATE submissions
      SET status = 'rejected'
      WHERE id = ${submissionId}
      RETURNING id
    `

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Submission rejected",
    })
  } catch (error) {
    console.error("Reject submission error:", error)
    return NextResponse.json(
      {
        error: "Failed to reject submission",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
