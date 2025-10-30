import type { NextFunction, Request, Response } from "express"

import jwt from "jsonwebtoken"

import type {} from "../express.js"

import { env } from "../env.js"

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Unauthorized" })
    return
  }

  const token = authHeader.split(" ")[1]

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET)
    req.userId = (decoded as jwt.JwtPayload).userId
    next()
  }
  // eslint-disable-next-line unused-imports/no-unused-vars
  catch (_error) {
    res.status(401).json({ message: req.t("unauthorized", { ns: "errors" }) })
  }
}
