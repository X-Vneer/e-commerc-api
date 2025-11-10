import { z } from "zod/v4"

import { paginationParamsSchema } from "@/schemas/pagination-params"

export const inventorySchema = z.object({
  location_id: z.coerce.number().int().min(1, { error: "products.location_id_invalid" }),
  amount: z.coerce.number().int().min(0, { error: "products.amount_positive" }),
})

export const createColorSchema = z.object({
  name_en: z.string().min(1, { error: "products.color_name_en_required" }),
  name_ar: z.string().min(1, { error: "products.color_name_ar_required" }),
  image: z.url({ error: "products.color_image_invalid" }),
  sizes: z.array(
    z.object({
      size_code: z.string().min(1, { error: "products.size_code_required" }),
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

export const updateProductSchema = z
  .object({
    code: z.string().min(1, { error: "products.code_required" }),
    name_en: z.string().min(1, { error: "products.name_en_required" }),
    name_ar: z.string().min(1, { error: "products.name_ar_required" }),
    description_en: z.string().min(1, { error: "products.description_en_required" }),
    description_ar: z.string().min(1, { error: "products.description_ar_required" }),
    price: z.coerce.number().positive({ error: "products.price_positive" }),
    is_active: z.boolean(),
    is_featured: z.boolean(),
    is_best_seller: z.boolean(),
    category_ids: z
      .array(z.coerce.number().int().min(1, { error: "products.category_id_invalid" }))
      .min(1, { error: "products.categories_required" }),
  })
  .partial()
export type UpdateProductSchema = z.infer<typeof updateProductSchema>

export const productIdSchema = z.object({
  id: z.coerce.number().int().min(1, { error: "products.id_invalid" }),
})
export type ProductIdSchema = z.infer<typeof productIdSchema>

export const productQuerySchema = z.object({
  is_active: z.boolean().optional().default(true),
  category_id: z.coerce.number().int().min(1, { error: "products.category_id_invalid" }).optional(),
  q: z.string().optional(),
  empty_inventories: z
    .literal("1")
    .transform(() => true)
    .optional(),
  fully_empty_inventories: z
    .literal("1")
    .transform(() => true)
    .optional(),
})

export const productQueryWithPaginationSchema = paginationParamsSchema.and(productQuerySchema)
export type ProductQuerySchema = z.infer<typeof productQuerySchema>
export type ProductQueryWithPaginationSchema = z.infer<typeof productQueryWithPaginationSchema>

export const updateActivitySchema = z.object({
  is_active: z.boolean(),
})
export type UpdateActivitySchema = z.infer<typeof updateActivitySchema>
