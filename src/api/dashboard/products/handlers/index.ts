import type { Prisma } from "@prisma/client"
import type { Response } from "express"
import type { ValidatedRequest } from "express-zod-safe"

import prismaClient from "@/prisma/index.js"
import { productFullData } from "@/prisma/products.js"
import stripLangKeys from "@/utils/obj-select-lang.js"
import { slugify } from "@/utils/slugify.js"

import type {
  createProductSchema,
  productIdSchema,
  productQueryWithPaginationSchema,
  updateActivitySchema,
  updateProductSchema,
} from "../schemas/index.js"

export async function getProductsHandler(
  req: ValidatedRequest<{ query: typeof productQueryWithPaginationSchema }>,
  res: Response
) {
  const { page, limit, is_active, category_id, q, empty_inventories, fully_empty_inventories } =
    req.query

  const where: Prisma.ProductWhereInput = {
    ...(is_active !== undefined && { is_active }),

    ...(category_id && {
      categories: { some: { id: category_id } },
    }),

    ...(q && {
      OR: [{ code: { contains: q } }, { name_en: { contains: q } }, { name_ar: { contains: q } }],
    }),

    ...(empty_inventories && {
      colors: {
        some: {
          sizes: {
            some: {
              inventories: { some: { amount: 0 } },
            },
          },
        },
      },
    }),

    ...(fully_empty_inventories && {
      NOT: {
        colors: {
          some: {
            sizes: {
              some: {
                inventories: { some: { amount: { gt: 0 } } },
              },
            },
          },
        },
      },
    }),
  }

  // Execute queries in parallel for better performance
  const [products, total] = await Promise.all([
    prismaClient.product.findMany({
      where,
      take: limit,
      skip: (page - 1) * limit,
      include: productFullData,
      orderBy: {
        createdAt: "desc",
      },
    }),
    prismaClient.product.count({ where }),
  ])

  res.json({
    message: req.t("products_fetched_successfully", { ns: "translations" }),
    data: stripLangKeys(products),
    pagination: {
      page,
      limit,
      total,
      last_page: Math.ceil(total / limit),
    },
  })
}

export async function getProductHandler(
  req: ValidatedRequest<{ params: typeof productIdSchema }>,
  res: Response
) {
  const { id } = req.params
  const product = await prismaClient.product.findFirst({
    where: { id: Number(id) },
    include: productFullData,
  })
  if (!product) {
    res.status(404).json({
      message: req.t("product_product_not_fount", { ns: "translations" }),
    })
    return
  }
  res.json({
    message: req.t("product_fetched_successfully", { ns: "translations" }),
    data: product,
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
        connect: category_ids.map((categoryId) => ({ id: categoryId })),
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
              inventories: {
                create: size.inventories.map((inventory) => ({
                  branch: { connect: { id: inventory.branch_id } },
                  amount: inventory.amount,
                })),
              },
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
            connect: category_ids.map((categoryId) => ({
              id: categoryId,
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

export async function updateActivityHandler(
  req: ValidatedRequest<{ params: typeof productIdSchema; body: typeof updateActivitySchema }>,
  res: Response
) {
  const { id } = req.params
  const { is_active } = req.body

  const product = await prismaClient.product.update({
    where: { id: Number(id) },
    data: { is_active },
    include: productFullData,
  })

  res.json({
    message: req.t("product_updated_successfully", { ns: "translations" }),
    data: stripLangKeys(product),
  })
}

export async function deleteProductHandler(
  req: ValidatedRequest<{ params: typeof productIdSchema }>,
  res: Response
) {
  const { id } = req.params
  await prismaClient.product.delete({
    where: {
      id,
    },
  })
  res.json({
    message: req.t("product_deleted_successfully", { ns: "translations" }),
  })
}
