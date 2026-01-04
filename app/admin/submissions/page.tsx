import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { sql } from "@vercel/postgres"
import { SubmissionReviewCard } from "@/components/admin/submission-review-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

export default async function SubmissionsPage({
  searchParams,
}: {
  searchParams: { status?: string }
}) {
  const session = await auth()

  if (!session) {
    redirect("/auth/signin")
  }

  const status = searchParams.status || "pending"

  // Fetch submissions with tags
  const result = await sql`
    SELECT
      s.*,
      COALESCE(
        array_agg(t.name) FILTER (WHERE t.name IS NOT NULL),
        ARRAY[]::text[]
      ) as tags
    FROM submissions s
    LEFT JOIN submission_tags st ON s.id = st.submission_id
    LEFT JOIN tags t ON st.tag_id = t.id
    WHERE s.status = ${status}
    GROUP BY s.id
    ORDER BY s.submitted_at DESC
  `

  const submissions = result.rows

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          Review Submissions
        </h1>
        <p className="text-slate-700 dark:text-slate-400">Review and moderate community submissions</p>
      </div>

      <Tabs defaultValue={status} className="w-full">
        <TabsList className="bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-700">
          <TabsTrigger value="pending" asChild>
            <a href="/admin/submissions?status=pending" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700">
              Pending
            </a>
          </TabsTrigger>
          <TabsTrigger value="approved" asChild>
            <a href="/admin/submissions?status=approved" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700">
              Approved
            </a>
          </TabsTrigger>
          <TabsTrigger value="rejected" asChild>
            <a href="/admin/submissions?status=rejected" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700">
              Rejected
            </a>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={status} className="mt-6">
          {submissions.length === 0 ? (
            <Card className="border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/50">
              <CardHeader>
                <CardTitle className="text-slate-900 dark:text-white">No submissions</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                  No {status} submissions at the moment.
                </CardDescription>
              </CardHeader>
            </Card>
          ) : (
            <div className="space-y-6">
              {submissions.map((submission: any) => (
                <SubmissionReviewCard key={submission.id} submission={submission} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
