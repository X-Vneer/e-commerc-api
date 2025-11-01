import prismaClient from "../index.js"

export async function seedCategories() {
  const categories = [
    {
      name_en: "Dresses",
      name_ar: "فساتين",
      image: "/images/categories/dresses.jpg",
    },
    {
      name_en: "Tops & Blouses",
      name_ar: "قمصان وبلوزات",
      image: "/images/categories/tops.jpg",
    },
    {
      name_en: "Pants & Trousers",
      name_ar: "بنطلونات وسراويل",
      image: "/images/categories/pants.jpg",
    },
    {
      name_en: "Skirts",
      name_ar: "تنانير",
      image: "/images/categories/skirts.jpg",
    },
    {
      name_en: "Jackets & Coats",
      name_ar: "جاكيتات ومعاطف",
      image: "/images/categories/jackets.jpg",
    },
    {
      name_en: "Sweaters & Cardigans",
      name_ar: "سترات وكنزات",
      image: "/images/categories/sweaters.jpg",
    },
    {
      name_en: "Activewear",
      name_ar: "ملابس رياضية",
      image: "/images/categories/activewear.jpg",
    },
    {
      name_en: "Intimates & Lingerie",
      name_ar: "ملابس داخلية",
      image: "/images/categories/lingerie.jpg",
    },
    {
      name_en: "Swimwear",
      name_ar: "ملابس سباحة",
      image: "/images/categories/swimwear.jpg",
    },
    {
      name_en: "Shoes",
      name_ar: "أحذية",
      image: "/images/categories/shoes.jpg",
    },
    {
      name_en: "Bags & Handbags",
      name_ar: "حقائب",
      image: "/images/categories/bags.jpg",
    },
    {
      name_en: "Accessories",
      name_ar: "إكسسوارات",
      image: "/images/categories/accessories.jpg",
    },
    {
      name_en: "Jewelry",
      name_ar: "مجوهرات",
      image: "/images/categories/jewelry.jpg",
    },
    {
      name_en: "Jeans",
      name_ar: "جينز",
      image: "/images/categories/jeans.jpg",
    },
    {
      name_en: "Shorts",
      name_ar: "شورتات",
      image: "/images/categories/shorts.jpg",
    },
  ]

  await prismaClient.category.createMany({
    data: categories,
    skipDuplicates: true,
  })

  console.log("✅ Categories seeded")
}

