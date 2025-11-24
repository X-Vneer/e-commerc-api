import express from "express"
import validate from "express-zod-safe"

import { authMiddleware } from "@/api/public/middlewares/auth.js"
import { numberIdSchema } from "@/schemas/number-id-schema.js"

import {
  addToCartHandler,
  getCartHandler,
  removeFromCartHandler,
  updateCartItemQuantityHandler,
} from "./handlers/index.js"
import { addToCartSchema, updateCartItemQuantitySchema } from "./schemas/index.js"

const router = express.Router()

router.use(authMiddleware)

router.get("/", getCartHandler)
router.post("/add", validate({ body: addToCartSchema }), addToCartHandler)
router.delete("/:id", validate({ params: numberIdSchema }), removeFromCartHandler)
router.put(
  "/:id",
  validate({ params: numberIdSchema, body: updateCartItemQuantitySchema }),
  updateCartItemQuantityHandler
)

export default router
