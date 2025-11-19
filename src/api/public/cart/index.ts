import express from "express"
import validate from "express-zod-safe"

import { authMiddleware } from "@/api/public/middlewares/auth.js"

import { addToCartHandler, getCartHandler } from "./handlers/index.js"
import { addToCartSchema } from "./schemas/index.js"

const router = express.Router()

router.use(authMiddleware)

router.get("/", getCartHandler)
router.post("/add", validate({ body: addToCartSchema }), addToCartHandler)

export default router
