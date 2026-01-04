import { sql } from "@vercel/postgres"
import { readFileSync } from "fs"
import { join } from "path"

async function fixAuthSchema() {
  try {
    console.log("=' Fixing Auth.js schema...")

    const migrationPath = join(process.cwd(), "db/migrations/003_fix_auth_schema.sql")
    const schema = readFileSync(migrationPath, "utf-8")

    console.log("=Ý Executing schema fix...")
    await sql.query(schema)

    console.log(" Auth schema fixed successfully!")
    console.log("<‰ You can now sign in with GitHub!")

    process.exit(0)
  } catch (error) {
    console.error("L Schema fix failed:", error)
    process.exit(1)
  }
}

fixAuthSchema()
