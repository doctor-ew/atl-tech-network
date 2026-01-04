import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

// Create Redis client
// If Upstash Redis not configured, use in-memory fallback for local dev
let redis: Redis | undefined
let ratelimit: Ratelimit | undefined

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  })

  // Create rate limiter: 3 requests per hour
  ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(3, "1 h"),
    analytics: true,
    prefix: "@upstash/ratelimit",
  })
}

/**
 * Rate limit checker for submissions
 * @param identifier - IP address or unique identifier
 * @returns Object with success status and limit info
 */
export async function checkRateLimit(identifier: string) {
  // If rate limiting not configured, allow all requests in dev
  if (!ratelimit) {
    console.warn("Rate limiting not configured - allowing all requests")
    return {
      success: true,
      limit: 999,
      remaining: 999,
      reset: Date.now() + 3600000,
    }
  }

  const { success, limit, remaining, reset } = await ratelimit.limit(identifier)

  return {
    success,
    limit,
    remaining,
    reset,
  }
}

/**
 * Get client IP from request
 */
export function getClientIP(request: Request): string {
  // Try to get real IP from headers (Vercel forwards real IP)
  const forwardedFor = request.headers.get("x-forwarded-for")
  const realIp = request.headers.get("x-real-ip")

  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim()
  }

  if (realIp) {
    return realIp.trim()
  }

  // Fallback
  return "unknown"
}
