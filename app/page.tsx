"use client"

import React from "react"

import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { HandHeart, Heart, Truck, Trophy, BarChart3, Users, ArrowRight } from "lucide-react"

export default function HomePage() {
  const { user } = useAuth()

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-foreground px-4 py-24 text-background">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary">
            <HandHeart className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-balance sm:text-5xl lg:text-6xl">
            Know that your donation is making a difference
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-background/70">
            Social Mentor connects donors with volunteers to deliver donations directly to those in need.
            Track every item, see your impact, and earn recognition for your generosity.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            {user ? (
              <Button size="lg" asChild>
                <Link href="/dashboard">
                  Go to Dashboard
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <>
                <Button size="lg" asChild>
                  <Link href="/register">
                    Get Started
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="border-background/20 text-background hover:bg-background/10 hover:text-background bg-transparent">
                  <Link href="/login">Sign In</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-b bg-card px-4 py-8">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-8 text-center sm:gap-16">
          <div>
            <p className="text-3xl font-bold text-foreground">55+</p>
            <p className="text-sm text-muted-foreground">people helped</p>
          </div>
          <div className="h-8 w-px bg-border" />
          <div>
            <p className="text-3xl font-bold text-foreground">6</p>
            <p className="text-sm text-muted-foreground">donations listed</p>
          </div>
          <div className="h-8 w-px bg-border" />
          <div>
            <p className="text-3xl font-bold text-foreground">5</p>
            <p className="text-sm text-muted-foreground">active members</p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-2 text-center text-3xl font-bold text-balance">How It Works</h2>
          <p className="mb-12 text-center text-muted-foreground">
            Three simple steps to make a real difference in someone's life
          </p>
          <div className="grid gap-8 sm:grid-cols-3">
            <StepCard
              icon={<Heart className="h-6 w-6" />}
              step="1"
              title="Donors List Items"
              description="Create a donation listing with details about the items you want to give away."
            />
            <StepCard
              icon={<Truck className="h-6 w-6" />}
              step="2"
              title="Volunteers Deliver"
              description="Nearby volunteers accept the donation, pick it up, and deliver it to those in need."
            />
            <StepCard
              icon={<BarChart3 className="h-6 w-6" />}
              step="3"
              title="Track Your Impact"
              description="See how many people were helped, earn points, and climb the leaderboard."
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-card px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-12 text-center text-3xl font-bold text-balance">Built for Generosity</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<Heart />}
              title="Easy Donations"
              description="List items in seconds with our simple form. Choose from food, clothing, books, and more."
            />
            <FeatureCard
              icon={<Users />}
              title="Volunteer Matching"
              description="We match donations to nearby volunteers based on location for fast, local delivery."
            />
            <FeatureCard
              icon={<Trophy />}
              title="Gamification"
              description="Earn points for every contribution and compete on the leaderboard."
            />
            <FeatureCard
              icon={<BarChart3 />}
              title="Impact Tracking"
              description="See exactly how many people you've helped with real delivery feedback."
            />
            <FeatureCard
              icon={<HandHeart />}
              title="Certificates"
              description="Earn Bronze, Silver, Gold, and Platinum certificates for your contributions."
            />
            <FeatureCard
              icon={<Truck />}
              title="Real-Time Status"
              description="Track every donation from listing to delivery with live status updates."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      {!user && (
        <section className="px-4 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-balance">Ready to Make a Difference?</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Join Social Mentor today and start contributing to your community.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/register">
                  Create an Account
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

function StepCard({
  icon,
  step,
  title,
  description,
}: {
  icon: React.ReactNode
  step: string
  title: string
  description: string
}) {
  return (
    <div className="text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
        {icon}
      </div>
      <div className="mb-1 text-xs font-bold uppercase tracking-wider text-primary">Step {step}</div>
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>
        <h3 className="mb-1 font-semibold">{title}</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}
