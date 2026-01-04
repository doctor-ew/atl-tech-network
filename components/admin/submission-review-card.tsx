"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, ExternalLink, Calendar, User, Mail } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface Submission {
  id: number
  type: string
  name: string
  description: string
  link: string
  image?: string
  conference_date?: string
  cfp_date?: string
  tags: string[]
  submitted_by: string
  submitter_email?: string
  status: string
  submitted_at: string
}

export function SubmissionReviewCard({ submission }: { submission: Submission }) {
  const [isProcessing, setIsProcessing] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleApprove = async () => {
    setIsProcessing(true)
    try {
      const response = await fetch(`/api/admin/submissions/${submission.id}/approve`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to approve submission")
      }

      toast({
        title: "Approved!",
        description: `${submission.name} has been approved and added to the site.`,
      })

      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve submission. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleReject = async () => {
    setIsProcessing(true)
    try {
      const response = await fetch(`/api/admin/submissions/${submission.id}/reject`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to reject submission")
      }

      toast({
        title: "Rejected",
        description: `${submission.name} has been rejected.`,
      })

      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject submission. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const typeColors: Record<string, string> = {
    meetup: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    conference: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    online: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    "tech-hub": "bg-green-500/10 text-green-500 border-green-500/20",
  }

  return (
    <Card className="border-slate-700 bg-slate-800/50">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge className={typeColors[submission.type] || "bg-slate-500/10 text-slate-500"}>
                {submission.type}
              </Badge>
              <span className="text-xs text-slate-400">
                Submitted {new Date(submission.submitted_at).toLocaleDateString()}
              </span>
            </div>
            <CardTitle className="text-white text-xl">{submission.name}</CardTitle>
          </div>
        </div>
        <CardDescription className="text-slate-300 mt-2">{submission.description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Link */}
        <div className="flex items-center gap-2 text-sm">
          <ExternalLink className="w-4 h-4 text-cyan-400" />
          <a
            href={submission.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:text-cyan-300 hover:underline"
          >
            {submission.link}
          </a>
        </div>

        {/* Conference Dates */}
        {(submission.conference_date || submission.cfp_date) && (
          <div className="flex flex-wrap gap-4 text-sm text-slate-400">
            {submission.conference_date && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Event: {new Date(submission.conference_date).toLocaleDateString()}</span>
              </div>
            )}
            {submission.cfp_date && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>CFP: {new Date(submission.cfp_date).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        )}

        {/* Tags */}
        {submission.tags && submission.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {submission.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="border-slate-600 text-slate-300">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Submitter Info */}
        <div className="pt-4 border-t border-slate-700 space-y-2 text-sm text-slate-400">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span>Submitted by: {submission.submitted_by}</span>
          </div>
          {submission.submitter_email && (
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <a href={`mailto:${submission.submitter_email}`} className="hover:text-cyan-400">
                {submission.submitter_email}
              </a>
            </div>
          )}
        </div>
      </CardContent>

      {submission.status === "pending" && (
        <CardFooter className="flex gap-3 border-t border-slate-700 pt-6">
          <Button
            onClick={handleApprove}
            disabled={isProcessing}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Approve
          </Button>
          <Button
            onClick={handleReject}
            disabled={isProcessing}
            variant="destructive"
            className="flex-1"
          >
            <XCircle className="w-4 h-4 mr-2" />
            Reject
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
