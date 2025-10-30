import jwt from "jsonwebtoken"

import type { User } from "../../../generated/prisma/index.js"

import { env } from "../../../env.js"

const JWT_SECRET = env.JWT_SECRET
// Generate tokens
export function generateAccessToken(user: Omit<User, "password">) {
  const accessToken = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" })
  return accessToken
}
