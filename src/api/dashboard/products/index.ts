import express from "express"
import validate from "express-zod-safe"

import {
  createProductHandler,
  getProductHandler,
  getProductsHandler,
  updateActivityHandler,
  updateProductHandler,
} from "./handlers/index.js"
import {
  createProductSchema,
  productIdSchema,
  productQueryWithPaginationSchema,
  updateActivitySchema,
  updateProductSchema,
} from "./schemas/index.js"

const router = express.Router()

router.get("/", validate({ query: productQueryWithPaginationSchema }), getProductsHandler)

router.post("/", validate({ body: createProductSchema }), createProductHandler)

router.get("/:id", validate({ params: productIdSchema }), getProductHandler)

router.put(
  "/:id",
  validate({ body: updateProductSchema, params: productIdSchema }),
  updateProductHandler
)

router.put(
  "/:id/status",
  validate({ body: updateActivitySchema, params: productIdSchema }),
  updateActivityHandler
)

export default router
