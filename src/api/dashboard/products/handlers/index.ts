import type { Response } from "express"
import type { ValidatedRequest } from "express-zod-safe"

import type { createProductSchema } from "../schemas/index.js"

import prismaClient from "../../../../prisma/index.js"

export async function createProductHandler(
  req: ValidatedRequest<{ body: typeof createProductSchema }>,
  res: Response
) {
  const {
    code,
    name_en,
    name_ar,
    description_en,
    description_ar,
    price,
    main_image_url,
    is_active,
    category_ids,
    colors,
  } = req.body
  const product = await prismaClient.product.create({
    data: {
      code,
      name_en,
      name_ar,
      description_en,
      description_ar,
      price,
      main_image_url,
      is_active,
      categories: { connect: category_ids.map((id) => ({ id })) },
      colors: { create: colors.map((color) => ({ name_en, name_ar, image: color.image })) },
    },
  })
  res
    .status(201)
    .json({ message: req.t("product_created_successfully", { ns: "translations" }), data: product })
}
