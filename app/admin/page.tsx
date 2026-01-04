import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Clock, XCircle, Inbox } from "lucide-react"
import Link from "next/link"
import { sql } from "@vercel/postgres"

export default async function AdminPage() {
  const session = await auth()

  if (!session) {
    redirect("/auth/signin")
  }

  // Get submission counts
  const pendingCount = await sql`SELECT COUNT(*) as count FROM submissions WHERE status = 'pending'`
  const approvedCount = await sql`SELECT COUNT(*) as count FROM submissions WHERE status = 'approved'`
  const rejectedCount = await sql`SELECT COUNT(*) as count FROM submissions WHERE status = 'rejected'`

  const stats = [
    {
      title: "Pending Review",
      count: pendingCount.rows[0].count,
      icon: Clock,
      color: "text-yellow-500",
      href: "/admin/submissions?status=pending",
    },
    {
      title: "Approved",
      count: approvedCount.rows[0].count,
      icon: CheckCircle,
      color: "text-green-500",
      href: "/admin/submissions?status=approved",
    },
    {
      title: "Rejected",
      count: rejectedCount.rows[0].count,
      icon: XCircle,
      color: "text-red-500",
      href: "/admin/submissions?status=rejected",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          Admin Dashboard
        </h1>
        <p className="text-slate-400">Welcome back, {session.user?.name}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-slate-700 bg-slate-800/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-200">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stat.count}</div>
              <Button asChild variant="link" className="px-0 text-cyan-400 hover:text-cyan-300 mt-2">
                <Link href={stat.href}>View all →</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="border-slate-700 bg-slate-800/50">
        <CardHeader>
          <CardTitle className="text-white">Quick Actions</CardTitle>
          <CardDescription className="text-slate-400">Common admin tasks</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <Button asChild className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600">
            <Link href="/admin/submissions">
              <Inbox className="w-4 h-4 mr-2" />
              Review Submissions
            </Link>
          </Button>
          <Button asChild variant="outline" className="border-slate-600 text-slate-200 hover:bg-slate-700">
            <Link href="/">View Public Site</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
