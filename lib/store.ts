import crypto from "crypto"

// Types
export interface User {
  id: number
  username: string
  email: string
  password: string
  role: "donor" | "volunteer" | "admin"
  phone?: string
  city?: string
  area?: string
  latitude?: number
  longitude?: number
  points: number
  created_at: string
}

export interface Donation {
  id: number
  donor_id: number
  volunteer_id?: number
  category: string
  description: string
  quantity?: string
  pickup_address?: string
  city?: string
  area?: string
  latitude?: number
  longitude?: number
  status: "pending" | "assigned" | "collected" | "delivered"
  created_at: string
  collected_at?: string
  delivered_at?: string
  recipient_name?: string
  recipient_contact?: string
}

export interface Certificate {
  id: number
  user_id: number
  certificate_type: "bronze" | "silver" | "gold" | "platinum"
  issued_at: string
  donations_count: number
}

export interface Impact {
  id: number
  donation_id: number
  people_helped?: number
  feedback?: string
  created_at: string
}

export type PublicUser = Omit<User, "password">

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex")
}

export function checkPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash
}

// In-memory database
const users: User[] = [
  {
    id: 1,
    username: "admin",
    email: "admin@socialmentor.com",
    password: hashPassword("admin123"),
    role: "admin",
    city: "Mumbai",
    area: "Central",
    points: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    username: "donor1",
    email: "donor1@example.com",
    password: hashPassword("password123"),
    role: "donor",
    phone: "9876543210",
    city: "Mumbai",
    area: "Andheri",
    latitude: 19.1136,
    longitude: 72.8697,
    points: 120,
    created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
  },
  {
    id: 3,
    username: "donor2",
    email: "donor2@example.com",
    password: hashPassword("password123"),
    role: "donor",
    phone: "9876543211",
    city: "Mumbai",
    area: "Bandra",
    latitude: 19.0596,
    longitude: 72.8295,
    points: 80,
    created_at: new Date(Date.now() - 25 * 86400000).toISOString(),
  },
  {
    id: 4,
    username: "volunteer1",
    email: "volunteer1@example.com",
    password: hashPassword("password123"),
    role: "volunteer",
    phone: "9876543212",
    city: "Mumbai",
    area: "Dadar",
    latitude: 19.0178,
    longitude: 72.8478,
    points: 200,
    created_at: new Date(Date.now() - 20 * 86400000).toISOString(),
  },
  {
    id: 5,
    username: "volunteer2",
    email: "volunteer2@example.com",
    password: hashPassword("password123"),
    role: "volunteer",
    phone: "9876543213",
    city: "Mumbai",
    area: "Powai",
    latitude: 19.1176,
    longitude: 72.9060,
    points: 150,
    created_at: new Date(Date.now() - 15 * 86400000).toISOString(),
  },
]

