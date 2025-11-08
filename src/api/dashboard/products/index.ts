import express from "express"
import validate from "express-zod-safe"

import { paginationParamsSchema } from "@/schemas/pagination-params.js"

import { createProductHandler, getProductsHandler, updateProductHandler } from "./handlers/index.js"
import { createProductSchema, productIdSchema, updateProductSchema } from "./schemas/index.js"

const router = express.Router()

router.get("/", validate({ query: paginationParamsSchema }), getProductsHandler)

router.post("/", validate({ body: createProductSchema }), createProductHandler)

router.put(
  "/:id",
  validate({ body: updateProductSchema, params: productIdSchema }),
  updateProductHandler
)

export default router
