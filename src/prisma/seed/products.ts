import { slugify } from "../../utils/slugify.js"
import prismaClient from "../index.js"

type ProductData = {
  code: string
  name_en: string
  name_ar: string
  description_en: string
  description_ar: string
  price: number
  main_image_url: string
  is_featured: boolean
  is_best_seller: boolean
  category_id: number
  colors: Array<{
    name_en: string
    name_ar: string
    image: string
    sizes: Array<{
      size_code: string
      hip: number
      chest: number
      inventory: { location_id: number; amount: number }[]
    }>
  }>
}

export async function seedProducts() {
  // Product data with full structure
  const productsData: ProductData[] = [
    {
      code: "PROD001",
      name_en: "Elegant Floral Maxi Dress",
      name_ar: "فساتين ماكسي زهرية أنيقة",
      description_en:
        "A beautiful flowing maxi dress with elegant floral patterns, perfect for special occasions and evening events. Made from high-quality breathable fabric.",
      description_ar:
        "فساتين ماكسي جميلة متدفقة بأنماط زهرية أنيقة، مثالية للمناسبات الخاصة والفعاليات المسائية. مصنوعة من قماش عالي الجودة قابل للتنفس.",
      price: 199.99,
      main_image_url: "https://via.placeholder.com/600/400?text=Elegant+Floral+Maxi+Dress",
      is_featured: true,
      is_best_seller: true,
      category_id: 1, // Dresses
      colors: [
        {
          name_en: "Rose Pink",
          name_ar: "وردي",
          image: "https://via.placeholder.com/400/400?text=Rose+Pink",
          sizes: [
            {
              size_code: "S",
              hip: 90,
              chest: 85,
              inventory: [
                { location_id: 1, amount: 15 },
                { location_id: 2, amount: 10 },
              ],
            },
            {
              size_code: "M",
              hip: 95,
              chest: 90,
              inventory: [
                { location_id: 1, amount: 20 },
                { location_id: 2, amount: 15 },
              ],
            },
            {
              size_code: "L",
              hip: 100,
              chest: 95,
              inventory: [
                { location_id: 1, amount: 18 },
                { location_id: 2, amount: 12 },
              ],
            },
            {
              size_code: "XL",
              hip: 105,
              chest: 100,
              inventory: [
                { location_id: 1, amount: 12 },
                { location_id: 2, amount: 8 },
              ],
            },
            {
              size_code: "2xL",
              hip: 110,
              chest: 105,
              inventory: [
                { location_id: 1, amount: 8 },
                { location_id: 2, amount: 5 },
              ],
            },
          ],
        },
        {
          name_en: "Navy Blue",
          name_ar: "أزرق داكن",
          image: "https://via.placeholder.com/400/400?text=Navy+Blue",
          sizes: [
            {
              size_code: "S",
              hip: 90,
              chest: 85,
              inventory: [
                { location_id: 1, amount: 12 },
                { location_id: 2, amount: 8 },
              ],
            },
            {
              size_code: "M",
              hip: 95,
              chest: 90,
              inventory: [
                { location_id: 1, amount: 18 },
                { location_id: 2, amount: 12 },
              ],
            },
            {
              size_code: "L",
              hip: 100,
              chest: 95,
              inventory: [
                { location_id: 1, amount: 15 },
                { location_id: 2, amount: 10 },
              ],
            },
            {
              size_code: "XL",
              hip: 105,
              chest: 100,
              inventory: [
                { location_id: 1, amount: 10 },
                { location_id: 2, amount: 7 },
              ],
            },
          ],
        },
      ],
    },
    {
      code: "PROD002",
      name_en: "Classic A-Line Skirt",
      name_ar: "تنورة خطية كلاسيكية",
      description_en:
        "Timeless A-line skirt that flatters every figure. Perfect for office wear or casual outings. Available in multiple colors.",
      description_ar:
        "تنورة خطية خالدة تناسب كل جسم. مثالية لملابس المكتب أو الخروجات العادية. متوفرة بألوان متعددة.",
      price: 89.99,
      main_image_url: "https://via.placeholder.com/600/400?text=Classic+A-Line+Skirt",
      is_featured: false,
      is_best_seller: false,
      category_id: 2, // Skirts
      colors: [
        {
          name_en: "Black",
          name_ar: "أسود",
          image: "https://via.placeholder.com/400/400?text=Black",
          sizes: [
            {
              size_code: "S",
              hip: 88,
              chest: 0,
              inventory: [
                { location_id: 1, amount: 25 },
                { location_id: 2, amount: 20 },
              ],
            },
            {
              size_code: "M",
              hip: 93,
              chest: 0,
              inventory: [
                { location_id: 1, amount: 30 },
                { location_id: 2, amount: 25 },
              ],
            },
            {
              size_code: "L",
              hip: 98,
              chest: 0,
              inventory: [
                { location_id: 1, amount: 28 },
                { location_id: 2, amount: 22 },
              ],
            },
            {
              size_code: "XL",
              hip: 103,
              chest: 0,
              inventory: [
                { location_id: 1, amount: 20 },
                { location_id: 2, amount: 15 },
              ],
            },
          ],
        },
        {
          name_en: "Beige",
          name_ar: "بيج",
          image: "https://via.placeholder.com/400/400?text=Beige",
          sizes: [
            {
              size_code: "S",
              hip: 88,
              chest: 0,
              inventory: [
                { location_id: 1, amount: 18 },
                { location_id: 2, amount: 15 },
              ],
            },
            {
              size_code: "M",
              hip: 93,
              chest: 0,
              inventory: [
                { location_id: 1, amount: 22 },
                { location_id: 2, amount: 18 },
              ],
            },
            {
              size_code: "L",
              hip: 98,
              chest: 0,
              inventory: [
                { location_id: 1, amount: 20 },
                { location_id: 2, amount: 16 },
              ],
            },
          ],
        },
      ],
    },
    {
      code: "PROD003",
      name_en: "Warm Winter Jacket",
      name_ar: "سترة شتوية دافئة",
      description_en:
        "Stylish and warm winter jacket with premium insulation. Perfect for cold weather with a modern design that never goes out of style.",
      description_ar:
        "سترة شتوية أنيقة ودافئة مع عزل ممتاز. مثالية للطقس البارد بتصميم عصري لا يخرج عن الموضة أبداً.",
      price: 249.99,
      main_image_url: "https://via.placeholder.com/600/400?text=Warm+Winter+Jacket",
      is_featured: true,
      is_best_seller: false,
      category_id: 3, // Jackets & Coats
      colors: [
        {
          name_en: "Charcoal Gray",
          name_ar: "رمادي فحمي",
          image: "https://via.placeholder.com/400/400?text=Charcoal+Gray",
          sizes: [
            {
              size_code: "M",
              hip: 95,
              chest: 100,
              inventory: [
                { location_id: 1, amount: 15 },
                { location_id: 2, amount: 12 },
              ],
            },
            {
              size_code: "L",
              hip: 100,
              chest: 105,
              inventory: [
                { location_id: 1, amount: 18 },
                { location_id: 2, amount: 15 },
              ],
            },
            {
              size_code: "XL",
              hip: 105,
              chest: 110,
              inventory: [
                { location_id: 1, amount: 16 },
                { location_id: 2, amount: 13 },
              ],
            },
            {
              size_code: "2xL",
              hip: 110,
              chest: 115,
              inventory: [
                { location_id: 1, amount: 12 },
                { location_id: 2, amount: 10 },
              ],
            },
            {
              size_code: "3XL",
              hip: 115,
              chest: 120,
              inventory: [
                { location_id: 1, amount: 8 },
                { location_id: 2, amount: 6 },
              ],
            },
          ],
        },
        {
          name_en: "Camel",
          name_ar: "جمل",
          image: "https://via.placeholder.com/400/400?text=Camel",
          sizes: [
            {
              size_code: "M",
              hip: 95,
              chest: 100,
              inventory: [
                { location_id: 1, amount: 12 },
                { location_id: 2, amount: 10 },
              ],
            },
            {
              size_code: "L",
              hip: 100,
              chest: 105,
              inventory: [
                { location_id: 1, amount: 15 },
                { location_id: 2, amount: 12 },
              ],
            },
            {
              size_code: "XL",
              hip: 105,
              chest: 110,
              inventory: [
                { location_id: 1, amount: 14 },
                { location_id: 2, amount: 11 },
              ],
            },
          ],
        },
      ],
    },
    {
      code: "PROD004",
      name_en: "Cozy Knit Cardigan",
      name_ar: "كنزة محبوكة مريحة",
      description_en:
        "Soft and comfortable knit cardigan perfect for layering. Made from premium soft yarn for ultimate comfort and warmth.",
      description_ar:
        "كنزة محبوكة ناعمة ومريحة مثالية للطبقات. مصنوعة من خيوط ناعمة ممتازة للراحة والدفء القصوى.",
      price: 129.99,
      main_image_url: "https://via.placeholder.com/600/400?text=Cozy+Knit+Cardigan",
      is_featured: false,
      is_best_seller: true,
      category_id: 4, // Sweaters & Cardigans
      colors: [
        {
          name_en: "Cream",
          name_ar: "كريمي",
          image: "https://via.placeholder.com/400/400?text=Cream",
          sizes: [
            {
              size_code: "S",
              hip: 90,
              chest: 88,
              inventory: [
                { location_id: 1, amount: 20 },
                { location_id: 2, amount: 15 },
              ],
            },
            {
              size_code: "M",
              hip: 95,
              chest: 93,
              inventory: [
                { location_id: 1, amount: 25 },
                { location_id: 2, amount: 20 },
              ],
            },
            {
              size_code: "L",
              hip: 100,
              chest: 98,
              inventory: [
                { location_id: 1, amount: 22 },
                { location_id: 2, amount: 18 },
              ],
            },
            {
              size_code: "XL",
              hip: 105,
              chest: 103,
              inventory: [
                { location_id: 1, amount: 18 },
                { location_id: 2, amount: 14 },
              ],
            },
          ],
        },
        {
          name_en: "Sage Green",
          name_ar: "أخضر حكيم",
          image: "https://via.placeholder.com/400/400?text=Sage+Green",
          sizes: [
            {
              size_code: "S",
              hip: 90,
              chest: 88,
              inventory: [
                { location_id: 1, amount: 15 },
                { location_id: 2, amount: 12 },
              ],
            },
            {
              size_code: "M",
              hip: 95,
              chest: 93,
              inventory: [
                { location_id: 1, amount: 20 },
                { location_id: 2, amount: 16 },
              ],
            },
            {
              size_code: "L",
              hip: 100,
              chest: 98,
              inventory: [
                { location_id: 1, amount: 18 },
                { location_id: 2, amount: 15 },
              ],
            },
          ],
        },
      ],
    },
    {
      code: "PROD005",
      name_en: "Athletic Yoga Set",
      name_ar: "طقم يوجا رياضي",
      description_en:
        "Complete yoga set including top and leggings. Made from moisture-wicking fabric for maximum comfort during workouts.",
      description_ar:
        "طقم يوجا كامل يشمل البلوزة والجوارب. مصنوع من قماش طارد للرطوبة للراحة القصوى أثناء التمارين.",
      price: 79.99,
      main_image_url: "https://via.placeholder.com/600/400?text=Athletic+Yoga+Set",
      is_featured: false,
      is_best_seller: false,
      category_id: 5, // Activewear
      colors: [
        {
          name_en: "Black",
          name_ar: "أسود",
          image: "https://via.placeholder.com/400/400?text=Black+Activewear",
          sizes: [
            {
              size_code: "S",
              hip: 88,
              chest: 85,
              inventory: [
                { location_id: 1, amount: 30 },
                { location_id: 2, amount: 25 },
              ],
            },
            {
              size_code: "M",
              hip: 93,
              chest: 90,
              inventory: [
                { location_id: 1, amount: 35 },
                { location_id: 2, amount: 30 },
              ],
            },
            {
              size_code: "L",
              hip: 98,
              chest: 95,
              inventory: [
                { location_id: 1, amount: 32 },
                { location_id: 2, amount: 28 },
              ],
            },
            {
              size_code: "XL",
              hip: 103,
              chest: 100,
              inventory: [
                { location_id: 1, amount: 25 },
                { location_id: 2, amount: 20 },
              ],
            },
          ],
        },
        {
          name_en: "Navy Blue",
          name_ar: "أزرق داكن",
          image: "https://via.placeholder.com/400/400?text=Navy+Blue+Activewear",
          sizes: [
            {
              size_code: "S",
              hip: 88,
              chest: 85,
              inventory: [
                { location_id: 1, amount: 22 },
                { location_id: 2, amount: 18 },
              ],
            },
            {
              size_code: "M",
              hip: 93,
              chest: 90,
              inventory: [
                { location_id: 1, amount: 28 },
                { location_id: 2, amount: 24 },
              ],
            },
            {
              size_code: "L",
              hip: 98,
              chest: 95,
              inventory: [
                { location_id: 1, amount: 25 },
                { location_id: 2, amount: 22 },
              ],
            },
          ],
        },
      ],
    },
    {
      code: "PROD006",
      name_en: "Elegant One-Piece Swimsuit",
      name_ar: "مايوه أنيق بقطعة واحدة",
      description_en:
        "Stylish one-piece swimsuit with elegant design. Perfect for beach and pool activities. Made from quick-dry fabric.",
      description_ar:
        "مايوه أنيق بقطعة واحدة بتصميم أنيق. مثالي لأنشطة الشاطئ والسباحة. مصنوع من قماش سريع الجفاف.",
      price: 119.99,
      main_image_url: "https://via.placeholder.com/600/400?text=Elegant+One-Piece+Swimsuit",
      is_featured: true,
      is_best_seller: false,
      category_id: 6, // Swimwear
      colors: [
        {
          name_en: "Royal Blue",
          name_ar: "أزرق ملكي",
          image: "https://via.placeholder.com/400/400?text=Royal+Blue",
          sizes: [
            {
              size_code: "S",
              hip: 90,
              chest: 85,
              inventory: [
                { location_id: 1, amount: 18 },
                { location_id: 2, amount: 15 },
              ],
            },
            {
              size_code: "M",
              hip: 95,
              chest: 90,
              inventory: [
                { location_id: 1, amount: 22 },
                { location_id: 2, amount: 18 },
              ],
            },
            {
              size_code: "L",
              hip: 100,
              chest: 95,
              inventory: [
                { location_id: 1, amount: 20 },
                { location_id: 2, amount: 16 },
              ],
            },
            {
              size_code: "XL",
              hip: 105,
              chest: 100,
              inventory: [
                { location_id: 1, amount: 15 },
                { location_id: 2, amount: 12 },
              ],
            },
          ],
        },
        {
          name_en: "Black",
          name_ar: "أسود",
          image: "https://via.placeholder.com/400/400?text=Black+Swimwear",
          sizes: [
            {
              size_code: "S",
              hip: 90,
              chest: 85,
              inventory: [
                { location_id: 1, amount: 15 },
                { location_id: 2, amount: 12 },
              ],
            },
            {
              size_code: "M",
              hip: 95,
              chest: 90,
              inventory: [
                { location_id: 1, amount: 20 },
                { location_id: 2, amount: 16 },
              ],
            },
            {
              size_code: "L",
              hip: 100,
              chest: 95,
              inventory: [
                { location_id: 1, amount: 18 },
                { location_id: 2, amount: 14 },
              ],
            },
          ],
        },
      ],
    },
    {
      code: "PROD007",
      name_en: "Designer Leather Handbag",
      name_ar: "حقيبة يد جلدية مصممة",
      description_en:
        "Luxurious designer handbag made from genuine leather. Spacious interior with multiple compartments. Perfect for everyday use.",
      description_ar:
        "حقيبة يد فاخرة مصممة مصنوعة من الجلد الطبيعي. داخلية واسعة مع جيوب متعددة. مثالية للاستخدام اليومي.",
      price: 349.99,
      main_image_url: "https://via.placeholder.com/600/400?text=Designer+Leather+Handbag",
      is_featured: true,
      is_best_seller: true,
      category_id: 7, // Bags & Handbags
      colors: [
        {
          name_en: "Brown",
          name_ar: "بني",
          image: "https://via.placeholder.com/400/400?text=Brown+Handbag",
          sizes: [
            {
              size_code: "M",
              hip: 0,
              chest: 0,
              inventory: [
                { location_id: 1, amount: 25 },
                { location_id: 2, amount: 20 },
              ],
            },
            {
              size_code: "L",
              hip: 0,
              chest: 0,
              inventory: [
                { location_id: 1, amount: 30 },
                { location_id: 2, amount: 25 },
              ],
            },
          ],
        },
        {
          name_en: "Black",
          name_ar: "أسود",
          image: "https://via.placeholder.com/400/400?text=Black+Handbag",
          sizes: [
            {
              size_code: "M",
              hip: 0,
              chest: 0,
              inventory: [
                { location_id: 1, amount: 28 },
                { location_id: 2, amount: 22 },
              ],
            },
            {
              size_code: "L",
              hip: 0,
              chest: 0,
              inventory: [
                { location_id: 1, amount: 32 },
                { location_id: 2, amount: 28 },
              ],
            },
          ],
        },
      ],
    },
    {
      code: "PROD008",
      name_en: "Silk Scarf Set",
      name_ar: "طقم أوشحة حريرية",
      description_en:
        "Elegant set of silk scarves in various colors and patterns. Perfect accessory to elevate any outfit. Made from premium silk.",
      description_ar:
        "طقم أنيق من الأوشحة الحريرية بألوان وأنماط متنوعة. إكسسوار مثالي لرفع أي إطلالة. مصنوع من الحرير الممتاز.",
      price: 59.99,
      main_image_url: "https://via.placeholder.com/600/400?text=Silk+Scarf+Set",
      is_featured: false,
      is_best_seller: false,
      category_id: 8, // Accessories
      colors: [
        {
          name_en: "Multi-Color",
          name_ar: "متعدد الألوان",
          image: "https://via.placeholder.com/400/400?text=Multi-Color+Scarf",
          sizes: [
            {
              size_code: "M",
              hip: 0,
              chest: 0,
              inventory: [
                { location_id: 1, amount: 40 },
                { location_id: 2, amount: 35 },
              ],
            },
            {
              size_code: "L",
              hip: 0,
              chest: 0,
              inventory: [
                { location_id: 1, amount: 45 },
                { location_id: 2, amount: 40 },
              ],
            },
          ],
        },
      ],
    },
    {
      code: "PROD009",
      name_en: "Cocktail Party Dress",
      name_ar: "فساتين حفلات الكوكتيل",
      description_en:
        "Stunning cocktail dress perfect for parties and special events. Elegant design with attention to detail. Available in multiple sizes.",
      description_ar:
        "فساتين كوكتيل مذهلة مثالية للحفلات والمناسبات الخاصة. تصميم أنيق مع الاهتمام بالتفاصيل. متوفرة بأحجام متعددة.",
      price: 229.99,
      main_image_url: "https://via.placeholder.com/600/400?text=Cocktail+Party+Dress",
      is_featured: true,
      is_best_seller: true,
      category_id: 1, // Dresses
      colors: [
        {
          name_en: "Red",
          name_ar: "أحمر",
          image: "https://via.placeholder.com/400/400?text=Red+Dress",
          sizes: [
            {
              size_code: "S",
              hip: 90,
              chest: 85,
              inventory: [
                { location_id: 1, amount: 12 },
                { location_id: 2, amount: 10 },
              ],
            },
            {
              size_code: "M",
              hip: 95,
              chest: 90,
              inventory: [
                { location_id: 1, amount: 15 },
                { location_id: 2, amount: 12 },
              ],
            },
            {
              size_code: "L",
              hip: 100,
              chest: 95,
              inventory: [
                { location_id: 1, amount: 13 },
                { location_id: 2, amount: 11 },
              ],
            },
            {
              size_code: "XL",
              hip: 105,
              chest: 100,
              inventory: [
                { location_id: 1, amount: 10 },
                { location_id: 2, amount: 8 },
              ],
            },
          ],
        },
        {
          name_en: "Emerald Green",
          name_ar: "أخضر زمردي",
          image: "https://via.placeholder.com/400/400?text=Emerald+Green",
          sizes: [
            {
              size_code: "S",
              hip: 90,
              chest: 85,
              inventory: [
                { location_id: 1, amount: 10 },
                { location_id: 2, amount: 8 },
              ],
            },
            {
              size_code: "M",
              hip: 95,
              chest: 90,
              inventory: [
                { location_id: 1, amount: 13 },
                { location_id: 2, amount: 10 },
              ],
            },
            {
              size_code: "L",
              hip: 100,
              chest: 95,
              inventory: [
                { location_id: 1, amount: 12 },
                { location_id: 2, amount: 9 },
              ],
            },
          ],
        },
      ],
    },
    {
      code: "PROD010",
      name_en: "Trench Coat Classic",
      name_ar: "معطف ترينش كلاسيكي",
      description_en:
        "Classic trench coat that never goes out of style. Perfect for transitional weather. Water-resistant and stylish design.",
      description_ar:
        "معطف ترينش كلاسيكي لا يخرج عن الموضة أبداً. مثالي للطقس الانتقالي. مقاوم للماء بتصميم أنيق.",
      price: 279.99,
      main_image_url: "https://via.placeholder.com/600/400?text=Trench+Coat+Classic",
      is_featured: false,
      is_best_seller: false,
      category_id: 3, // Jackets & Coats
      colors: [
        {
          name_en: "Beige",
          name_ar: "بيج",
          image: "https://via.placeholder.com/400/400?text=Beige+Trench",
          sizes: [
            {
              size_code: "M",
              hip: 95,
              chest: 100,
              inventory: [
                { location_id: 1, amount: 14 },
                { location_id: 2, amount: 11 },
              ],
            },
            {
              size_code: "L",
              hip: 100,
              chest: 105,
              inventory: [
                { location_id: 1, amount: 16 },
                { location_id: 2, amount: 13 },
              ],
            },
            {
              size_code: "XL",
              hip: 105,
              chest: 110,
              inventory: [
                { location_id: 1, amount: 14 },
                { location_id: 2, amount: 11 },
              ],
            },
            {
              size_code: "2xL",
              hip: 110,
              chest: 115,
              inventory: [
                { location_id: 1, amount: 10 },
                { location_id: 2, amount: 8 },
              ],
            },
          ],
        },
        {
          name_en: "Black",
          name_ar: "أسود",
          image: "https://via.placeholder.com/400/400?text=Black+Trench",
          sizes: [
            {
              size_code: "M",
              hip: 95,
              chest: 100,
              inventory: [
                { location_id: 1, amount: 12 },
                { location_id: 2, amount: 10 },
              ],
            },
            {
              size_code: "L",
              hip: 100,
              chest: 105,
              inventory: [
                { location_id: 1, amount: 14 },
                { location_id: 2, amount: 12 },
              ],
            },
            {
              size_code: "XL",
              hip: 105,
              chest: 110,
              inventory: [
                { location_id: 1, amount: 13 },
                { location_id: 2, amount: 10 },
              ],
            },
          ],
        },
      ],
    },
  ]

  // Create products with full relationships
  for (const productData of productsData) {
    // Create product
    const product = await prismaClient.product.upsert({
      where: { code: productData.code },
      update: {},
      create: {
        code: productData.code,
        slug: slugify(productData.name_en),
        name_en: productData.name_en,
        name_ar: productData.name_ar,
        description_en: productData.description_en,
        description_ar: productData.description_ar,
        price: productData.price,
        main_image_url: productData.main_image_url,
        is_active: true,
        is_featured: productData.is_featured,
        is_best_seller: productData.is_best_seller,
      },
    })

    // Create product-category relationship
    await prismaClient.productCategory.upsert({
      where: {
        product_id_category_id: {
          product_id: product.id,
          category_id: productData.category_id,
        },
      },
      update: {},
      create: {
        product_id: product.id,
        category_id: productData.category_id,
      },
    })

    // Create colors, sizes, and inventories
    for (const colorData of productData.colors) {
      const color = await prismaClient.color.create({
        data: {
          product_id: product.id,
          name_en: colorData.name_en,
          name_ar: colorData.name_ar,
          image: colorData.image,
        },
      })

      for (const sizeData of colorData.sizes) {
        const productSize = await prismaClient.productSize.create({
          data: {
            color_id: color.id,
            size_code: sizeData.size_code,
            hip: sizeData.hip,
            chest: sizeData.chest,
          },
        })

        // Create inventories for each location
        for (const inventory of sizeData.inventory) {
          await prismaClient.productInventory.upsert({
            where: {
              product_size_id_location_id: {
                product_size_id: productSize.id,
                location_id: inventory.location_id,
              },
            },
            update: {
              amount: inventory.amount,
            },
            create: {
              product_size_id: productSize.id,
              location_id: inventory.location_id,
              amount: inventory.amount,
              sold: 0,
            },
          })
        }
      }
    }
  }

  console.warn("✅ Products seeded with categories, colors, sizes, and inventories")
}
