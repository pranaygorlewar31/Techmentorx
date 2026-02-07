import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import {
  getDeliveredDonationsByDonor,
  getDeliveredDonationsByVolunteer,
  getDeliveredDonations,
  getImpactsByDonationId,
  findUserById,
  toPublicUser,
} from "@/lib/store"

export async function GET() {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  let donations
  if (user.role === "donor") {
    donations = getDeliveredDonationsByDonor(user.id)
  } else if (user.role === "volunteer") {
    donations = getDeliveredDonationsByVolunteer(user.id)
  } else {
    donations = getDeliveredDonations()
  }

  let totalPeopleHelped = 0
  const impacts = []

  for (const donation of donations) {
    const donationImpacts = getImpactsByDonationId(donation.id)
    const donor = findUserById(donation.donor_id)
    const volunteer = donation.volunteer_id ? findUserById(donation.volunteer_id) : null

    for (const impact of donationImpacts) {
      totalPeopleHelped += impact.people_helped || 0
      impacts.push({
        donation: {
          ...donation,
          donor: donor ? toPublicUser(donor) : null,
          volunteer: volunteer ? toPublicUser(volunteer) : null,
        },
        impact,
      })
    }
  }

  return NextResponse.json({ total: totalPeopleHelped, impacts })
}
