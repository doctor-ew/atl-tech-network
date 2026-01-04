#!/usr/bin/env bun

import { sql } from "@vercel/postgres"
import { readFileSync } from "fs"
import { join } from "path"

async function runMigrations() {
  console.log("🚀 Running database migrations...")

  try {
    // Run initial schema
    console.log("📝 Creating tables and enums...")
    const schema = readFileSync(join(process.cwd(), "db/migrations/001_initial_schema.sql"), "utf-8")
    await sql.query(schema)
    console.log("✅ Initial schema created")

    // Run auth schema
    console.log("📝 Creating auth tables...")
    const authSchema = readFileSync(join(process.cwd(), "db/migrations/002_auth_schema.sql"), "utf-8")
    await sql.query(authSchema)
    console.log("✅ Auth schema created")

    console.log("🎉 All migrations completed successfully!")
  } catch (error) {
    console.error("❌ Migration failed:", error)
    process.exit(1)
  }
}

runMigrations()
