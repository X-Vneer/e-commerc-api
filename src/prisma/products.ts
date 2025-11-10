import type { Prisma } from "@prisma/client"

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
