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

  // Fetch submissions
  const result = await sql`
    SELECT * FROM submissions
    WHERE status = ${status}
    ORDER BY submitted_at DESC
  `

  const submissions = result.rows

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          Review Submissions
        </h1>
        <p className="text-slate-400">Review and moderate community submissions</p>
      </div>

      <Tabs defaultValue={status} className="w-full">
        <TabsList className="bg-slate-800 border-slate-700">
          <TabsTrigger value="pending" asChild>
            <a href="/admin/submissions?status=pending" className="data-[state=active]:bg-slate-700">
              Pending
            </a>
          </TabsTrigger>
          <TabsTrigger value="approved" asChild>
            <a href="/admin/submissions?status=approved" className="data-[state=active]:bg-slate-700">
              Approved
            </a>
          </TabsTrigger>
          <TabsTrigger value="rejected" asChild>
            <a href="/admin/submissions?status=rejected" className="data-[state=active]:bg-slate-700">
              Rejected
            </a>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={status} className="mt-6">
          {submissions.length === 0 ? (
            <Card className="border-slate-700 bg-slate-800/50">
              <CardHeader>
                <CardTitle className="text-white">No submissions</CardTitle>
                <CardDescription className="text-slate-400">
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
