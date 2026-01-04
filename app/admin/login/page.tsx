"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AnimatedCard } from "@/components/animated-card"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock, AlertCircle } from "lucide-react"
import { toast } from "sonner"

export default function AdminLoginPage() {
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      })

      if (response.ok) {
        toast.success("Access granted", {
          description: "Redirecting to admin panel...",
        })
        router.push("/admin/submissions")
      } else {
        toast.error("Access denied", {
          description: "Invalid password",
          icon: <AlertCircle className="w-4 h-4" />,
        })
      }
    } catch (error) {
      toast.error("Error", {
        description: "Something went wrong",
        icon: <AlertCircle className="w-4 h-4" />,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <AnimatedCard>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Lock className="w-6 h-6 text-cyan-500" />
              Admin Access
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Admin Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoFocus
                />
              </div>
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? "Verifying..." : "Access Admin Panel"}
              </Button>
            </form>
          </CardContent>
        </AnimatedCard>
      </div>
    </div>
  )
}
