import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { getDonationById, updateDonation, awardPoints, createImpact } from "@/lib/store"

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  if (user.role !== "volunteer") {
    return NextResponse.json({ message: "Only volunteers can deliver donations" }, { status: 403 })
  }

  const { id } = await params
  const donation = getDonationById(parseInt(id))
  if (!donation) {
    return NextResponse.json({ message: "Donation not found" }, { status: 404 })
  }

  if (donation.volunteer_id !== user.id) {
    return NextResponse.json({ message: "Not your donation" }, { status: 403 })
  }

  const data = await request.json()

  updateDonation(donation.id, {
    status: "delivered",
    delivered_at: new Date().toISOString(),
    recipient_name: data.recipient_name,
    recipient_contact: data.recipient_contact,
  })

  createImpact({
    donation_id: donation.id,
    people_helped: data.people_helped,
    feedback: data.feedback,
  })

  awardPoints(user.id, "volunteer_deliver")

  return NextResponse.json({ message: "Donation delivered" })
}
