import type { Request, Response } from "express"

import prismaClient from "../../../prisma/index.js"

export async function getEmiratesHandler(req: Request, res: Response) {
  const lang = req.language
  const locale = lang === "ar" ? "name_ar" : "name_en"
  const emirates = await prismaClient.emirate.findMany({
    select: {
      id: true,
      [locale]: true,
    },
  })
  const formatted = emirates.map(e => ({ id: e.id, name: e[locale] }))
  res.json({ data: formatted })
}

export async function getRegionsHandler(req: Request, res: Response) {
  const { emirate_id } = req.query as { emirate_id?: number }
  const lang = req.language
  const locale = lang === "ar" ? "name_ar" : "name_en"
  const regions = await prismaClient.region.findMany({
    where: {
      ...(emirate_id ? { emirate_id: Number(emirate_id) } : {}),
    },
    select: {
      id: true,
      [locale]: true,
    },
  })

  const formatted = regions.map(r => ({ id: r.id, name: r[locale] }))
  res.json({
    data: formatted,
  })
}
