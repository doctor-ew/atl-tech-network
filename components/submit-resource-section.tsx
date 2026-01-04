"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Send, CheckCircle, Calendar } from "lucide-react"
import { AnimatedCard } from "@/components/animated-card"

interface FormData {
  type: string
  name: string
  description: string
  link: string
  image: string
  conferenceDate: string
  cfpDate: string
  tags: string
  submittedBy: string
  submitterEmail: string
  website: string // Honeypot field
}

export function SubmitResourceSection() {
  const [formData, setFormData] = useState<FormData>({
    type: "",
    name: "",
    description: "",
    link: "",
    image: "",
    conferenceDate: "",
    cfpDate: "",
    tags: "",
    submittedBy: "",
    submitterEmail: "",
    website: "", // Honeypot - should stay empty
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Basic client-side validation
    if (!formData.type || !formData.name || !formData.description || !formData.link || !formData.submittedBy) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    try {
      // Prepare submission data with tags as array
      const tagsArray = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0)

      const submissionData = {
        type: formData.type,
        name: formData.name,
        description: formData.description,
        link: formData.link,
        image: formData.image || "",
        conferenceDate: formData.conferenceDate || "",
        cfpDate: formData.cfpDate || "",
        tags: tagsArray.length > 0 ? tagsArray : ["general"],
        submittedBy: formData.submittedBy,
        submitterEmail: formData.submitterEmail || "",
        website: formData.website, // Honeypot field
      }

      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      })

      const data = await response.json()

      if (response.status === 429) {
        // Rate limited
        toast({
          title: "Too Many Submissions",
          description: data.error || "Please try again later.",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      if (!response.ok) {
        // Validation or other errors
        const errorMessage = data.details
          ? Object.values(data.details)
              .map((err: any) => err._errors?.join(", "))
              .filter(Boolean)
              .join(", ")
          : data.error || "Failed to submit resource"

        toast({
          title: "Submission Failed",
          description: errorMessage,
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      // Success
      toast({
        title: "Suggestion Sent!",
        description: data.message || "Your resource suggestion has been submitted for review.",
      })

      // Reset form
      setFormData({
        type: "",
        name: "",
        description: "",
        link: "",
        image: "",
        conferenceDate: "",
        cfpDate: "",
        tags: "",
        submittedBy: "",
        submitterEmail: "",
        website: "",
      })
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="scroll-mt-20">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent graffiti-heading">
          Suggest a Resource
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Know of a great meetup, conference, or learning resource? Help grow Atlanta's tech community by suggesting it!
          All suggestions are reviewed by our team before being added to the site.
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <AnimatedCard>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="w-5 h-5 text-orange-500" />
              Resource Suggestion Form
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Honeypot field - hidden from users */}
              <input
                type="text"
                name="website"
                value={formData.website}
                onChange={(e) => handleInputChange("website", e.target.value)}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
              />

              <div className="bg-slate-100 dark:bg-slate-900/50 rounded-lg p-4 space-y-4 border border-slate-300 dark:border-slate-700">
                <h3 className="font-semibold text-sm text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                  Your Contact Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="submittedBy">Your Name *</Label>
                    <Input
                      id="submittedBy"
                      type="text"
                      placeholder="Your full name"
                      value={formData.submittedBy}
                      onChange={(e) => handleInputChange("submittedBy", e.target.value)}
                      className="focus:ring-orange-500 focus:border-orange-500"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="submitterEmail">Your Email (optional)</Label>
                    <Input
                      id="submitterEmail"
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.submitterEmail}
                      onChange={(e) => handleInputChange("submitterEmail", e.target.value)}
                      className="focus:ring-orange-500 focus:border-orange-500"
                    />
                    <p className="text-xs text-muted-foreground">
                      We'll contact you if we need more information
                    </p>
                  </div>
                </div>
              </div>

              {/* Resource Type */}
              <div className="space-y-2">
                <Label htmlFor="type">Resource Type *</Label>
                <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select resource type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="meetup">Meetup Group</SelectItem>
                    <SelectItem value="conference">Tech Conference</SelectItem>
                    <SelectItem value="online">Online Resource</SelectItem>
                    <SelectItem value="tech-hub">Tech Hub / Coworking Space</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Resource Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Resource Name *</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="e.g., Atlanta JavaScript Meetup"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="focus:ring-orange-500 focus:border-orange-500"
                  required
                />
              </div>

              {/* Website Link */}
              <div className="space-y-2">
                <Label htmlFor="link">Website Link *</Label>
                <Input
                  id="link"
                  type="url"
                  placeholder="https://example.com"
                  value={formData.link}
                  onChange={(e) => handleInputChange("link", e.target.value)}
                  className="focus:ring-orange-500 focus:border-orange-500"
                  required
                />
                <p className="text-xs text-muted-foreground">Must start with https://</p>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of the resource (at least 20 characters)"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  className="focus:ring-orange-500 focus:border-orange-500 min-h-[100px]"
                  required
                />
                <p className="text-xs text-muted-foreground">Minimum 20 characters</p>
              </div>

              {/* Image URL */}
              <div className="space-y-2">
                <Label htmlFor="image">Image URL (optional)</Label>
                <Input
                  id="image"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={formData.image}
                  onChange={(e) => handleInputChange("image", e.target.value)}
                  className="focus:ring-orange-500 focus:border-orange-500"
                />
                <p className="text-xs text-muted-foreground">Must start with https://</p>
              </div>

              {/* Conference Dates - only show for conference type */}
              {formData.type === "conference" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="conferenceDate" className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Conference Date (optional)
                    </Label>
                    <Input
                      id="conferenceDate"
                      type="date"
                      value={formData.conferenceDate}
                      onChange={(e) => handleInputChange("conferenceDate", e.target.value)}
                      className="focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cfpDate" className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Call for Proposals Deadline (optional)
                    </Label>
                    <Input
                      id="cfpDate"
                      type="date"
                      value={formData.cfpDate}
                      onChange={(e) => handleInputChange("cfpDate", e.target.value)}
                      className="focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                </>
              )}

              {/* Tags */}
              <div className="space-y-2">
                <Label htmlFor="tags">Tags *</Label>
                <Input
                  id="tags"
                  type="text"
                  placeholder="e.g., JavaScript, React, Frontend (comma-separated)"
                  value={formData.tags}
                  onChange={(e) => handleInputChange("tags", e.target.value)}
                  className="focus:ring-orange-500 focus:border-orange-500"
                  required
                />
                <p className="text-sm text-muted-foreground">Separate multiple tags with commas (max 10 tags)</p>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium py-3"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Sending Suggestion...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Suggestion
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </AnimatedCard>

        {/* Additional Info */}
        <div className="mt-8 bg-muted/50 rounded-lg p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-orange-500" />
            <h3 className="text-lg font-semibold">How It Works</h3>
          </div>
          <p className="text-muted-foreground mb-4">
            All submissions are manually reviewed by our team before being added to the site. We verify all information
            to ensure quality and accuracy. This helps us maintain a trusted resource for the Atlanta tech community.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Typical response time: 2-3 business days</span>
          </div>
        </div>
      </div>
    </section>
  )
}
