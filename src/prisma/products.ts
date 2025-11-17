import type { Prisma } from "@prisma/client"

export const NOT_PLUS_SIZES = ["S", "M", "L", "XL", "2xL", "3XL", "4XL", "free-size"]

export const productFullData = {
  categories: true,
  colors: {
    include: {
      sizes: {
        include: {
          inventories: true,
        },
      },
    },
  },
} satisfies Prisma.ProductInclude

export function colorBaseInclude(userId?: string) {
  return {
    product: {
      include: {
        categories: true,
        colors: true,
      },
    },
    sizes: {
      include: {
        inventories: true,
      },
    },
    ...(userId && { favorite_by: { where: { id: userId }, select: { id: true } } }),
  } satisfies Prisma.ColorInclude
}

export type ColorFullData = Prisma.ColorGetPayload<{
  include: ReturnType<typeof colorBaseInclude>
}>

export function ColorIncludeWithProductAndPlusSizesAndFavoriteBy(userId?: string) {
  return {
    product: {
      include: {
        categories: {
          select: { id: true, name_ar: true, name_en: true, slug: true },
        },
      },
    },

    sizes: {
      // for plus sizes
      where: {
        size_code: {
          notIn: NOT_PLUS_SIZES,
        },
      },
    },
    // favorite_by is only included if userId is provided
    ...(userId && { favorite_by: { where: { id: userId }, select: { id: true } } }),
  } satisfies Prisma.ColorInclude
}

export type ColorWithProductAndPlusSizesAndFavoriteBy = Prisma.ColorGetPayload<{
  include: ReturnType<typeof ColorIncludeWithProductAndPlusSizesAndFavoriteBy>
}>