const donations: Donation[] = [
  {
    id: 1,
    donor_id: 2,
    volunteer_id: 4,
    category: "Food",
    description: "50 packets of rice and dal",
    quantity: "50 packets",
    pickup_address: "123 Andheri West, Mumbai",
    city: "Mumbai",
    area: "Andheri",
    latitude: 19.1136,
    longitude: 72.8697,
    status: "delivered",
    created_at: new Date(Date.now() - 20 * 86400000).toISOString(),
    collected_at: new Date(Date.now() - 19 * 86400000).toISOString(),
    delivered_at: new Date(Date.now() - 18 * 86400000).toISOString(),
    recipient_name: "Hope Foundation",
    recipient_contact: "9876500001",
  },
  {
    id: 2,
    donor_id: 2,
    volunteer_id: 5,
    category: "Clothing",
    description: "30 sets of winter clothing for children",
    quantity: "30 sets",
    pickup_address: "456 Andheri East, Mumbai",
    city: "Mumbai",
    area: "Andheri",
    latitude: 19.1196,
    longitude: 72.8789,
    status: "delivered",
    created_at: new Date(Date.now() - 15 * 86400000).toISOString(),
    collected_at: new Date(Date.now() - 14 * 86400000).toISOString(),
    delivered_at: new Date(Date.now() - 13 * 86400000).toISOString(),
    recipient_name: "Children's Shelter",
    recipient_contact: "9876500002",
  },
  {
    id: 3,
    donor_id: 3,
    category: "Books",
    description: "100 textbooks for grade 5-10",
    quantity: "100 books",
    pickup_address: "789 Bandra West, Mumbai",
    city: "Mumbai",
    area: "Bandra",
    latitude: 19.0596,
    longitude: 72.8295,
    status: "pending",
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: 4,
    donor_id: 2,
    volunteer_id: 4,
    category: "Food",
    description: "25 kg fruits and vegetables",
    quantity: "25 kg",
    pickup_address: "321 Andheri West, Mumbai",
    city: "Mumbai",
    area: "Andheri",
    latitude: 19.1186,
    longitude: 72.8647,
    status: "collected",
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    collected_at: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 5,
    donor_id: 3,
    category: "Medicine",
    description: "First aid kits and basic medicines",
    quantity: "20 kits",
    pickup_address: "654 Bandra East, Mumbai",
    city: "Mumbai",
    area: "Bandra",
    latitude: 19.0616,
    longitude: 72.8395,
    status: "pending",
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 6,
    donor_id: 2,
    volunteer_id: 5,
    category: "Clothing",
    description: "15 blankets for homeless shelter",
    quantity: "15 blankets",
    pickup_address: "987 Andheri West, Mumbai",
    city: "Mumbai",
    area: "Andheri",
    latitude: 19.1166,
    longitude: 72.8717,
    status: "assigned",
    created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
]

const certificates: Certificate[] = [
  {
    id: 1,
    user_id: 4,
    certificate_type: "bronze",
    issued_at: new Date(Date.now() - 10 * 86400000).toISOString(),
    donations_count: 5,
  },
]

const impacts: Impact[] = [
  {
    id: 1,
    donation_id: 1,
    people_helped: 25,
    feedback: "The food packets were distributed to 25 families in the local community.",
    created_at: new Date(Date.now() - 18 * 86400000).toISOString(),
  },
  {
    id: 2,
    donation_id: 2,
    people_helped: 30,
    feedback: "Winter clothing provided to 30 children at the shelter. They were very grateful.",
    created_at: new Date(Date.now() - 13 * 86400000).toISOString(),
  },
]

let nextUserId = 6
let nextDonationId = 7
let nextCertificateId = 2
let nextImpactId = 3

// User operations
export function findUserByUsername(username: string): User | undefined {
  return users.find((u) => u.username === username)
}

export function findUserByEmail(email: string): User | undefined {
  return users.find((u) => u.email === email)
}

export function findUserById(id: number): User | undefined {
  return users.find((u) => u.id === id)
}

export function createUser(data: Omit<User, "id" | "points" | "created_at" | "password"> & { password: string }): User {
  const user: User = {
    ...data,
    id: nextUserId++,
    password: hashPassword(data.password),
    points: 0,
    created_at: new Date().toISOString(),
  }
  users.push(user)
  return user
}

export function toPublicUser(user: User): PublicUser {
  const { password: _, ...publicUser } = user
  return publicUser
}

// Donation operations
export function getDonationsByDonor(donorId: number): Donation[] {
  return donations.filter((d) => d.donor_id === donorId).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
}

export function getDonationsByVolunteer(volunteerId: number): Donation[] {
  return donations.filter((d) => d.volunteer_id === volunteerId).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
}

export function getAllDonations(): Donation[] {
  return [...donations].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
}

export function getPendingDonations(): Donation[] {
  return donations.filter((d) => d.status === "pending")
}

export function getDonationById(id: number): Donation | undefined {
  return donations.find((d) => d.id === id)
}

export function createDonation(data: Omit<Donation, "id" | "status" | "created_at">): Donation {
  const donation: Donation = {
    ...data,
    id: nextDonationId++,
    status: "pending",
    created_at: new Date().toISOString(),
  }
  donations.push(donation)
  return donation
}

export function updateDonation(id: number, updates: Partial<Donation>): Donation | undefined {
  const donation = donations.find((d) => d.id === id)
  if (donation) {
    Object.assign(donation, updates)
  }
  return donation
}

// Points and certificates
export function awardPoints(userId: number, action: string): void {
  const user = findUserById(userId)
  if (!user) return

  const pointsMap: Record<string, number> = {
    donation: 10,
    volunteer_collect: 15,
    volunteer_deliver: 20,
    first_donation: 50,
  }

  user.points += pointsMap[action] || 0
  checkCertificateEligibility(user)
}

function checkCertificateEligibility(user: User): void {
  let donationCount: number
  if (user.role === "donor") {
    donationCount = donations.filter((d) => d.donor_id === user.id && d.status === "delivered").length
  } else if (user.role === "volunteer") {
    donationCount = donations.filter((d) => d.volunteer_id === user.id && d.status === "delivered").length
  } else {
    return
  }

  const levels: [number, Certificate["certificate_type"]][] = [
    [100, "platinum"],
    [50, "gold"],
    [20, "silver"],
    [5, "bronze"],
  ]

  for (const [count, certType] of levels) {
    if (donationCount >= count) {
      const existing = certificates.find((c) => c.user_id === user.id && c.certificate_type === certType)
      if (!existing) {
        certificates.push({
          id: nextCertificateId++,
          user_id: user.id,
          certificate_type: certType,
          issued_at: new Date().toISOString(),
          donations_count: donationCount,
        })
      }
      break
    }
  }
}

// Certificate operations
export function getCertificatesByUser(userId: number): Certificate[] {
  return certificates.filter((c) => c.user_id === userId).sort((a, b) => new Date(b.issued_at).getTime() - new Date(a.issued_at).getTime())
}

// Impact operations
export function getImpactsByDonationId(donationId: number): Impact[] {
  return impacts.filter((i) => i.donation_id === donationId)
}

export function createImpact(data: Omit<Impact, "id" | "created_at">): Impact {
  const impact: Impact = {
    ...data,
    id: nextImpactId++,
    created_at: new Date().toISOString(),
  }
  impacts.push(impact)
  return impact
}

export function getDeliveredDonationsByDonor(donorId: number): Donation[] {
  return donations.filter((d) => d.donor_id === donorId && d.status === "delivered")
}

export function getDeliveredDonationsByVolunteer(volunteerId: number): Donation[] {
  return donations.filter((d) => d.volunteer_id === volunteerId && d.status === "delivered")
}

export function getDeliveredDonations(): Donation[] {
  return donations.filter((d) => d.status === "delivered")
}

export function getAllImpacts(): Impact[] {
  return [...impacts]
}

// Stats
export function getStats(user: User) {
  if (user.role === "donor") {
    const userDonations = getDonationsByDonor(user.id)
    return {
      total: userDonations.length,
      pending: userDonations.filter((d) => d.status === "pending").length,
      delivered: userDonations.filter((d) => d.status === "delivered").length,
    }
  } else if (user.role === "volunteer") {
    const assigned = getDonationsByVolunteer(user.id)
    const pending = getPendingDonations()
    let nearbyCount = 0
    if (user.latitude && user.longitude) {
      for (const d of pending) {
        if (d.latitude && d.longitude) {
          const dist = calculateDistance(user.latitude, user.longitude, d.latitude, d.longitude)
          if (dist <= 20) nearbyCount++
        }
      }
    }
    return {
      available: nearbyCount,
      assigned: assigned.filter((d) => d.status === "assigned" || d.status === "collected").length,
      completed: assigned.filter((d) => d.status === "delivered").length,
    }
  } else {
    return {
      users: users.length,
      donations: donations.length,
      delivered: donations.filter((d) => d.status === "delivered").length,
      pending: donations.filter((d) => d.status === "pending").length,
    }
  }
}

export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2
  const c = 2 * Math.asin(Math.sqrt(a))
  return R * c
}

// Leaderboard
export function getLeaderboard() {
  const topDonors = users
    .filter((u) => u.role === "donor")
    .sort((a, b) => b.points - a.points)
    .slice(0, 10)
    .map(toPublicUser)

  const topVolunteers = users
    .filter((u) => u.role === "volunteer")
    .sort((a, b) => b.points - a.points)
    .slice(0, 10)
    .map(toPublicUser)

  return { donors: topDonors, volunteers: topVolunteers }
}
