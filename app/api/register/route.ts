import { NextResponse } from "next/server"
import { findUserByUsername, findUserByEmail, createUser, toPublicUser } from "@/lib/store"
import { createToken } from "@/lib/auth"

export async function POST(request: Request) {
  const data = await request.json()

  if (!data.username || !data.email || !data.password || !data.role) {
    return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
  }

  if (findUserByUsername(data.username)) {
    return NextResponse.json({ message: "Username already exists" }, { status: 400 })
  }

  if (findUserByEmail(data.email)) {
    return NextResponse.json({ message: "Email already registered" }, { status: 400 })
  }

  const user = createUser({
    username: data.username,
    email: data.email,
    password: data.password,
    role: data.role,
    phone: data.phone,
    city: data.city,
    area: data.area,
    latitude: data.latitude,
    longitude: data.longitude,
  })

  const token = createToken(user.id)

  const response = NextResponse.json(
    { message: "Registration successful", user: toPublicUser(user) },
    { status: 201 }
  )

  response.cookies.set("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60,
    path: "/",
  })

  return response
}
