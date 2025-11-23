import z from "zod"

import { paginationParamsSchema } from "@/schemas/pagination-params.js"

export const toggleFavoriteSchema = z.object({
  is_favorite: z.enum(["true", "false"]).transform((val) => val === "true"),
})

export type ToggleFavoriteSchema = z.infer<typeof toggleFavoriteSchema>

export const productQueryWithPaginationSchema = z
  .object({
    category_id: z.coerce.number().int().min(1, { error: "products.category_id_invalid" }).optional(),
    has_plus_size: z
      .enum(["true", "false"])
      .transform((value) => value === "true")
      .optional(),
    size_id: z.coerce.number().int().min(1, { error: "products.size_id_invalid" }).optional(),
  })
  .and(paginationParamsSchema)

export type ProductQueryWithPaginationSchema = z.infer<typeof productQueryWithPaginationSchema>
