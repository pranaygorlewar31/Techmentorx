import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { getCertificatesByUser } from "@/lib/store"

export async function GET() {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  return NextResponse.json(getCertificatesByUser(user.id))
}
