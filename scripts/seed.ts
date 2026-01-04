#!/usr/bin/env bun

import { sql } from "@vercel/postgres"
import { sampleMeetups, sampleConferences } from "@/lib/sample-data"

async function seedDatabase() {
  console.log("🌱 Seeding database with sample data...")

  try {
    // Insert meetups
    console.log("📝 Inserting meetups...")
    for (const meetup of sampleMeetups) {
      const result = await sql`
        INSERT INTO resources (type, name, description, link, image, status)
        VALUES (
          'meetup',
          ${meetup.name},
          ${meetup.description},
          ${meetup.link},
          ${meetup.image || null},
          'approved'
        )
        RETURNING id
      `
      const resourceId = result.rows[0].id

      // Insert tags
      for (const tagName of meetup.tags) {
        // Insert tag if it doesn't exist
        const tagResult = await sql`
          INSERT INTO tags (name)
          VALUES (${tagName})
          ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
          RETURNING id
        `
        const tagId = tagResult.rows[0].id

        // Link resource to tag
        await sql`
          INSERT INTO resource_tags (resource_id, tag_id)
          VALUES (${resourceId}, ${tagId})
        `
      }
    }
    console.log(`✅ Inserted ${sampleMeetups.length} meetups`)

    // Insert conferences
    console.log("📝 Inserting conferences...")
    for (const conf of sampleConferences) {
      const result = await sql`
        INSERT INTO resources (type, name, description, link, image, conference_date, cfp_date, status)
        VALUES (
          'conference',
          ${conf.name},
          ${conf.description},
          ${conf.link},
          ${conf.image || null},
          ${conf.conferenceDate || null},
          ${conf.cfpDate || null},
          'approved'
        )
        RETURNING id
      `
      const resourceId = result.rows[0].id

      // Insert tags
      for (const tagName of conf.tags) {
        const tagResult = await sql`
          INSERT INTO tags (name)
          VALUES (${tagName})
          ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
          RETURNING id
        `
        const tagId = tagResult.rows[0].id

        await sql`
          INSERT INTO resource_tags (resource_id, tag_id)
          VALUES (${resourceId}, ${tagId})
        `
      }
    }
    console.log(`✅ Inserted ${sampleConferences.length} conferences`)

    console.log("🎉 Database seeded successfully!")
  } catch (error) {
    console.error("❌ Seeding failed:", error)
    process.exit(1)
  }
}

seedDatabase()
