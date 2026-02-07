"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, BarChart3, Users, Heart, MessageSquare } from "lucide-react"

interface ImpactData {
  total: number
  impacts: Array<{
    donation: {
      id: number
      category: string
      description: string
      donor?: { username: string }
      volunteer?: { username: string } | null
      delivered_at?: string
    }
    impact: {
      id: number
      people_helped?: number
      feedback?: string
      created_at: string
    }
  }>
}

export default function ImpactPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [data, setData] = useState<ImpactData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
      return
    }
    if (user) {
      fetch("/api/impact")
        .then((r) => r.json())
        .then(setData)
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

  if (!data) return null

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
          <BarChart3 className="h-7 w-7 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-balance">Your Impact</h1>
        <p className="mt-1 text-muted-foreground">See the difference you are making</p>
      </div>

      {/* Impact summary */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex flex-col items-center p-6">
            <Users className="mb-2 h-8 w-8 text-primary" />
            <p className="text-3xl font-bold">{data.total}</p>
            <p className="text-sm text-muted-foreground">People Helped</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center p-6">
            <Heart className="mb-2 h-8 w-8 text-primary" />
            <p className="text-3xl font-bold">{data.impacts.length}</p>
            <p className="text-sm text-muted-foreground">Deliveries Made</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center p-6">
            <MessageSquare className="mb-2 h-8 w-8 text-primary" />
            <p className="text-3xl font-bold">
              {data.impacts.filter((i) => i.impact.feedback).length}
            </p>
            <p className="text-sm text-muted-foreground">Feedback Received</p>
          </CardContent>
        </Card>
      </div>

      {/* Impact details */}
      <h2 className="mb-4 text-xl font-semibold">Impact Stories</h2>
      {data.impacts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BarChart3 className="mb-4 h-12 w-12 text-muted-foreground/50" />
            <p className="text-muted-foreground">No impact stories yet. Complete deliveries to see your impact here.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {data.impacts.map((item) => (
            <Card key={item.impact.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">{item.donation.category}</Badge>
                  <span className="text-sm text-muted-foreground">
                    {item.donation.delivered_at
                      ? new Date(item.donation.delivered_at).toLocaleDateString()
                      : new Date(item.impact.created_at).toLocaleDateString()}
                  </span>
                </div>
                <CardTitle className="text-lg">{item.donation.description}</CardTitle>
                <CardDescription>
                  {item.donation.donor && `Donated by ${item.donation.donor.username}`}
                  {item.donation.volunteer && ` - Delivered by ${item.donation.volunteer.username}`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  {item.impact.people_helped && (
                    <div className="flex items-center gap-1 text-sm">
                      <Users className="h-4 w-4 text-primary" />
                      <span className="font-medium">{item.impact.people_helped}</span> people helped
                    </div>
                  )}
                </div>
                {item.impact.feedback && (
                  <div className="mt-3 rounded-lg bg-muted p-3 text-sm italic text-muted-foreground">
                    {`"${item.impact.feedback}"`}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
