"use client"

import { useRef, useEffect } from "react"
import { gsap } from "gsap"
import { cn } from "@/lib/utils"

interface AnimatedCardProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

export function AnimatedCard({ children, className, delay = 0 }: AnimatedCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const card = cardRef.current
    if (!card) return

    // Entrance animation
    gsap.fromTo(
      card,
      {
        opacity: 0,
        y: 30,
        scale: 0.95,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        delay,
        ease: "power3.out",
      }
    )

    // Hover animations
    const handleMouseEnter = (e: MouseEvent) => {
      gsap.to(card, {
        y: -8,
        scale: 1.02,
        duration: 0.3,
        ease: "power2.out",
      })
      gsap.to(glowRef.current, {
        opacity: 0.6,
        duration: 0.3,
      })
    }

    const handleMouseLeave = () => {
      gsap.to(card, {
        y: 0,
        scale: 1,
        duration: 0.3,
        ease: "power2.out",
      })
      gsap.to(glowRef.current, {
        opacity: 0,
        duration: 0.3,
      })
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      gsap.to(glowRef.current, {
        x: x - 100,
        y: y - 100,
        duration: 0.3,
      })
    }

    card.addEventListener("mouseenter", handleMouseEnter)
    card.addEventListener("mouseleave", handleMouseLeave)
    card.addEventListener("mousemove", handleMouseMove)

    return () => {
      card.removeEventListener("mouseenter", handleMouseEnter)
      card.removeEventListener("mouseleave", handleMouseLeave)
      card.removeEventListener("mousemove", handleMouseMove)
    }
  }, [delay])

  return (
    <div
      ref={cardRef}
      className={cn(
        "relative overflow-hidden rounded-xl border-2 bg-gradient-to-br transition-all duration-300",
        "from-white/90 via-cyan-50/50 to-blue-50/50",
        "dark:from-slate-800/90 dark:via-cyan-900/20 dark:to-blue-900/20",
        "border-cyan-200/50 dark:border-cyan-500/30",
        "backdrop-blur-sm shadow-lg hover:shadow-2xl hover:shadow-cyan-500/20",
        className
      )}
    >
      {/* Animated glow effect */}
      <div
        ref={glowRef}
        className="absolute w-[200px] h-[200px] rounded-full bg-gradient-to-r from-cyan-400/30 to-blue-500/30 blur-2xl opacity-0 pointer-events-none"
        style={{ transform: "translate(-100px, -100px)" }}
      />

      {/* Gradient border animation */}
      <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 via-blue-500/20 to-purple-500/20 animate-gradient-shift" />
      </div>

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}
