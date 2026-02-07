import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { getDonationById, updateDonation, awardPoints } from "@/lib/store"

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  if (user.role !== "volunteer") {
    return NextResponse.json({ message: "Only volunteers can collect donations" }, { status: 403 })
  }

  const { id } = await params
  const donation = getDonationById(parseInt(id))
  if (!donation) {
    return NextResponse.json({ message: "Donation not found" }, { status: 404 })
  }

  if (donation.volunteer_id !== user.id) {
    return NextResponse.json({ message: "Not your donation" }, { status: 403 })
  }

  updateDonation(donation.id, {
    status: "collected",
    collected_at: new Date().toISOString(),
  })

  awardPoints(user.id, "volunteer_collect")

  return NextResponse.json({ message: "Donation collected" })
}
