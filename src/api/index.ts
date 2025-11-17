import express from "express"

import dashboard from "@/api/dashboard/index.js"
import publicApi from "@/api/public/index.js"

const router = express.Router()

router.use("/dashboard", dashboard)
router.use(publicApi)

export default router
