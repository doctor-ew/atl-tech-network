import { sql } from "@vercel/postgres"

export interface Resource {
  id: string
  type: "meetup" | "conference" | "online" | "tech-hub"
  name: string
  description: string
  tags: string[]
  link: string
  image?: string
  conferenceDate?: string
  cfpDate?: string
  status?: "pending" | "approved" | "rejected"
}

export async function getResources(type?: string, status: string = "approved") {
  try {
    let query
    if (type) {
      query = sql`
        SELECT r.*, ARRAY_AGG(t.name) as tags
        FROM resources r
        LEFT JOIN resource_tags rt ON r.id = rt.resource_id
        LEFT JOIN tags t ON rt.tag_id = t.id
        WHERE r.type = ${type} AND r.status = ${status}
        GROUP BY r.id
        ORDER BY r.name ASC
      `
    } else {
      query = sql`
        SELECT r.*, ARRAY_AGG(t.name) as tags
        FROM resources r
        LEFT JOIN resource_tags rt ON r.id = rt.resource_id
        LEFT JOIN tags t ON rt.tag_id = t.id
        WHERE r.status = ${status}
        GROUP BY r.id
        ORDER BY r.name ASC
      `
    }

    const result = await query
    return result.rows
  } catch (error) {
    console.error("Database query error:", error)
    // Fallback to sample data if database is not set up
    return []
  }
}

export async function createResource(resource: Omit<Resource, "id">) {
  const { type, name, description, link, image, conferenceDate, cfpDate, tags } = resource

  // Insert resource
  const result = await sql`
    INSERT INTO resources (type, name, description, link, image, conference_date, cfp_date, status)
    VALUES (${type}, ${name}, ${description}, ${link}, ${image || null}, ${conferenceDate || null}, ${cfpDate || null}, 'approved')
    RETURNING id
  `

  const resourceId = result.rows[0].id

  // Insert tags
  if (tags && tags.length > 0) {
    for (const tagName of tags) {
      // Insert tag if it doesn't exist
      await sql`
        INSERT INTO tags (name)
        VALUES (${tagName})
        ON CONFLICT (name) DO NOTHING
      `

      // Get tag id
      const tagResult = await sql`SELECT id FROM tags WHERE name = ${tagName}`
      const tagId = tagResult.rows[0].id

      // Link resource to tag
      await sql`
        INSERT INTO resource_tags (resource_id, tag_id)
        VALUES (${resourceId}, ${tagId})
      `
    }
  }

  return resourceId
}
