import type { Prisma } from "@prisma/client"
import type { Response } from "express"
import type { ValidatedRequest } from "express-zod-safe"

import type { paginationParamsSchema } from "../../../../schemas/pagination-params.js"
import type { createProductSchema, productIdSchema, updateProductSchema } from "../schemas/index.js"

import prismaClient from "../../../../prisma/index.js"
import { productFullData } from "../../../../prisma/products.js"
import stripLangKeys from "../../../../utils/obj-select-lang.js"
import { slugify } from "../../../../utils/slugify.js"

export async function getProductsHandler(
  req: ValidatedRequest<{ query: typeof paginationParamsSchema }>,
  res: Response
) {
  const { page, limit } = req.query

  const products = await prismaClient.product.findMany({
    take: limit,
    skip: (page - 1) * limit,
    include: productFullData,
    orderBy: {
      createdAt: "desc",
    },
  })
  const total = await prismaClient.product.count()
  res.json({
    message: req.t("products_fetched_successfully", { ns: "translations" }),
    data: stripLangKeys(products),
    pagination: { page, limit, total, last_page: Math.ceil(total / limit) },
  })
}
export async function createProductHandler(
  req: ValidatedRequest<{ body: typeof createProductSchema }>,
  res: Response
) {
  const {
    code,
    name_en,
    name_ar,
    description_en,
    description_ar,
    price,
    is_active,
    category_ids,
    colors,
  } = req.body

  const product = await prismaClient.product.create({
    data: {
      code,
      slug: slugify(name_en),
      name_en,
      name_ar,
      description_en,
      description_ar,
      price,
      main_image_url: colors[0].image,
      is_active,
      categories: {
        create: category_ids.map((categoryId) => ({
          category: { connect: { id: categoryId } },
        })),
      },
      colors: {
        create: colors.map((color) => ({
          name_en: color.name_en,
          name_ar: color.name_ar,
          image: color.image,
          sizes: {
            create: color.sizes.map((size) => ({
              size: { connect: { code: size.size_code } },
              hip: size.hip,
              chest: size.chest,
            })),
          },
        })),
      },
    },
    include: productFullData,
  })
  res.status(201).json({
    message: req.t("product_created_successfully", { ns: "translations" }),
    data: stripLangKeys(product),
  })
}

export async function updateProductHandler(
  req: ValidatedRequest<{ body: typeof updateProductSchema; params: typeof productIdSchema }>,
  res: Response
) {
  const { id } = req.params
  const {
    code,
    name_en,
    name_ar,
    description_en,
    description_ar,
    price,
    is_active,
    is_featured,
    is_best_seller,
    category_ids,
  } = req.body

  // Build the update data object with only provided fields
  const updateData: Partial<Prisma.ProductUpdateInput> = {
    code,
    name_en,
    name_ar,
    description_en,
    description_ar,
    price,
    is_active,
    is_featured,
    is_best_seller,
    ...(category_ids
      ? {
          categories: {
            deleteMany: {},
            create: category_ids.map((categoryId) => ({
              category: { connect: { id: categoryId } },
            })),
          },
        }
      : {}),
  }

  const product = await prismaClient.product.update({
    where: { id: Number(id) },
    data: updateData,
    include: productFullData,
  })

  res.json({
    message: req.t("product_updated_successfully", { ns: "translations" }),
    data: stripLangKeys(product),
  })
}
