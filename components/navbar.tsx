"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <span className="font-bold text-xl">VeluTalks</span>
        </Link>
        <div className="flex items-center space-x-4">
          <Link href="/tech-stack">
            <Button variant="ghost">Tech Stack</Button>
          </Link>
          <Link href="/login">
            <Button variant="ghost">Login</Button>
          </Link>
          <Link href="/register">
            <Button variant="default">Sign Up</Button>
          </Link>
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
