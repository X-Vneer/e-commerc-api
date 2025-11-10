import express from "express"
import validate from "express-zod-safe"

import { createBranchHandler, deleteBranchHandler, getBranchesHandler, updateBranchHandler } from "./handlers/index.js"
import { createBranchSchema, paramsBranchIdSchema, updateBranchSchema } from "./schemas/index.js"

const router = express.Router()

router.get("/", getBranchesHandler)
router.post("/", validate({ body: createBranchSchema }), createBranchHandler)
router.put("/:id", validate({ body: updateBranchSchema, params: paramsBranchIdSchema }), updateBranchHandler)
router.delete("/:id", validate({ params: paramsBranchIdSchema }), deleteBranchHandler)

export default router
