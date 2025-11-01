import type { Request, Response } from "express"

import prismaClient from "../../../prisma/index.js"
import stripLangKeys from "../../../utils/obj-select-lang.js"

export async function getEmiratesHandler(req: Request, res: Response) {
  const lang = req.language
  const locale = lang === "ar" ? "name_ar" : "name_en"
  const emirates = await prismaClient.emirate.findMany({
    select: {
      id: true,
      [locale]: true,
    },
  })
  res.json({ data: stripLangKeys(emirates) })
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

  res.json({
    data: stripLangKeys(regions),
  })
}

export async function getSizesHandler(req: Request, res: Response) {
  const sizes = await prismaClient.size.findMany()
  res.json({ data: sizes })
}

export async function getCategoriesHandler(req: Request, res: Response) {
  const lang = req.language
  const locale = lang === "ar" ? "name_ar" : "name_en"
  const categories = await prismaClient.category.findMany({
    select: {
      id: true,
      [locale]: true,
    },
  })
  res.json({ 
    data: stripLangKeys(categories)
 })
}