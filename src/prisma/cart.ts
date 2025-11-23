import type { Prisma } from "@/generated/client.js"

export const cartActiveProductInclude: Prisma.CartInclude = {
  items: {
    where: {
      color: {
        // active products only
        product: {
          is_active: true,
        },
      },
    },
    include: {
      size: true,
      color: {
        include: {
          product: true,
          sizes: true,
        },
      },
    },
    orderBy: {
      id: "desc",
    },
  },
}
