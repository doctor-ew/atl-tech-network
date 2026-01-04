import { sql } from "@vercel/postgres"

async function createSubmissionTags() {
  try {
    console.log("=' Creating submission_tags junction table...")

    await sql`
      CREATE TABLE IF NOT EXISTS submission_tags (
        id SERIAL PRIMARY KEY,
        submission_id INTEGER NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
        tag_id INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(submission_id, tag_id)
      )
    `

    console.log("=Ý Creating index...")
    await sql`CREATE INDEX IF NOT EXISTS idx_submission_tags_submission_id ON submission_tags(submission_id)`
    await sql`CREATE INDEX IF NOT EXISTS idx_submission_tags_tag_id ON submission_tags(tag_id)`

    console.log(" submission_tags table created successfully!")
    console.log("<‰ Admin panel should work now!")

    process.exit(0)
  } catch (error) {
    console.error("L Failed to create table:", error)
    process.exit(1)
  }
}

createSubmissionTags()
