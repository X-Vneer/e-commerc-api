import { z } from "zod/v4"

export const createProductSchema = z.object({
  code: z.string().min(1, { message: "products.code_required" }),
  name_en: z.string().min(1, { message: "products.name_en_required" }),
  name_ar: z.string().min(1, { message: "products.name_ar_required" }),
  description_en: z.string().min(1, { message: "products.description_en_required" }),
  description_ar: z.string().min(1, { message: "products.description_ar_required" }),
  price: z.coerce.number().positive({ message: "products.price_positive" }),
  main_image_url: z.url({ message: "products.main_image_url_invalid" }),
  is_active: z.boolean().optional().default(true),
  is_featured: z.boolean().optional().default(false),
  is_best_seller: z.boolean().optional().default(false),
  category_ids: z
    .array(z.coerce.number().min(1, { message: "products.category_id_invalid" }))
    .min(1, { message: "products.categories_required" }),
  colors: z
    .array(
      z.object({
        name_en: z.string().min(1, { message: "products.color_name_en_required" }),
        name_ar: z.string().min(1, { message: "products.color_name_ar_required" }),
        image: z.url({ message: "products.color_image_invalid" }),
      })
    )
})

export type CreateProductSchema = z.infer<typeof createProductSchema>
