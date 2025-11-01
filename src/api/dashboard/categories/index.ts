import express from "express"
import validate from "express-zod-safe"

import { authMiddleware } from "../../../middlewares/auth.js"
import { getCategoriesHandler } from "../../lists/handlers/index.js"
import { createCategoryHandler } from "./handlers/index.js"
import { createCategorySchema } from "./schemas/index.js"

const router = express.Router()

router.get("/", getCategoriesHandler)

router.use(authMiddleware)
router.post("/", validate({ body: createCategorySchema }), createCategoryHandler)

export default router
