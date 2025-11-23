import type { Response } from "express"
import type { ValidatedRequest } from "express-zod-safe"

import type { Prisma } from "@/generated/client.js"
import type { numberIdSchema } from "@/schemas/number-id-schema"
import type { paginationParamsSchema } from "@/schemas/pagination-params.js"

import prismaClient from "@/prisma/index.js"
import {
  colorBaseInclude,
  ColorIncludeWithProductAndPlusSizesAndFavoriteBy,
  NOT_PLUS_SIZES,
} from "@/prisma/products.js"

import type { productQueryWithPaginationSchema, toggleFavoriteSchema } from "../schemas/index.js"

import { formatColorFullData } from "../utils/format-color-full-data.js"
import { formatColorWithProduct } from "../utils/format-color.js"

export async function getProductsHandler(
  req: ValidatedRequest<{ query: typeof productQueryWithPaginationSchema }>,
  res: Response
) {
  const language = req.language as "ar" | "en"

  const { page, limit, category_id, has_plus_size, size_id } = req.query

  const where: Prisma.ColorWhereInput = {
    product: {
      is_active: true,
      ...(category_id && {
        categories: { some: { id: category_id } },
      }),
    },
    sizes: {
      some: {
        inventories: {
          some: {
            amount: { gt: 0 },
          },
        },

        ...(has_plus_size || size_id
          ? {
              OR: [
                ...(has_plus_size
                  ? [
                      {
                        size_code: {
                          notIn: NOT_PLUS_SIZES,
                        },
                      },
                    ]
                  : []),

                ...(size_id
                  ? [
                      {
                        size: {
                          id: size_id,
                        },
                      },
                    ]
                  : []),
              ],
            }
          : {}),
      },
    },
  }

  const include = ColorIncludeWithProductAndPlusSizesAndFavoriteBy(req.userId)

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
    return formatColorWithProduct(color, language)
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

export async function getProductDetailsHandler(
  req: ValidatedRequest<{ params: typeof numberIdSchema }>,
  res: Response
) {
  const { id } = req.params
  const colorId = Number(id)
  const product = await prismaClient.color.findFirst({
    where: { id: colorId },
    include: colorBaseInclude(req.userId),
  })
  if (!product) {
    res.status(404).json({
      message: req.t("product_product_not_fount", { ns: "translations" }),
    })
    return
  }

  res.json({
    message: req.t("product_fetched_successfully", { ns: "translations" }),
    data: formatColorFullData(product, req.language as "ar" | "en"),
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

export async function getFavoritesHandler(
  req: ValidatedRequest<{ query: typeof paginationParamsSchema }>,
  res: Response
) {
  const { page, limit } = req.query

  const include = ColorIncludeWithProductAndPlusSizesAndFavoriteBy(req.userId)

  //
  const where: Prisma.ColorWhereInput = {
    favorite_by: { some: { id: req.userId } },
  }

  const [favorites, total] = await Promise.all([
    prismaClient.color.findMany({
      where,
      take: limit,
      skip: (page - 1) * limit,
      include,
      orderBy: {
        product: {
          createdAt: "desc",
        },
      },
    }),
    prismaClient.color.count({ where }),
  ])

  res.json({
    message: req.t("favorites_fetched_successfully", { ns: "translations" }),
    data: favorites.map((color) => formatColorWithProduct(color, req.language as "ar" | "en")),
    pagination: {
      page,
      limit,
      total,
      last_page: Math.ceil(total / limit),
    },
  })
}
