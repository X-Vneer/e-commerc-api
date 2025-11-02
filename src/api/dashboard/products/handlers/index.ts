import type { Response } from "express"
import type { ValidatedRequest } from "express-zod-safe"

import type { paginationParamsSchema } from "../../../../schemas/pagination-params.js"
import type { createProductSchema } from "../schemas/index.js"

import prismaClient from "../../../../prisma/index.js"

export async function getProductsHandler(
  req: ValidatedRequest<{ query: typeof paginationParamsSchema }>,
  res: Response
) {
  const { page, limit } = req.query

  const products = await prismaClient.product.findMany({
    take: limit,
    skip: (page - 1) * limit,
    include: {
      categories: true,
      colors: {
        include: {
          sizes: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })
  const total = await prismaClient.product.count()
  res.json({
    message: req.t("products_fetched_successfully", { ns: "translations" }),
    data: products,
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
      name_en,
      name_ar,
      description_en,
      description_ar,
      price,
      main_image_url: colors[0].image,
      is_active,
      categories: { connect: category_ids.map((id) => ({ id })) },
      colors: {
        create: colors.map((color) => ({
          name_en: color.name_en,
          name_ar: color.name_ar,
          image: color.image,
          sizes: {
            create: color.sizes.map((size) => ({
              size: { connect: { code: size.size_code } },
              amount: size.amount,
              hip: size.hip,
              chest: size.chest,
            })),
          },
        })),
      },
    },
    include: {
      categories: true,
      colors: {
        include: {
          sizes: true,
        },
      },
    },
  })
  res
    .status(201)
    .json({ message: req.t("product_created_successfully", { ns: "translations" }), data: product })
}
