import type { Request, Response } from "express"
import type { ValidatedRequest } from "express-zod-safe"

import jwt from "jsonwebtoken"

import type { numberIdSchema } from "@/schemas/number-id-schema"

import { env } from "@/env.js"
import prismaClient from "@/prisma"

import type { toggleFavoriteSchema } from "../schemas/index.js"

export async function getProductsHandler(req: Request, res: Response) {
  // get user id from token
  const authHeader = req.headers.authorization
  let userId = null

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1]
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET)
      userId = (decoded as jwt.JwtPayload).userId
    } catch (_error) {
      return
    }
  }

  // language
  const language = req.language
  const name = language === "ar" ? "name_ar" : "name_en"

  const products = await prismaClient.color.findMany({
    where: {
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
    },
    include: {
      product: {
        include: {
          categories: true,
          ...(userId && { favorite_by: { where: { id: userId }, select: { id: true } } }),
        },
      },
      sizes: {
        include: {
          inventories: true,
        },
      },
    },
  })

  const productsWithFavorite = products.map((color) => {
    return {
      id: color.id,
      slug: color.product.slug,
      main_image_url: color.product.main_image_url,
      price: color.product.price,
      code: color.product.code,
      product_id: color.product.id,
      product_name: `${color.product[name]} - ${color[name]}`,
      color_name: color[name],
      is_favorite: color.product.favorite_by.length > 0,
      categories: color.product.categories,
    }
  })

  res.json({
    message: req.t("products_fetched_successfully", { ns: "translations" }),
    data: productsWithFavorite,
  })
}

export async function toggleFavoriteHandler(
  req: ValidatedRequest<{ params: typeof numberIdSchema; body: typeof toggleFavoriteSchema }>,
  res: Response
) {
  const { id } = req.params
  const { is_favorite } = req.body
  const productId = Number(id)

  const product = await prismaClient.product.findUnique({
    where: { id: productId },
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

  const updatedProduct = await prismaClient.product.update({
    where: { id: productId },
    data: favoriteUpdate,
    include: {
      favorite_by: {
        where: { id: req.userId },
        select: { id: true },
      },
    },
  })
  const { favorite_by, ...productData } = updatedProduct

  res.json({
    message: req.t("product_updated_successfully", { ns: "translations" }),
    data: {
      ...productData,
      is_favorite: favorite_by.length > 0,
    },
  })
}
