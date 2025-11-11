import express from "express"

import auth from "@/api/auth/index.js"
import dashboard from "@/api/dashboard/index.js"
import lists from "@/api/lists/index.js"
import products from "@/api/products/index.js"

const router = express.Router()

router.use("/auth", auth)
router.use("/lists", lists)

router.use("/products", products)

router.use("/dashboard", dashboard)

export default router
