import express from "express"

import auth from "./auth/index.js"
import lists from "./lists/index.js"

const router = express.Router()

router.use("/auth", auth)
router.use("/lists", lists)

export default router
