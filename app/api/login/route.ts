import { NextResponse } from "next/server"
import { findUserByUsername, checkPassword, toPublicUser } from "@/lib/store"
import { createToken } from "@/lib/auth"

export async function POST(request: Request) {
  const data = await request.json()

  if (!data.username || !data.password) {
    return NextResponse.json({ message: "Missing credentials" }, { status: 400 })
  }

  const user = findUserByUsername(data.username)

  if (!user || !checkPassword(data.password, user.password)) {
    return NextResponse.json({ message: "Invalid credentials" }, { status: 401 })
  }

  const token = createToken(user.id)

  const response = NextResponse.json({
    message: "Login successful",
    user: toPublicUser(user),
  })

  response.cookies.set("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60,
    path: "/",
  })

  return response
}
