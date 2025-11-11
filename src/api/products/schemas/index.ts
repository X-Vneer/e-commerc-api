import z from "zod"

export const toggleFavoriteSchema = z.object({
  is_favorite: z.enum(["true", "false"]).transform((val) => val === "true"),
})

export type ToggleFavoriteSchema = z.infer<typeof toggleFavoriteSchema>
