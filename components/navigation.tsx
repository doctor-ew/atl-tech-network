"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import Link from "next/link"
import { UserNav } from "@/components/auth/user-nav"
import { ThemeToggle } from "@/components/theme-toggle"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { href: "/meetups", label: "Meetups" },
    { href: "/conferences", label: "Conferences" },
    { href: "/tech-hubs", label: "Tech Hubs" },
    { href: "/resources", label: "Resources" },
    { href: "/about", label: "About" },
    { href: "/#contact", label: "Submit" },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:supports-[backdrop-filter]:bg-slate-900/80 border-b border-slate-200 dark:border-slate-700 shadow-neon transition-colors">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent graffiti-heading cursor-pointer">
                ATL Tech
              </h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-2">
            <div className="flex items-baseline space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 focus-urban"
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <ThemeToggle />
            <UserNav />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
              className="focus-urban"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden animate-fade-in-up">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-slate-700">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-slate-300 hover:text-cyan-400 block px-3 py-2 rounded-md text-base font-medium transition-all duration-200 hover:bg-slate-800/50 focus-urban"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="px-3 py-2 border-t border-slate-700 mt-2 pt-4 flex items-center gap-3">
                <ThemeToggle />
                <UserNav />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
