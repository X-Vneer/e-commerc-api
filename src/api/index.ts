import express from "express"

import auth from "./auth/index.js"
import dashboard from "./dashboard/index.js"
import lists from "./lists/index.js"

const router = express.Router()

router.use("/auth", auth)
router.use("/lists", lists)

router.use("/dashboard", dashboard)

export default router
