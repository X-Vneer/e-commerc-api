import type { Prisma } from "@prisma/client"
import type { Response } from "express"
import type { ValidatedRequest } from "express-zod-safe"

import type { generalQuerySchema } from "@/schemas/general-query-schema.js"

import prismaClient from "@/prisma"
import stripLangKeys from "@/utils/obj-select-lang.js"

import type {
  createBranchSchema,
  paramsBranchIdSchema,
  updateBranchSchema,
} from "../schemas/index.js"

export async function getBranchesHandler(
  req: ValidatedRequest<{ query: typeof generalQuerySchema }>,
  res: Response
) {
  const { q } = req.query
  //   handle general search
  const where: Prisma.BranchWhereInput = {
    ...(q && {
      OR: [{ name_en: { contains: q } }, { name_ar: { contains: q } }, { code: { contains: q } }],
    }),
  }
  const lang = req.language
  const locale = lang === "ar" ? "name_ar" : "name_en"
  const branches = await prismaClient.branch.findMany({
    where,
    select: {
      id: true,
      [locale]: true,
      code: true,
    },
    orderBy: {
      code: "desc",
    },
  })
  res.json({
    message: req.t("branches_fetched_successfully", { ns: "translations" }),
    data: stripLangKeys(branches),
  })
}

export async function createBranchHandler(
  req: ValidatedRequest<{ body: typeof createBranchSchema }>,
  res: Response
) {
  const { name_en, name_ar, code } = req.body
  const branch = await prismaClient.branch.create({
    data: {
      name_en,
      name_ar,
      code,
    },
  })
  res.status(201).json({
    message: req.t("branch_created_successfully", { ns: "translations" }),
    data: branch,
  })
}

export async function updateBranchHandler(
  req: ValidatedRequest<{ body: typeof updateBranchSchema; params: typeof paramsBranchIdSchema }>,
  res: Response
) {
  const { id } = req.params
  const { name_en, name_ar, code } = req.body
  const branch = await prismaClient.branch.update({
    where: { id: Number(id) },
    data: { name_en, name_ar, code },
  })
  res.json({
    message: req.t("branch_updated_successfully", { ns: "translations" }),
    data: branch,
  })
}

export async function deleteBranchHandler(
  req: ValidatedRequest<{ params: typeof paramsBranchIdSchema }>,
  res: Response
) {
  const { id } = req.params
  await prismaClient.branch.delete({
    where: { id: Number(id) },
  })
  res.json({
    message: req.t("branch_deleted_successfully", { ns: "translations" }),
  })
}
