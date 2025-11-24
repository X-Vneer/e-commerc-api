import z from "zod"

export const addToCartSchema = z.object({
  color_id: z.number().int().min(1, { error: "cart.color_id_invalid" }),
  size_code: z.string().min(1, { error: "cart.size_code_invalid" }),
  quantity: z.number().int().min(1, { error: "cart.quantity_invalid" }),
})
export const updateCartItemQuantitySchema = z.object({
  quantity: z.number().int().min(1, { error: "cart.quantity_invalid" }).max(100, { error: "cart.quantity_max" }),
})
