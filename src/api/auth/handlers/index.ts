import type { Request, Response } from "express"
import type { ValidatedRequest } from "express-zod-safe"

import bcrypt from "bcrypt"

import type {
  addressSchema,
  loginSchema,
  registerSchema,
  updateUserDataSchema,
} from "../schemas/index.js"

import prismaClient from "../../../prisma/index.js"
import { userSelectWithoutPassword } from "../../../prisma/user.js"
import stripLangKeys from "../../../utils/obj-select-lang.js"
import { generateAccessToken } from "../utils/generate-access-token.js"

export async function loginHandler(
  req: ValidatedRequest<{ body: typeof loginSchema }>,
  res: Response
) {
  const { phone, password } = req.body

  const user = await prismaClient.user.findUnique({
    where: {
      phone,
    },
    include: {
      region: {
        select: {
          id: true,
          [req.language === "en" ? "name_en" : "name_ar"]: true,
          emirate: {
            select: {
              id: true,
              [req.language === "en" ? "name_en" : "name_ar"]: true,
            },
          },
        },
      },
    },
  })
  if (!user) {
    res.status(401).json({ message: req.t("unauthorized", { ns: "errors" }) })
    return
  }
  // checking if password is correct
  const isPasswordCorrect = await bcrypt.compare(password, user.password)
  if (!isPasswordCorrect) {
    res.status(401).json({ message: req.t("unauthorized", { ns: "errors" }) })
    return
  }
  const { password: _, ...userWithoutPassword } = user
  // generating access token
  const accessToken = generateAccessToken(userWithoutPassword)
  res.json({
    message: req.t("message", { ns: "translations" }),
    data: { accessToken, user: stripLangKeys(userWithoutPassword) },
  })
}

export async function registerHandler(
  req: ValidatedRequest<{ body: typeof registerSchema }>,
  res: Response
) {
  const { phone, password, name, email, region_id, address } = req.body

  // Check if user already exists by phone or email
  const existingUser = await prismaClient.user.findFirst({
    where: {
      OR: [{ phone }, { email }],
    },
    select: { id: true },
  })
  if (existingUser) {
    res.status(409).json({ message: req.t("user_conflict", { ns: "errors" }) })
    return
  }
  // checking if region exists
  const region = await prismaClient.region.findUnique({
    where: { id: region_id },
  })

  if (!region) {
    res.status(404).json({ message: req.t("region_not_found", { ns: "errors" }) })
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
    select: userSelectWithoutPassword(req.language),
  })
  // generating access token
  const accessToken = generateAccessToken(user)

  res.status(201).json({ data: { accessToken, user: stripLangKeys(user) } })
}

// with auth middleware
export async function getMeHandler(req: Request, res: Response) {
  const user = await prismaClient.user.findUnique({
    where: { id: req.userId },
    select: userSelectWithoutPassword(req.language),
  })
  res.json({ data: stripLangKeys(user) })
}

export async function updateAddressHandler(
  req: ValidatedRequest<{ body: typeof addressSchema }>,
  res: Response
) {
  const { region_id, address } = req.body
  const user = await prismaClient.user.update({
    where: { id: req.userId },
    data: { region: { connect: { id: region_id } }, address },
    select: userSelectWithoutPassword(req.language),
  })
  res.json({ data: stripLangKeys(user) })
}

export async function updateUserDataHandler(
  req: ValidatedRequest<{ body: typeof updateUserDataSchema }>,
  res: Response
) {
  const { name, email } = req.body
  const user = await prismaClient.user.update({
    where: { id: req.userId },
    data: { name, email },
    select: userSelectWithoutPassword(req.language),
  })
  res.json({ data: stripLangKeys(user) })
}
