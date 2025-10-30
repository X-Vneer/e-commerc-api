import type { Response } from "express"
import type { ValidatedRequest } from "express-zod-safe"

import bcrypt from "bcrypt"

import type { loginSchema, registerSchema } from "../schemas/index.js"

import prismaClient from "../../../prisma.js"
import { generateAccessToken } from "../utils/generate-access-token.js"

export async function loginHandler(req: ValidatedRequest<{ body: typeof loginSchema }>, res: Response) {
  const { phone, password } = req.body
  const user = await prismaClient.user.findUnique({
    where: {
      phone,
    },
  })
  if (!user) {
    res.status(401).json({ message: "Invalid credentials" })
    return
  }
  // checking if password is correct
  const isPasswordCorrect = await bcrypt.compare(password, user.password)
  if (!isPasswordCorrect) {
    res.status(401).json({ message: "Invalid credentials" })
    return
  }
  // generating access token
  const accessToken = generateAccessToken(user)
  res.json({ accessToken, user })
}

export async function registerHandler(req: ValidatedRequest<{ body: typeof registerSchema }>, res: Response) {
  const { phone, password, name, email, region_id, address } = req.body

  // Check if user already exists by phone or email
  const existingUser = await prismaClient.user.findFirst({
    where: {
      OR: [{ phone }, { email }],
    },
    select: { id: true },
  })
  if (existingUser) {
    res.status(409).json({ message: "User already exists" })
    return
  }
  // checking if region exists
  const region = await prismaClient.region.findUnique({
    where: { id: region_id },
  })

  if (!region) {
    res.status(404).json({ message: "Region not found" })
    return
  }

  // checking if emirate exists
  const salt = await bcrypt.genSalt(10)
  const encryptedPassword = await bcrypt.hash(password, salt)

  const user = await prismaClient.user.create({
    data: {
      phone,
      password: encryptedPassword,
      name,
      email,
      region: { connect: { id: region_id } },
      address,
    },
  })
  // generating access token
  const accessToken = generateAccessToken(user)

  res.status(201).json({ accessToken, user })
}
