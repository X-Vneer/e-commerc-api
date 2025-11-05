import type { Prisma } from "@prisma/client"

export const productFullData: Prisma.ProductInclude = {
  categories: {
    select: {
      category: {
        select: {
          id: true,
          name_en: true,
          name_ar: true,
          slug: true,
          image: true,
        },
      },
    },
  },
  colors: {
    include: {
      sizes: {
        include: {
          inventories: {
            include: {
              location: true,
            },
          },
        },
      },
    },
  },
}
