import express from "express"
import validate from "express-zod-safe"

import { authMiddleware, userIdMiddleware } from "@/api/middlewares/auth.js"
import { numberIdSchema } from "@/schemas/number-id-schema.js"
import { paginationParamsSchema } from "@/schemas/pagination-params.js"

import { getProductsHandler, toggleFavoriteHandler } from "./handlers/index.js"
import { toggleFavoriteSchema } from "./schemas/index.js"

const router = express.Router()

router.use(userIdMiddleware)
router.get("/", validate({ query: paginationParamsSchema }), getProductsHandler)

// requires auth
router.use(authMiddleware)

router.post("/:id/favorite", validate({ body: toggleFavoriteSchema, params: numberIdSchema }), toggleFavoriteHandler)
export default router
