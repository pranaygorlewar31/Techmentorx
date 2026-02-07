import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import {
  getDonationsByDonor,
  getDonationsByVolunteer,
  getAllDonations,
  createDonation,
  awardPoints,
  getDonationById,
  findUserById,
  toPublicUser,
} from "@/lib/store"

function enrichDonation(d: ReturnType<typeof getDonationById>) {
  if (!d) return null
  const donor = findUserById(d.donor_id)
  const volunteer = d.volunteer_id ? findUserById(d.volunteer_id) : null
  return {
    ...d,
    donor: donor ? toPublicUser(donor) : null,
    volunteer: volunteer ? toPublicUser(volunteer) : null,
  }
}

export async function GET() {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  let donations
  if (user.role === "donor") {
    donations = getDonationsByDonor(user.id)
  } else if (user.role === "volunteer") {
    donations = getDonationsByVolunteer(user.id)
  } else {
    donations = getAllDonations()
  }

  return NextResponse.json(donations.map(enrichDonation))
}

export async function POST(request: Request) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  if (user.role !== "donor") {
    return NextResponse.json({ message: "Only donors can create donations" }, { status: 403 })
  }

  const data = await request.json()

  const donation = createDonation({
    donor_id: user.id,
    category: data.category,
    description: data.description,
    quantity: data.quantity,
    pickup_address: data.pickup_address,
    city: data.city || user.city,
    area: data.area || user.area,
    latitude: data.latitude || user.latitude,
    longitude: data.longitude || user.longitude,
  })

  const donorDonations = getDonationsByDonor(user.id)
  if (donorDonations.length === 1) {
    awardPoints(user.id, "first_donation")
  }
  awardPoints(user.id, "donation")

  return NextResponse.json(enrichDonation(donation), { status: 201 })
}
