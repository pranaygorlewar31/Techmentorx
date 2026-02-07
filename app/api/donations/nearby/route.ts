import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { getPendingDonations, calculateDistance, findUserById, toPublicUser } from "@/lib/store"

export async function GET() {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  if (user.role !== "volunteer") {
    return NextResponse.json({ message: "Only volunteers can view nearby donations" }, { status: 403 })
  }

  const pending = getPendingDonations()
  const nearby: Array<Record<string, unknown>> = []

  if (user.latitude && user.longitude) {
    for (const donation of pending) {
      if (donation.latitude && donation.longitude) {
        const distance = calculateDistance(user.latitude, user.longitude, donation.latitude, donation.longitude)
        if (distance <= 20) {
          const donor = findUserById(donation.donor_id)
          nearby.push({
            ...donation,
            donor: donor ? toPublicUser(donor) : null,
            distance: Math.round(distance * 100) / 100,
          })
        }
      }
    }
    nearby.sort((a, b) => (a.distance as number) - (b.distance as number))
  }

  return NextResponse.json(nearby)
}
