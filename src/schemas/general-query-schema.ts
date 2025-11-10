import z from "zod"

export const generalQuerySchema = z.object({
  q: z.string().optional(),
})
export type GeneralQuerySchema = z.infer<typeof generalQuerySchema>
