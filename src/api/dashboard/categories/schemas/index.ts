import z from "zod"

export const createCategorySchema = z.object({
  name_ar: z.string().min(1, { error: "field_required" }),
  name_en: z.string().min(1, { error: "field_required" }),
  image: z.url({ error: "invalid_url" }),
})

export const updateCategorySchema = z
  .object({
    name_ar: z.string().min(1, { error: "field_required" }),
    name_en: z.string().min(1, { error: "field_required" }),
    image: z.url({ error: "invalid_url" }),
  })
  .partial()

export const categoryIdSchema = z.object({
  id: z.coerce.number(),
})
