"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="ghost" size="sm" className="w-9 px-0">
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="w-9 px-0"
      title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {theme === "dark" ? (
        <Moon className="h-[1.2rem] w-[1.2rem] text-slate-300 hover:text-cyan-400 transition-colors" />
      ) : (
        <Sun className="h-[1.2rem] w-[1.2rem] text-yellow-500 hover:text-yellow-600 transition-colors" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
