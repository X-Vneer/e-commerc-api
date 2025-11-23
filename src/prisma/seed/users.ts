// prisma/seed.ts
import bcrypt from "bcrypt"

import prismaClient from "@/prisma/index.js"

export async function seedUsers() {
  // ---------- config ----------
  const SALT_ROUNDS = 10

  // change these plaintext passwords before you run in production
  const DEFAULT_USER = {
    phone: "+970598654780",
    email: "user@elwaha.com",
    passwordPlain: "password123",
    name: "Seeded User",
    role: "user" as const, // matches your UserRole enum
    status: "active" as const,
    region_id: 1, // adjust if you seed regions too; or set to an existing region id
    address: "Nablus Street 1",
  }

  const DEFAULT_ADMIN = {
    email: "admin@elwaha.com",
    passwordPlain: "password123",
    name: "Seeded Admin",
    role: "admin" as const, // or "admin" if you have that enum value
    status: "active" as const,
  }

  // ---------- Create User ----------
  console.log("Seeding user...")
  const userPhone = DEFAULT_USER.phone
  const existingUser = await prismaClient.user.findUnique({ where: { phone: userPhone } })

  if (!existingUser) {
    const hashed = await bcrypt.hash(DEFAULT_USER.passwordPlain, SALT_ROUNDS)
    await prismaClient.user.create({
      data: {
        phone: DEFAULT_USER.phone,
        email: DEFAULT_USER.email,
        password: hashed,
        name: DEFAULT_USER.name,
        role: DEFAULT_USER.role,
        status: DEFAULT_USER.status,
        region_id: 1,
        address: DEFAULT_USER.address,
      },
    })
    console.log(`  created user ${DEFAULT_USER.phone}`)
  } else {
    console.log(`  user ${userPhone} already exists — skipping`)
  }

  // ---------- Create Admin ----------
  console.log("Seeding admin...")
  const adminEmail = DEFAULT_ADMIN.email
  const existingAdmin = await prismaClient.admin.findUnique({ where: { email: adminEmail } })

  if (!existingAdmin) {
    const hashedAdmin = await bcrypt.hash(DEFAULT_ADMIN.passwordPlain, SALT_ROUNDS)
    await prismaClient.admin.create({
      data: {
        email: DEFAULT_ADMIN.email,
        password: hashedAdmin,
        name: DEFAULT_ADMIN.name,
        role: DEFAULT_ADMIN.role as any, // cast if your Admin.role expects enum
        status: DEFAULT_ADMIN.status,
      },
    })
    console.log(`  created admin ${DEFAULT_ADMIN.email}`)
  } else {
    console.log(`  admin ${adminEmail} already exists — skipping`)
  }
}
