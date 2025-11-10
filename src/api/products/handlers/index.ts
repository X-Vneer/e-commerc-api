import type { Request, Response } from "express"

import prismaClient from "@/prisma"

export async function getProductsHandler(req: Request, res: Response) {
  const products = await prismaClient.color.findMany({
    include: {
      product: {
        include: {
          categories: true,
        },
      },
      sizes: {
        include: {
          inventories: true,
        },
      },
    },
  })
  res.json({
    message: req.t("products_fetched_successfully", { ns: "translations" }),
    data: products,
  })
}
