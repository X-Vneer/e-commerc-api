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
  const { page, limit, is_active, category_id, q, empty_inventories, fully_empty_inventories } = req.query

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

export async function getProductHandler(req: ValidatedRequest<{ params: typeof productIdSchema }>, res: Response) {
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

export async function createProductHandler(req: ValidatedRequest<{ body: typeof createProductSchema }>, res: Response) {
  const { code, name_en, name_ar, description_en, description_ar, price, is_active, category_ids, colors } = req.body

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
  const productId = Number(id)
  const { code, name_en, name_ar, description_en, description_ar, price, category_ids, colors } = req.body

  // Build the base update data object with only provided fields
  const updateData: Prisma.ProductUpdateInput = {
    code,
    name_en,
    slug: slugify(name_en),
    name_ar,
    description_en,
    description_ar,
    price,
    // update main image from first color
    main_image_url: colors[0].image,
    ...(category_ids
      ? {
          categories: {
            set: category_ids.map((categoryId) => ({
              id: categoryId,
            })),
          },
        }
      : {}),
  }

  // Handle colors update/delete/create based on name_en
  if (colors) {
    // Get existing colors for this product
    const existingColors = await prismaClient.color.findMany({
      where: { product_id: productId },
      select: { id: true, name_en: true },
    })

    const requestedColorNames = new Set(colors.map((c) => c.name_en))

    // Colors to delete (exist in DB but not in request)
    const colorsToDelete = existingColors.filter((c) => !requestedColorNames.has(c.name_en))

    // Colors to update/create
    const colorsToUpsert = colors.map((color) => {
      const existingColor = existingColors.find((c) => c.name_en === color.name_en)

      const colorData: Prisma.ColorCreateInput = {
        product: { connect: { id: productId } },
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
      }

      const updateData: Prisma.ColorUpdateInput = {
        name_en: color.name_en,
        name_ar: color.name_ar,
        image: color.image,
        sizes: {
          deleteMany: {}, // Delete all existing sizes for this color
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
      }

      return {
        existingColorId: existingColor?.id,
        colorData,
        updateData,
      }
    })

    // Use transaction to handle all color operations
    await prismaClient.$transaction(async (tx) => {
      // Delete colors that are not in the request
      if (colorsToDelete.length > 0) {
        await tx.color.deleteMany({
          where: {
            id: { in: colorsToDelete.map((c) => c.id) },
          },
        })
      }

      // Upsert colors (update existing or create new)
      for (const colorUpsert of colorsToUpsert) {
        if (colorUpsert.existingColorId) {
          // Update existing color
          await tx.color.update({
            where: { id: colorUpsert.existingColorId },
            data: colorUpsert.updateData,
          })
        } else {
          // Create new color
          await tx.color.create({
            data: colorUpsert.colorData,
          })
        }
      }
    })
  }

  const product = await prismaClient.product.update({
    where: { id: productId },
    data: updateData,
    include: productFullData,
  })

  res.json({
    message: req.t("product_updated_successfully", { ns: "translations" }),
    data: product,
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

export async function deleteProductHandler(req: ValidatedRequest<{ params: typeof productIdSchema }>, res: Response) {
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
