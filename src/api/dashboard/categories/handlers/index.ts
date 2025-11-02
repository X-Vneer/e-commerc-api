import type { Request, Response } from "express"
import type { ValidatedRequest } from "express-zod-safe"

import type {
  categoryIdSchema,
  createCategorySchema,
  updateCategorySchema,
} from "../schemas/index.js"

import prismaClient from "../../../../prisma/index.js"
import stripLangKeys from "../../../../utils/obj-select-lang.js"

export async function createCategoryHandler(
  req: ValidatedRequest<{ body: typeof createCategorySchema }>,
  res: Response
) {
  const { name_en, name_ar, image } = req.body
  const category = await prismaClient.category.create({
    data: {
      name_en,
      name_ar,
      image,
    },
  })
  res.status(201).json({
    message: req.t("category_created_successfully", { ns: "translations" }),
    data: stripLangKeys(category),
  })
}

export async function getCategoriesHandler(req: Request, res: Response) {
  const lang = req.language
  const locale = lang === "ar" ? "name_ar" : "name_en"
  const categories = await prismaClient.category.findMany({
    select: {
      id: true,
      [locale]: true,
      image: true,
    },
    orderBy: {
      id: "asc",
    },
  })

  res.json({
    message: req.t("categories_fetched_successfully", { ns: "translations" }),
    data: stripLangKeys(categories),
  })
}

export async function updateCategoryHandler(
  req: ValidatedRequest<{ body: typeof updateCategorySchema; params: typeof categoryIdSchema }>,
  res: Response
) {
  const { id } = req.params

  const { name_en, name_ar, image } = req.body

  const category = await prismaClient.category.update({
    where: { id: Number(id) },
    data: {
      name_en,
      name_ar,
      image,
    },
  })

  res.json({
    message: req.t("category_updated_successfully", { ns: "translations" }),
    data: category,
  })
}

export async function deleteCategoryHandler(
  req: ValidatedRequest<{ params: typeof categoryIdSchema }>,
  res: Response
) {
  const { id } = req.params

  await prismaClient.category.delete({
    where: { id: Number(id) },
  })

  res.json({
    message: req.t("category_deleted_successfully", { ns: "translations" }),
  })
}
