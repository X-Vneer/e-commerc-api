import type { Prisma } from "@/generated/client.js"

import prismaClient from "../index.js"

export async function seedBranches() {
  const branches: Prisma.BranchCreateManyInput[] = [
    {
      id: 1,
      name_en: "Dubai Mall Branch",
      name_ar: "فرع دبي مول",
      code: "DXB-MALL-001",
    },
    {
      id: 2,
      name_en: "Abu Dhabi Marina Branch",
      name_ar: "فرع مارينا أبو ظبي",
      code: "AUH-MARINA-001",
    },
  ]

  await prismaClient.branch.createMany({
    data: branches,
    skipDuplicates: true,
  })

  console.warn("✅ Branches seeded")
}
