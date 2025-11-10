import z from "zod"

export const createBranchSchema = z.object({
  name_en: z
    .string({ error: "branches.name_en_required" })
    .min(1, { error: "branches.name_en_required" }),
  name_ar: z
    .string({ error: "branches.name_ar_required" })
    .min(1, { error: "branches.name_ar_required" }),
  code: z.string({ error: "branches.code_required" }).min(1, { error: "branches.code_required" }),
})
export type CreateBranchSchema = z.infer<typeof createBranchSchema>

export const paramsBranchIdSchema = z.object({
  id: z.coerce.number().int().min(1, { error: "branches.id_required" }),
})
export type ParamsBranchIdSchema = z.infer<typeof paramsBranchIdSchema>

export const updateBranchSchema = z.object({
  name_en: z
    .string({ error: "branches.name_en_required" })
    .min(1, { error: "branches.name_en_required" }),
  name_ar: z
    .string({ error: "branches.name_ar_required" })
    .min(1, { error: "branches.name_ar_required" }),
  code: z.string({ error: "branches.code_required" }).min(1, { error: "branches.code_required" }),
})
export type UpdateBranchSchema = z.infer<typeof updateBranchSchema>
