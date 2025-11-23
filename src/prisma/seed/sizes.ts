import type { Prisma } from "@/generated/client.js"

import prismaClient from "@/prisma/index.js"

export async function seedSizes() {
  const sizes: Prisma.SizeCreateManyInput[] = [
    { code: "S", weight: "100g" },
    { code: "M", weight: "200g" },
    { code: "L", weight: "300g" },
    { code: "XL", weight: "400g" },
    { code: "2xL", weight: "500g" },
    { code: "3XL", weight: "600g" },
    { code: "4XL", weight: "700g" },
    { code: "5XL", weight: "800g" },
    { code: "6XL", weight: "900g" },
    { code: "7XL", weight: "1000g" },
    { code: "8XL", weight: "1000g" },
    { code: "9XL", weight: "1000g" },
    { code: "10XL", weight: "1000g" },
    { code: "11XL", weight: "1000g" },
    { code: "12XL", weight: "1000g" },
    { code: "free-size", weight: "0g" },
  ]

  await prismaClient.size.createMany({
    data: sizes,
    skipDuplicates: true,
  })

  console.log("✅ Sizes seeded")
}
