"use client"

import React from "react"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, CheckCircle2, Truck } from "lucide-react"

export default function DeliverPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [formData, setFormData] = useState({
    recipient_name: "",
    recipient_contact: "",
    people_helped: "",
    feedback: "",
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
    if (user && user.role !== "volunteer") {
      router.push("/dashboard")
    }
  }, [user, authLoading, router])

  const update = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const res = await fetch(`/api/donations/${id}/deliver`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        people_helped: parseInt(formData.people_helped) || 0,
      }),
    })

    if (res.ok) {
      setSuccess(true)
      setTimeout(() => router.push("/dashboard"), 2000)
    } else {
      const data = await res.json()
      setError(data.message || "Failed to mark as delivered")
    }
    setLoading(false)
  }

  if (authLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (success) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
          <CheckCircle2 className="h-8 w-8 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-bold">Delivery Confirmed</h2>
        <p className="text-muted-foreground">Thank you for making a difference!</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Truck className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Confirm Delivery</CardTitle>
              <CardDescription>Record the delivery details and impact</CardDescription>
            </div>
          </div>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</div>
            )}
            <div className="space-y-2">
              <Label htmlFor="recipient_name">Recipient Name</Label>
              <Input
                id="recipient_name"
                value={formData.recipient_name}
                onChange={(e) => update("recipient_name", e.target.value)}
                placeholder="Who received the donation?"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="recipient_contact">Recipient Contact</Label>
              <Input
                id="recipient_contact"
                value={formData.recipient_contact}
                onChange={(e) => update("recipient_contact", e.target.value)}
                placeholder="Contact number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="people_helped">People Helped</Label>
              <Input
                id="people_helped"
                type="number"
                value={formData.people_helped}
                onChange={(e) => update("people_helped", e.target.value)}
                placeholder="Estimated number of people helped"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="feedback">Feedback</Label>
              <Textarea
                id="feedback"
                value={formData.feedback}
                onChange={(e) => update("feedback", e.target.value)}
                placeholder="Share how the delivery went..."
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Confirm Delivery
            </Button>
          </CardContent>
        </form>
      </Card>
    </div>
  )
}
