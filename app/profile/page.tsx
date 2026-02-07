"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Loader2, User, Star, Award, MapPin, Mail, Phone, Calendar } from "lucide-react"

interface Certificate {
  id: number
  certificate_type: string
  issued_at: string
  donations_count: number
}

const certColors: Record<string, string> = {
  bronze: "bg-amber-700/10 text-amber-700 border-amber-700/20",
  silver: "bg-gray-400/10 text-gray-500 border-gray-400/20",
  gold: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  platinum: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
}

const nextCertLevel: Record<string, { name: string; threshold: number }> = {
  "0": { name: "Bronze", threshold: 5 },
  bronze: { name: "Silver", threshold: 20 },
  silver: { name: "Gold", threshold: 50 },
  gold: { name: "Platinum", threshold: 100 },
  platinum: { name: "Legend", threshold: 200 },
}

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [stats, setStats] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
      return
    }
    if (user) {
      Promise.all([
        fetch("/api/certificates").then((r) => r.json()),
        fetch("/api/stats").then((r) => r.json()),
      ])
        .then(([certs, stats]) => {
          setCertificates(certs)
          setStats(stats)
        })
        .finally(() => setLoading(false))
    }
  }, [user, authLoading, router])

  if (authLoading || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) return null

  const highestCert = certificates[0]?.certificate_type || "0"
  const next = nextCertLevel[highestCert]
  const deliveredCount = user.role === "donor" ? stats.delivered || 0 : stats.completed || 0
  const progress = next ? Math.min((deliveredCount / next.threshold) * 100, 100) : 100

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      {/* Profile header */}
      <Card className="mb-6">
        <CardContent className="flex flex-col items-center gap-6 p-8 sm:flex-row sm:items-start">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-primary/10 text-3xl font-bold text-primary">
            {user.username[0].toUpperCase()}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl font-bold">{user.username}</h1>
            <Badge variant="secondary" className="mt-1 capitalize">
              {user.role}
            </Badge>
            <div className="mt-4 flex flex-wrap justify-center gap-4 text-sm text-muted-foreground sm:justify-start">
              <span className="flex items-center gap-1">
                <Mail className="h-3.5 w-3.5" />
                {user.email}
              </span>
              {user.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5" />
                  {user.phone}
                </span>
              )}
              {user.city && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {user.city}
                  {user.area && `, ${user.area}`}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                Joined {new Date(user.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-2xl font-bold text-primary">
              <Star className="h-5 w-5" />
              {user.points}
            </div>
            <span className="text-xs text-muted-foreground">points</span>
          </div>
        </CardContent>
      </Card>

      {/* Certificate progress */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Certificate Progress
          </CardTitle>
          <CardDescription>
            {next
              ? `${deliveredCount}/${next.threshold} deliveries toward ${next.name} certificate`
              : "You've reached the highest level!"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={progress} className="h-3" />
          {certificates.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {certificates.map((c) => (
                <Badge key={c.id} className={certColors[c.certificate_type]}>
                  <Award className="mr-1 h-3 w-3" />
                  {c.certificate_type} Certificate
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Activity Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            {Object.entries(stats).map(([key, value]) => (
              <div key={key} className="rounded-lg bg-muted p-4 text-center">
                <p className="text-2xl font-bold">{value}</p>
                <p className="text-sm capitalize text-muted-foreground">{key}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
