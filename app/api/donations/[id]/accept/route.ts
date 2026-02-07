import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { getDonationById, updateDonation } from "@/lib/store"

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  if (user.role !== "volunteer") {
    return NextResponse.json({ message: "Only volunteers can accept donations" }, { status: 403 })
  }

  const { id } = await params
  const donation = getDonationById(parseInt(id))
  if (!donation) {
    return NextResponse.json({ message: "Donation not found" }, { status: 404 })
  }

  if (donation.status !== "pending") {
    return NextResponse.json({ message: "Donation already assigned" }, { status: 400 })
  }

  updateDonation(donation.id, {
    volunteer_id: user.id,
    status: "assigned",
  })

  return NextResponse.json({ message: "Donation accepted" })
}
