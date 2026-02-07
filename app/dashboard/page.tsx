"use client"

import React from "react"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Package,
  Clock,
  CheckCircle2,
  MapPin,
  Loader2,
  Heart,
  Truck,
  ArrowRight,
} from "lucide-react"

interface Donation {
  id: number
  category: string
  description: string
  quantity?: string
  pickup_address?: string
  city?: string
  area?: string
  status: string
  created_at: string
  distance?: number
  donor?: { username: string; city?: string }
  volunteer?: { username: string } | null
}

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  assigned: "bg-blue-100 text-blue-800 border-blue-200",
  collected: "bg-indigo-100 text-indigo-800 border-indigo-200",
  delivered: "bg-emerald-100 text-emerald-800 border-emerald-200",
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<Record<string, number>>({})
  const [donations, setDonations] = useState<Donation[]>([])
  const [nearbyDonations, setNearbyDonations] = useState<Donation[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    try {
      const [statsRes, donationsRes] = await Promise.all([
        fetch("/api/stats"),
        fetch("/api/donations"),
      ])
      if (statsRes.ok) setStats(await statsRes.json())
      if (donationsRes.ok) setDonations(await donationsRes.json())

      if (user?.role === "volunteer") {
        const nearbyRes = await fetch("/api/donations/nearby")
        if (nearbyRes.ok) setNearbyDonations(await nearbyRes.json())
      }
    } catch (err) {
      console.error("Failed to fetch data", err)
    } finally {
      setLoading(false)
    }
  }, [user?.role])

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
      return
    }
    if (user) {
      fetchData()
    }
  }, [user, authLoading, router, fetchData])

  const handleAccept = async (donationId: number) => {
    const res = await fetch(`/api/donations/${donationId}/accept`, { method: "POST" })
    if (res.ok) {
      fetchData()
    }
  }

  const handleCollect = async (donationId: number) => {
    const res = await fetch(`/api/donations/${donationId}/collect`, { method: "POST" })
    if (res.ok) {
      fetchData()
    }
  }

  if (authLoading || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-balance">
          Welcome back, {user.username}
        </h1>
        <p className="mt-1 text-muted-foreground">
          {user.role === "donor"
            ? "Manage your donations and track their delivery."
            : user.role === "volunteer"
            ? "Find nearby donations and help deliver them."
            : "Overview of all platform activity."}
        </p>
      </div>

      {/* Stats cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {user.role === "donor" && (
          <>
            <StatCard icon={<Package />} label="Total Donations" value={stats.total || 0} />
            <StatCard icon={<Clock />} label="Pending" value={stats.pending || 0} />
            <StatCard icon={<CheckCircle2 />} label="Delivered" value={stats.delivered || 0} />
          </>
        )}
        {user.role === "volunteer" && (
          <>
            <StatCard icon={<MapPin />} label="Available Nearby" value={stats.available || 0} />
            <StatCard icon={<Truck />} label="In Progress" value={stats.assigned || 0} />
            <StatCard icon={<CheckCircle2 />} label="Completed" value={stats.completed || 0} />
          </>
        )}
        {user.role === "admin" && (
          <>
            <StatCard icon={<Package />} label="Total Users" value={stats.users || 0} />
            <StatCard icon={<Heart />} label="Total Donations" value={stats.donations || 0} />
            <StatCard icon={<CheckCircle2 />} label="Delivered" value={stats.delivered || 0} />
          </>
        )}
      </div>

      {/* Quick action */}
      {user.role === "donor" && (
        <div className="mb-8">
          <Button asChild size="lg">
            <Link href="/donate">
              <Heart className="h-4 w-4" />
              Create New Donation
            </Link>
          </Button>
        </div>
      )}

      {/* Nearby donations for volunteers */}
      {user.role === "volunteer" && nearbyDonations.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-4 text-xl font-semibold">Nearby Donations</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {nearbyDonations.map((d) => (
              <Card key={d.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{d.category}</Badge>
                    <span className="text-sm text-muted-foreground">{d.distance} km away</span>
                  </div>
                  <CardTitle className="text-lg">{d.description}</CardTitle>
                  <CardDescription>
                    {d.quantity && `Qty: ${d.quantity}`}
                    {d.donor && ` - by ${d.donor.username}`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-3 flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {d.pickup_address || `${d.area}, ${d.city}`}
                  </div>
                  <Button size="sm" className="w-full" onClick={() => handleAccept(d.id)}>
                    Accept Donation
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* My donations list */}
      <section>
        <h2 className="mb-4 text-xl font-semibold">
          {user.role === "donor" ? "Your Donations" : user.role === "volunteer" ? "Your Assignments" : "All Donations"}
        </h2>
        {donations.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Package className="mb-4 h-12 w-12 text-muted-foreground/50" />
              <p className="text-muted-foreground">No donations yet.</p>
              {user.role === "donor" && (
                <Button asChild className="mt-4 bg-transparent" variant="outline">
                  <Link href="/donate">Create your first donation</Link>
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {donations.map((d) => (
              <Card key={d.id}>
                <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="secondary">{d.category}</Badge>
                      <Badge className={statusColors[d.status]}>{d.status}</Badge>
                    </div>
                    <p className="mt-1 font-medium">{d.description}</p>
                    <p className="text-sm text-muted-foreground">
                      {d.quantity && `Qty: ${d.quantity} - `}
                      {new Date(d.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {user.role === "volunteer" && d.status === "assigned" && (
                      <Button size="sm" onClick={() => handleCollect(d.id)}>
                        Mark Collected
                      </Button>
                    )}
                    {user.role === "volunteer" && d.status === "collected" && (
                      <Button size="sm" asChild>
                        <Link href={`/deliver/${d.id}`}>
                          Deliver
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-6">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  )
}
