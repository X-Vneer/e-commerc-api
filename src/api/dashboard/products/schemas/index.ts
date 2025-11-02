import { z } from "zod/v4"

export const createColorSchema = z.object({
  name_en: z.string().min(1, { error: "products.color_name_en_required" }),
  name_ar: z.string().min(1, { error: "products.color_name_ar_required" }),
  image: z.url({ error: "products.color_image_invalid" }),
  sizes: z.array(
    z.object({
      size_code: z.string().min(1, { error: "products.size_code_required" }),
      amount: z.coerce.number().positive({ error: "products.size_amount_positive" }),
      hip: z.coerce.number().positive({ error: "products.size_hip_positive" }),
      chest: z.coerce.number().positive({ error: "products.size_chest_positive" }),
    })
  ),
})

export type CreateColorSchema = z.infer<typeof createColorSchema>

export const createProductSchema = z.object({
  code: z.string().min(1, { error: "products.code_required" }),
  name_en: z.string().min(1, { error: "products.name_en_required" }),
  name_ar: z.string().min(1, { error: "products.name_ar_required" }),
  description_en: z.string().min(1, { error: "products.description_en_required" }),
  description_ar: z.string().min(1, { error: "products.description_ar_required" }),
  price: z.coerce.number().positive({ error: "products.price_positive" }),
  is_active: z.boolean().optional().default(true),
  is_featured: z.boolean().optional().default(false),
  is_best_seller: z.boolean().optional().default(false),
  category_ids: z
    .array(z.coerce.number().int().min(1, { error: "products.category_id_invalid" }))
    .min(1, { error: "products.categories_required" }),
  colors: z.array(createColorSchema).min(1, { error: "products.colors_required" }),
})

export type CreateProductSchema = z.infer<typeof createProductSchema>
