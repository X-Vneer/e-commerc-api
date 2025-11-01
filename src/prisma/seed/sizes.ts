import prismaClient from "../index.js"

export async function seedSizes() {
  const sizes = [
    { id: 1, code: "S", weight: "100g" },
    { id: 2, code: "M", weight: "200g" },
    { id: 3, code: "L", weight: "300g" },
    { id: 4, code: "XL", weight: "400g" },
    { id: 5, code: "2xL", weight: "500g" },
    { id: 6, code: "3XL", weight: "600g" },
    { id: 7, code: "4XL", weight: "700g" },
    { id: 8, code: "5XL", weight: "800g" },
    { id: 9, code: "6XL", weight: "900g" },
    { id: 10, code: "7XL", weight: "1000g" },
    { id: 11, code: "8XL", weight: "1000g" },
    { id: 12, code: "9XL", weight: "1000g" },
    { id: 12, code: "10XL", weight: "1000g" },
    { id: 12, code: "11XL", weight: "1000g" },
    { id: 12, code: "12XL", weight: "1000g" },

  ]

  await prismaClient.size.createMany({
    data: sizes,
    skipDuplicates: true,
  })

  console.log("✅ Sizes seeded")
}
