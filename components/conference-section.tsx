import { ResourceCard } from "./resource-card"
import { sql } from "@vercel/postgres"
import Link from "next/link"

export async function ConferenceSection() {
  // Fetch upcoming conferences from database
  const result = await sql`
    SELECT
      r.*,
      COALESCE(
        array_agg(t.name) FILTER (WHERE t.name IS NOT NULL),
        ARRAY[]::text[]
      ) as tags
    FROM resources r
    LEFT JOIN resource_tags rt ON r.id = rt.resource_id
    LEFT JOIN tags t ON rt.tag_id = t.id
    WHERE r.type = 'conference'
      AND r.status = 'approved'
      AND (r.conference_date IS NULL OR r.conference_date >= CURRENT_DATE)
    GROUP BY r.id
    ORDER BY r.conference_date ASC NULLS LAST
    LIMIT 3
  `

  const displayConferences = result.rows.map((row: any) => ({
    id: row.id,
    name: row.name,
    description: row.description,
    link: row.link,
    image: row.image || "https://placehold.co/600x400/1e293b/f97316?text=Conference",
    conferenceDate: row.conference_date,
    cfpDate: row.cfp_date,
    tags: Array.isArray(row.tags) ? row.tags : [],
    type: "conference" as const,
  }))

  return (
    <section id="conferences" className="scroll-mt-20">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-cyan-400 to-green-400 bg-clip-text text-transparent">
          Tech Conferences
        </h2>
        <p className="text-xl text-slate-700 dark:text-slate-300 max-w-3xl mx-auto">
          Attend premier tech conferences in Atlanta and the Southeast region, featuring industry leaders and
          cutting-edge topics
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {displayConferences.map((conference) => (
          <ResourceCard key={conference.id} resource={conference} />
        ))}
      </div>

      <div className="text-center">
        <Link
          href="/conferences"
          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 via-cyan-500 to-green-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:via-cyan-600 hover:to-green-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          View All Conferences
          <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>

      {/* Additional info about CFP dates */}
      <div className="mt-8 text-center">
        <p className="text-sm text-slate-600 dark:text-slate-400">CFP = Call for Proposals submission deadline</p>
      </div>
    </section>
  )
}
