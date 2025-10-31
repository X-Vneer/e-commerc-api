import type { Request, Response } from "express"

import prismaClient from "../../../prisma/index.js"

export async function getEmiratesHandler(req: Request, res: Response) {
  const emirates = await prismaClient.emirate.findMany({
    select: {
      id: true,
      name_en: true,
      name_ar: true,
    },
  })
  res.json({
    data: emirates,
  })
}

export async function getRegionsHandler(req: Request, res: Response) {
  const { emirate_id } = req.query as { emirate_id?: number }
  const regions = await prismaClient.region.findMany({
    where: {
      ...(emirate_id ? { emirate_id: Number(emirate_id) } : {}),
    },
    select: {
      id: true,
      name_en: true,
      name_ar: true,
    },
  })
  res.json({
    data: regions,
  })
}
