"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Trophy, Medal, Star } from "lucide-react"

interface LeaderUser {
  id: number
  username: string
  points: number
  city?: string
  role: string
}

export default function LeaderboardPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [donors, setDonors] = useState<LeaderUser[]>([])
  const [volunteers, setVolunteers] = useState<LeaderUser[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
      return
    }
    if (user) {
      fetch("/api/leaderboard")
        .then((r) => r.json())
        .then((data) => {
          setDonors(data.donors || [])
          setVolunteers(data.volunteers || [])
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

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
          <Trophy className="h-7 w-7 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-balance">Leaderboard</h1>
        <p className="mt-1 text-muted-foreground">Top contributors making a difference</p>
      </div>

      <Tabs defaultValue="donors">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="donors">Top Donors</TabsTrigger>
          <TabsTrigger value="volunteers">Top Volunteers</TabsTrigger>
        </TabsList>

        <TabsContent value="donors">
          <LeaderList users={donors} currentUserId={user?.id} />
        </TabsContent>

        <TabsContent value="volunteers">
          <LeaderList users={volunteers} currentUserId={user?.id} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function LeaderList({ users, currentUserId }: { users: LeaderUser[]; currentUserId?: number }) {
  if (users.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          No users yet. Be the first!
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="mt-4 space-y-3">
      {users.map((u, i) => (
        <Card key={u.id} className={u.id === currentUserId ? "border-primary/50 bg-primary/5" : ""}>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted font-bold text-muted-foreground">
              {i === 0 ? (
                <Trophy className="h-5 w-5 text-amber-500" />
              ) : i === 1 ? (
                <Medal className="h-5 w-5 text-gray-400" />
              ) : i === 2 ? (
                <Medal className="h-5 w-5 text-amber-700" />
              ) : (
                <span>{i + 1}</span>
              )}
            </div>
            <div className="flex-1">
              <p className="font-medium">
                {u.username}
                {u.id === currentUserId && (
                  <span className="ml-2 text-xs text-primary">(You)</span>
                )}
              </p>
              {u.city && <p className="text-sm text-muted-foreground">{u.city}</p>}
            </div>
            <div className="flex items-center gap-1 text-lg font-bold text-primary">
              <Star className="h-4 w-4" />
              {u.points}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
