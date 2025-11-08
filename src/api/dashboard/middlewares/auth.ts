import type { NextFunction, Request, Response } from "express"

import jwt from "jsonwebtoken"

import { env } from "@/env.js"
import prismaClient from "@/prisma/index.js"

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Unauthorized" })
    return
  }

  const token = authHeader.split(" ")[1]
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET)

    const admin = await prismaClient.admin.findUnique({
      where: { id: (decoded as jwt.JwtPayload).userId },
      omit: { password: true },
    })
    if (!admin) {
      res.status(401).json({ message: req.t("unauthorized", { ns: "errors" }) })
      return
    }
    req.userId = (decoded as jwt.JwtPayload).userId
    next()
  } catch (_error) {
    res.status(401).json({ message: req.t("unauthorized", { ns: "errors" }) })
  }
}
