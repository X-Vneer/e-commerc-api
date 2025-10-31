import type { Request, Response } from "express"

import prismaClient from "../../../prisma.js"

export async function getEmiratesHandler(req: Request, res: Response) {
  const emirates = await prismaClient.emirate.findMany({
    select: {
      id: true,
      name: true,
    },
  })
  res.json({
    data: emirates,
  })
}

export async function getRegionsHandler(req: Request, res: Response) {
  const { emirate_id } = req.query as { emirate_id?: string }
  const regions = await prismaClient.region.findMany({
    where: {
      ...(emirate_id ? { emirate_id } : {}),
    },
    select: {
      id: true,
      name: true,
    },
  })
  res.json({
    data: regions,
  })
}
