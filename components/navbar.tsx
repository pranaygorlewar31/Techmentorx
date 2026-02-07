"use client"

import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Heart, LayoutDashboard, Trophy, User, BarChart3, LogOut, Menu, X, HandHeart } from "lucide-react"
import { useState } from "react"

export function Navbar() {
  const { user, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    window.location.href = "/"
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-foreground">
          <HandHeart className="h-6 w-6 text-primary" />
          <span>Social Mentor</span>
        </Link>

        {user ? (
          <>
            {/* Desktop nav */}
            <div className="hidden items-center gap-1 md:flex">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard">
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
              </Button>
              {user.role === "donor" && (
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/donate">
                    <Heart className="h-4 w-4" />
                    Donate
                  </Link>
                </Button>
              )}
              <Button variant="ghost" size="sm" asChild>
                <Link href="/leaderboard">
                  <Trophy className="h-4 w-4" />
                  Leaderboard
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/impact">
                  <BarChart3 className="h-4 w-4" />
                  Impact
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/profile">
                  <User className="h-4 w-4" />
                  Profile
                </Link>
              </Button>
              <div className="ml-2 border-l pl-2">
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>

            {/* Mobile toggle */}
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>

            {/* Mobile nav */}
            {mobileOpen && (
              <div className="absolute left-0 top-16 w-full border-b bg-card p-4 md:hidden">
                <div className="flex flex-col gap-2">
                  <Button variant="ghost" size="sm" asChild onClick={() => setMobileOpen(false)}>
                    <Link href="/dashboard">
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Link>
                  </Button>
                  {user.role === "donor" && (
                    <Button variant="ghost" size="sm" asChild onClick={() => setMobileOpen(false)}>
                      <Link href="/donate">
                        <Heart className="h-4 w-4" />
                        Donate
                      </Link>
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" asChild onClick={() => setMobileOpen(false)}>
                    <Link href="/leaderboard">
                      <Trophy className="h-4 w-4" />
                      Leaderboard
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm" asChild onClick={() => setMobileOpen(false)}>
                    <Link href="/impact">
                      <BarChart3 className="h-4 w-4" />
                      Impact
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm" asChild onClick={() => setMobileOpen(false)}>
                    <Link href="/profile">
                      <User className="h-4 w-4" />
                      Profile
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleLogout}>
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">Log in</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/register">Get Started</Link>
            </Button>
          </div>
        )}
      </nav>
    </header>
  )
}
