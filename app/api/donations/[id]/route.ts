import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { getDonationById, findUserById, toPublicUser } from "@/lib/store"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const donation = getDonationById(parseInt(id))
  if (!donation) {
    return NextResponse.json({ message: "Donation not found" }, { status: 404 })
  }

  const donor = findUserById(donation.donor_id)
  const volunteer = donation.volunteer_id ? findUserById(donation.volunteer_id) : null

  return NextResponse.json({
    ...donation,
    donor: donor ? toPublicUser(donor) : null,
    volunteer: volunteer ? toPublicUser(volunteer) : null,
  })
}
