import type { Prisma } from "@prisma/client"

export const productFullData: Prisma.ProductInclude = {
  categories: true,
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
