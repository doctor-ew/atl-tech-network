"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { signOut, useSession } from "next-auth/react"
import Link from "next/link"
import { LogIn, LogOut, Settings, User } from "lucide-react"

export function UserNav() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return (
      <div className="w-8 h-8 rounded-full bg-slate-700 animate-pulse" />
    )
  }

  if (!session?.user) {
    return (
      <Button asChild variant="outline" size="sm" className="border-cyan-400 text-cyan-400 hover:bg-cyan-400/10">
        <Link href="/auth/signin">
          <LogIn className="w-4 h-4 mr-2" />
          Sign In
        </Link>
      </Button>
    )
  }

  const initials = session.user.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || session.user.email?.[0].toUpperCase() || "U"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={session.user.image || ""} alt={session.user.name || ""} />
            <AvatarFallback className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-slate-800 border-slate-700" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none text-white">{session.user.name}</p>
            <p className="text-xs leading-none text-slate-400">{session.user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-slate-700" />
        <DropdownMenuItem asChild className="text-slate-300 hover:text-white hover:bg-slate-700">
          <Link href="/profile">
            <User className="mr-2 h-4 w-4" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="text-slate-300 hover:text-white hover:bg-slate-700">
          <Link href="/settings">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-slate-700" />
        <DropdownMenuItem
          onClick={() => signOut({ callbackUrl: "/" })}
          className="text-red-400 hover:text-red-300 hover:bg-slate-700"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
