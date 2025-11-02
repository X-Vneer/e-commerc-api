import z from "zod"

export const paginationParamsSchema = z.object({
  page: z.coerce.number().min(1, { error: "pagination.page_min" }).optional().default(1),
  limit: z.coerce
    .number()
    .min(1, { error: "pagination.limit_min" })
    .max(100, { error: "pagination.limit_max" })
    .optional()
    .default(10),
})

export type PaginationParamsSchema = z.infer<typeof paginationParamsSchema>
