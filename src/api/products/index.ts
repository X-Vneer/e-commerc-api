import express from "express"
import validate from "express-zod-safe"

import { authMiddleware } from "@/middlewares/auth.js"
import { numberIdSchema } from "@/schemas/number-id-schema.js"

import { getProductsHandler, toggleFavoriteHandler } from "./handlers/index.js"
import { toggleFavoriteSchema } from "./schemas/index.js"

const router = express.Router()

router.get("/", getProductsHandler)

// requires auth
router.use(authMiddleware)

router.post("/:id/favorite", validate({ body: toggleFavoriteSchema, params: numberIdSchema }), toggleFavoriteHandler)
export default router
