import prismaClient from "../index.js"

export async function seedEmirates() {
  const emirates = [
    { id: 1, name_en: "Abu Dhabi", name_ar: "أبو ظبي" },
    { id: 2, name_en: "Dubai", name_ar: "دبي" },
    { id: 3, name_en: "Sharjah", name_ar: "الشارقة" },
    { id: 4, name_en: "Ajman", name_ar: "عجمان" },
    { id: 5, name_en: "Umm Al Quwain", name_ar: "أم القيوين" },
    { id: 6, name_en: "Ras Al Khaimah", name_ar: "رأس الخيمة" },
    { id: 7, name_en: "Fujairah", name_ar: "الفجيرة" },
  ]

  await prismaClient.emirate.createMany({
    data: emirates,
    skipDuplicates: true,
  })

  console.log("✅ Emirates seeded")
}
