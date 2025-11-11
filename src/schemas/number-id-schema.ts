import { z } from "zod"

export const numberIdSchema = z.object({
  id: z.coerce.number().int().min(1, { error: "number_id_invalid" }),
})

export type NumberIdSchema = z.infer<typeof numberIdSchema>
