import type { Request, Response } from "express"
import type { ValidatedRequest } from "express-zod-safe"

import bcrypt from "bcrypt"

import type { loginSchema } from "../schemas/index.js"

import prismaClient from "../../../../prisma/index.js"
import { generateAccessToken } from "../../../../utils/generate-access-token.js"

export async function loginHandler(
  req: ValidatedRequest<{ body: typeof loginSchema }>,
  res: Response
) {
  const { email, password } = req.body

  const user = await prismaClient.admin.findUnique({
    where: {
      email,
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
    data: { accessToken, user: userWithoutPassword },
  })
}

// with auth middleware
export async function getMeHandler(req: Request, res: Response) {
  const user = await prismaClient.admin.findUnique({
    where: { id: req.userId },
    omit: { password: true },
  })
  res.json({ data: user })
}
