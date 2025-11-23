import jwt from "jsonwebtoken"

import type { Admin, User } from "@/generated/client.js"

import { env } from "../env.js"

const JWT_SECRET = env.JWT_SECRET
// Generate tokens
export function generateAccessToken(user: Omit<Admin | User, "password">) {
  const accessToken = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" })
  return accessToken
}
