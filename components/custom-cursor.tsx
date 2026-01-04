"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const followerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const cursor = cursorRef.current
    const follower = followerRef.current
    if (!cursor || !follower) return

    const moveCursor = (e: MouseEvent) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: "power2.out",
      })
      gsap.to(follower, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.3,
        ease: "power2.out",
      })
    }

    const handleMouseEnter = () => {
      gsap.to(cursor, { scale: 1.5, duration: 0.3 })
      gsap.to(follower, { scale: 1.5, duration: 0.3 })
    }

    const handleMouseLeave = () => {
      gsap.to(cursor, { scale: 1, duration: 0.3 })
      gsap.to(follower, { scale: 1, duration: 0.3 })
    }

    window.addEventListener("mousemove", moveCursor)

    // Add hover effect to interactive elements
    const interactiveElements = document.querySelectorAll("a, button, [role='button']")
    interactiveElements.forEach((el) => {
      el.addEventListener("mouseenter", handleMouseEnter)
      el.addEventListener("mouseleave", handleMouseLeave)
    })

    return () => {
      window.removeEventListener("mousemove", moveCursor)
      interactiveElements.forEach((el) => {
        el.removeEventListener("mouseenter", handleMouseEnter)
        el.removeEventListener("mouseleave", handleMouseLeave)
      })
    }
  }, [])

  return (
    <>
      <div
        ref={cursorRef}
        className="custom-cursor fixed w-3 h-3 pointer-events-none z-[9999] mix-blend-difference hidden md:block"
        style={{
          left: "-6px",
          top: "-6px",
        }}
      >
        <div className="w-full h-full bg-cyan-400 rounded-full" />
      </div>
      <div
        ref={followerRef}
        className="custom-cursor-follower fixed w-8 h-8 pointer-events-none z-[9998] mix-blend-difference hidden md:block"
        style={{
          left: "-16px",
          top: "-16px",
        }}
      >
        <div className="w-full h-full border-2 border-cyan-400 rounded-full opacity-50" />
      </div>
      <style jsx global>{`
        * {
          cursor: none !important;
        }
        @media (max-width: 768px) {
          * {
            cursor: auto !important;
          }
        }
      `}</style>
    </>
  )
}
