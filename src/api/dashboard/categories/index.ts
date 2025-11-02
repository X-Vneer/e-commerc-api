import express from "express"
import validate from "express-zod-safe"

import {
  createCategoryHandler,
  deleteCategoryHandler,
  getCategoriesHandler,
  updateCategoryHandler,
} from "./handlers/index.js"
import { categoryIdSchema, createCategorySchema, updateCategorySchema } from "./schemas/index.js"

const router = express.Router()

router.get("/", getCategoriesHandler)
router.post("/", validate({ body: createCategorySchema }), createCategoryHandler)
router.put(
  "/:id",
  validate({ body: updateCategorySchema, params: categoryIdSchema }),
  updateCategoryHandler
)
router.delete("/:id", validate({ params: categoryIdSchema }), deleteCategoryHandler)

export default router
