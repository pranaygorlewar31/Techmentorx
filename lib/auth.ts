import { cookies } from "next/headers"
import { findUserById, type User } from "./store"

const JWT_SECRET = "social-mentor-secret-key-2024"

function base64url(str: string): string {
  return Buffer.from(str).toString("base64url")
}

function base64urlDecode(str: string): string {
  return Buffer.from(str, "base64url").toString()
}

export function createToken(userId: number): string {
  const header = base64url(JSON.stringify({ alg: "HS256", typ: "JWT" }))
  const payload = base64url(
    JSON.stringify({
      user_id: userId,
      exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
    })
  )
  const crypto = require("crypto")
  const signature = crypto.createHmac("sha256", JWT_SECRET).update(`${header}.${payload}`).digest("base64url")
  return `${header}.${payload}.${signature}`
}

export function verifyToken(token: string): { user_id: number } | null {
  try {
    const parts = token.split(".")
    if (parts.length !== 3) return null

    const [header, payload, signature] = parts
    const crypto = require("crypto")
    const expectedSig = crypto.createHmac("sha256", JWT_SECRET).update(`${header}.${payload}`).digest("base64url")

    if (signature !== expectedSig) return null

    const data = JSON.parse(base64urlDecode(payload))
    if (data.exp < Date.now()) return null

    return { user_id: data.user_id }
  } catch {
    return null
  }
}

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value
  if (!token) return null

  const decoded = verifyToken(token)
  if (!decoded) return null

  const user = findUserById(decoded.user_id)
  return user || null
}
