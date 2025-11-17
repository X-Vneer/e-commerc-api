import express from "express"

import auth from "@/api/public/auth/index.js"
import lists from "@/api/public/lists/index.js"
import products from "@/api/public/products/index.js"

const router = express.Router()

router.use("/auth", auth)
router.use("/lists", lists)
router.use("/products", products)

export default router
