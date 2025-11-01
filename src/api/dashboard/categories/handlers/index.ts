import type { Response } from "express"
import type { ValidatedRequest } from "express-zod-safe"

import type { createCategorySchema } from "../schemas/index.js"

import prismaClient from "../../../../prisma/index.js"

export async function createCategoryHandler(
  req: ValidatedRequest<{ body: typeof createCategorySchema }>,
  res: Response
) {
  const { name_en, name_ar, image } = req.body
  const category = await prismaClient.category.create({
    data: { name_en, name_ar, image: image.toString() },
  })
  res.json({ data: category })
}
