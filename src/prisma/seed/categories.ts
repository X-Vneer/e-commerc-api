import type { Prisma } from "@/generated/client.js"

import prismaClient from "../index.js"

export async function seedCategories() {
  const categories: Prisma.CategoryCreateManyInput[] = [
    {
      name_en: "Dresses",
      name_ar: "فساتين",
      image: "https://via.placeholder.com/150",
      slug: "dresses",
    },
    {
      name_en: "Skirts",
      name_ar: "تنانير",
      image: "https://via.placeholder.com/150",
      slug: "skirts",
    },
    {
      name_en: "Jackets & Coats",
      name_ar: "جاكيتات ومعاطف",
      image: "https://via.placeholder.com/150",
      slug: "jackets-coats",
    },
    {
      name_en: "Sweaters & Cardigans",
      name_ar: "سترات وكنزات",
      image: "https://via.placeholder.com/150",
      slug: "sweaters-cardigans",
    },
    {
      name_en: "Activewear",
      name_ar: "ملابس رياضية",
      image: "https://via.placeholder.com/150",
      slug: "activewear",
    },
    {
      name_en: "Swimwear",
      name_ar: "ملابس سباحة",
      image: "https://via.placeholder.com/150",
      slug: "swimwear",
    },

    {
      name_en: "Bags & Handbags",
      name_ar: "حقائب",
      image: "https://via.placeholder.com/150",
      slug: "bags-handbags",
    },
    {
      name_en: "Accessories",
      name_ar: "إكسسوارات",
      image: "https://via.placeholder.com/150",
      slug: "accessories",
    },
  ]

  await prismaClient.category.createMany({
    data: categories,
    skipDuplicates: true,
  })

  console.log("✅ Categories seeded")
}
