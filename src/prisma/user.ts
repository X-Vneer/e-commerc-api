import type { Prisma } from "../generated/prisma/index.js"

export const userSelectWithoutPassword: (lang: string) => Prisma.UserSelect = (lang) => {
  return {
    id: true,
    phone: true,
    email: true,
    name: true,
    address: true,
    region: {
      select: {
        id: true,
        [lang === "en" ? "name_en" : "name_ar"]: true,
        emirate: {
          select: {
            [lang === "en" ? "name_en" : "name_ar"]: true,
          },
        },
      },
    },
  }
}
