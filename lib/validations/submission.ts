import { z } from "zod"

// Resource types
export const resourceTypeSchema = z.enum(["meetup", "conference", "online", "tech-hub"])

// Submission validation schema
export const submissionSchema = z.object({
  type: resourceTypeSchema,
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(255, "Name must be less than 255 characters")
    .trim(),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters")
    .max(2000, "Description must be less than 2000 characters")
    .trim(),
  link: z
    .string()
    .url("Must be a valid URL")
    .startsWith("https://", "URL must use HTTPS")
    .max(500, "URL must be less than 500 characters"),
  image: z
    .string()
    .url("Image must be a valid URL")
    .startsWith("https://", "Image URL must use HTTPS")
    .max(500, "Image URL must be less than 500 characters")
    .optional()
    .or(z.literal("")),
  conferenceDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
    .optional()
    .or(z.literal("")),
  cfpDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
    .optional()
    .or(z.literal("")),
  tags: z
    .array(z.string().min(1).max(50))
    .min(1, "At least one tag is required")
    .max(10, "Maximum 10 tags allowed"),
  submittedBy: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(255, "Name must be less than 255 characters")
    .trim(),
  submitterEmail: z
    .string()
    .email("Must be a valid email address")
    .max(255, "Email must be less than 255 characters")
    .optional()
    .or(z.literal("")),
  // Honeypot field - must be empty
  website: z
    .string()
    .max(0, "This field must be empty")
    .optional()
    .or(z.literal("")),
})

export type SubmissionInput = z.infer<typeof submissionSchema>

// Validation with custom error formatting
export function validateSubmission(data: unknown) {
  const result = submissionSchema.safeParse(data)

  if (!result.success) {
    const errors = result.error.format()
    return {
      success: false as const,
      errors,
    }
  }

  return {
    success: true as const,
    data: result.data,
  }
}
