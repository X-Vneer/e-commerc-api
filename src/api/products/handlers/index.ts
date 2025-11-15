import type { Prisma } from "@prisma/client"
import type { Response } from "express"
import type { ValidatedRequest } from "express-zod-safe"

import type { numberIdSchema } from "@/schemas/number-id-schema"
import type { paginationParamsSchema } from "@/schemas/pagination-params.js"

import prismaClient from "@/prisma"

import type { toggleFavoriteSchema } from "../schemas/index.js"

export async function getProductsHandler(
  req: ValidatedRequest<{ query: typeof paginationParamsSchema }>,
  res: Response
) {
  const userId = req.userId
  const language = req.language
  const name = language === "ar" ? "name_ar" : "name_en"

  const { page, limit } = req.query

  const where: Prisma.ColorWhereInput = {
    // active products only
    product: {
      is_active: true,
    },
    sizes: {
      some: {
        inventories: {
          some: {
            amount: { gt: 0 },
          },
        },
      },
    },
  }

  const include = {
    product: {
      include: {
        categories: {
          select: {
            id: true,
            [name]: true,
            slug: true,
          },
        },
      },
    },

    sizes: {
      where: {
        size_code: {
          notIn: ["S", "M", "L", "XL", "2xL", "3XL", "4XL", "free-size"],
        },
      },
    },
    // favorite_by is only included if userId is provided
    ...(userId && { favorite_by: { where: { id: userId }, select: { id: true } } }),
  } satisfies Prisma.ColorInclude

  const [products, total] = await Promise.all([
    prismaClient.color.findMany({
      take: limit,
      skip: (page - 1) * limit,
      where,
      include,
      orderBy: {
        product: {
          createdAt: "desc",
        },
      },
    }),
    prismaClient.color.count({ where }),
  ])

  const formattedProducts = products.map((color) => {
    return {
      id: color.id,
      slug: color.product.slug,
      name: `${color.product[name]} - ${color[name]}`,
      main_image_url: color.product.main_image_url,
      price: color.product.price,
      code: color.product.code,
      product_id: color.product.id,
      product_name: color.product[name],
      color_name: color[name],
      categories: color.product.categories.map((category) => ({
        id: category.id,
        name: category[name],
        slug: category.slug,
      })),
      has_plus_size: color.sizes.map((size) => size.size_code).length > 0,
      is_favorite: color.favorite_by.length > 0,
    }
  })

  res.json({
    message: req.t("products_fetched_successfully", { ns: "translations" }),
    data: formattedProducts,
    pagination: {
      page,
      limit,
      total,
      last_page: Math.ceil(total / limit),
    },
  })
}

export async function toggleFavoriteHandler(
  req: ValidatedRequest<{ params: typeof numberIdSchema; body: typeof toggleFavoriteSchema }>,
  res: Response
) {
  const { id } = req.params
  const { is_favorite } = req.body
  const colorId = Number(id)

  const product = await prismaClient.color.findUnique({
    where: { id: colorId },
  })
  if (!product) {
    res.status(404).json({
      message: req.t("product_product_not_fount", { ns: "translations" }),
    })
    return
  }

  const favoriteUpdate = is_favorite
    ? { favorite_by: { connect: { id: req.userId } } }
    : { favorite_by: { disconnect: { id: req.userId } } }

  const updatedColor = await prismaClient.color.update({
    where: { id: colorId },
    data: favoriteUpdate,
    include: {
      product: true,
      favorite_by: { where: { id: req.userId }, select: { id: true } },
    },
  })
  const { favorite_by, ...colorData } = updatedColor

  res.json({
    message: req.t("product_updated_successfully", { ns: "translations" }),
    data: {
      ...colorData,
      is_favorite: favorite_by.length > 0,
    },
  })
}
