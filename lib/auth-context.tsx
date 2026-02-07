"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"

interface User {
  id: number
  username: string
  email: string
  role: "donor" | "volunteer" | "admin"
  phone?: string
  city?: string
  area?: string
  latitude?: number
  longitude?: number
  points: number
  created_at: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (username: string, password: string) => Promise<{ success: boolean; message?: string }>
  register: (data: Record<string, string | number | undefined>) => Promise<{ success: boolean; message?: string }>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch("/api/me")
      if (res.ok) {
        const data = await res.json()
        setUser(data)
      } else {
        setUser(null)
      }
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshUser()
  }, [refreshUser])

  const login = async (username: string, password: string) => {
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })
      const data = await res.json()
      if (res.ok) {
        setUser(data.user)
        return { success: true }
      }
      return { success: false, message: data.message }
    } catch {
      return { success: false, message: "Network error" }
    }
  }

  const register = async (data: Record<string, string | number | undefined>) => {
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      const result = await res.json()
      if (res.ok) {
        setUser(result.user)
        return { success: true }
      }
      return { success: false, message: result.message }
    } catch {
      return { success: false, message: "Network error" }
    }
  }

  const logout = async () => {
    await fetch("/api/logout", { method: "POST" })
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
