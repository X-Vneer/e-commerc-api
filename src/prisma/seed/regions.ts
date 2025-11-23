import type { Prisma } from "@/generated/client.js"

import prismaClient from "@/prisma/index.js"

export async function seedRegions() {
  const regions: Prisma.RegionCreateManyInput[] = [
    // Abu Dhabi (1)
    { id: 1, name_en: "Abu Dhabi City", name_ar: "مدينة أبو ظبي", emirate_id: 1 },
    { id: 2, name_en: "Khalifa City", name_ar: "خليفة سيتي", emirate_id: 1 },
    { id: 3, name_en: "Mussafah", name_ar: "المصفح", emirate_id: 1 },
    { id: 4, name_en: "Al Ain", name_ar: "العين", emirate_id: 1 },
    { id: 5, name_en: "Al Dhafra", name_ar: "الظفرة", emirate_id: 1 },
    { id: 6, name_en: "Ruwais", name_ar: "الرويس", emirate_id: 1 },

    // Dubai (2)
    { id: 7, name_en: "Dubai City", name_ar: "مدينة دبي", emirate_id: 2 },
    { id: 8, name_en: "Deira", name_ar: "ديرة", emirate_id: 2 },
    { id: 9, name_en: "Bur Dubai", name_ar: "بر دبي", emirate_id: 2 },
    { id: 10, name_en: "Jumeirah", name_ar: "جميرا", emirate_id: 2 },
    { id: 11, name_en: "Jebel Ali", name_ar: "جبل علي", emirate_id: 2 },
    { id: 12, name_en: "Business Bay", name_ar: "بيزنس باي", emirate_id: 2 },
    { id: 13, name_en: "Dubai Marina", name_ar: "مرسى دبي", emirate_id: 2 },
    { id: 14, name_en: "Al Barsha", name_ar: "البرشاء", emirate_id: 2 },
    { id: 15, name_en: "Al Quoz", name_ar: "القوز", emirate_id: 2 },

    // Sharjah (3)
    { id: 16, name_en: "Sharjah City", name_ar: "مدينة الشارقة", emirate_id: 3 },
    { id: 17, name_en: "Al Dhaid", name_ar: "الذيد", emirate_id: 3 },
    { id: 18, name_en: "Khor Fakkan", name_ar: "خورفكان", emirate_id: 3 },
    { id: 19, name_en: "Kalba", name_ar: "كلباء", emirate_id: 3 },
    { id: 20, name_en: "Dibba Al Hisn", name_ar: "دبا الحصن", emirate_id: 3 },

    // Ajman (4)
    { id: 21, name_en: "Ajman City", name_ar: "مدينة عجمان", emirate_id: 4 },
    { id: 22, name_en: "Al Hamidiyah", name_ar: "الحميدية", emirate_id: 4 },
    { id: 23, name_en: "Al Jurf", name_ar: "الجرف", emirate_id: 4 },
    { id: 24, name_en: "Manama", name_ar: "منامة", emirate_id: 4 },

    // Umm Al Quwain (5)
    { id: 25, name_en: "Umm Al Quwain City", name_ar: "مدينة أم القيوين", emirate_id: 5 },
    { id: 26, name_en: "Falaj Al Mualla", name_ar: "فلج المعلا", emirate_id: 5 },
    { id: 27, name_en: "Al Salamah", name_ar: "السلامة", emirate_id: 5 },

    // Ras Al Khaimah (6)
    { id: 28, name_en: "Ras Al Khaimah City", name_ar: "مدينة رأس الخيمة", emirate_id: 6 },
    { id: 29, name_en: "Al Hamra", name_ar: "الحمرا", emirate_id: 6 },
    { id: 30, name_en: "Khatt", name_ar: "خات", emirate_id: 6 },
    { id: 31, name_en: "Shamal", name_ar: "شمل", emirate_id: 6 },
    { id: 32, name_en: "Rams", name_ar: "رأس", emirate_id: 6 },

    // Fujairah (7)
    { id: 33, name_en: "Fujairah City", name_ar: "مدينة الفجيرة", emirate_id: 7 },
    { id: 34, name_en: "Dibba Al Fujairah", name_ar: "دبا الفجيرة", emirate_id: 7 },
    { id: 35, name_en: "Masafi", name_ar: "مصفى", emirate_id: 7 },
    { id: 36, name_en: "Al Aqah", name_ar: "العقة", emirate_id: 7 },
  ]

  await prismaClient.region.createMany({
    data: regions,
    skipDuplicates: true,
  })

  console.log("✅ Regions seeded with numeric IDs")
}
