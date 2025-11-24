import type { Prisma } from "@/generated/client.js"

export function cartActiveProductInclude(lang: "en" | "ar") {
  const name = lang === "en" ? "name_en" : "name_ar"
  const description = lang === "en" ? "description_en" : "description_ar"
  const select = {
    items: {
      where: {
        color: {
          // active products only
          product: {
            is_active: true,
          },
        },

        // Check inventory for the specific size in the cart item
        size: {
          inventories: {
            some: {
              amount: { gt: 0 },
            },
          },
        },
      },
      select: {
        id: true,
        quantity: true,
        size_code: true,
        size: {
          select: {
            id: true,
            size_code: true,
            inventories: {
              where: {
                amount: { gt: 0 },
              },
              select: {
                id: true,
                amount: true,
                sold: true,
                branch: {
                  select: {
                    id: true,
                    [name]: true,
                  },
                },
              },
            },
          },
        },

        color: {
          select: {
            id: true,
            [name]: true,
            image: true,
            product: {
              select: {
                id: true,
                [name]: true,
                code: true,
                [description]: true,
                main_image_url: true,
              },
            },
          },
        },
      },

      orderBy: {
        id: "desc",
      },
    },
  } satisfies Prisma.CartInclude
  return select
}
