import express from "express"
import multer from "multer"
import path from "node:path"
import { v4 as uuidv4 } from "uuid"

import { formatFileSize } from "@/utils/format-file-size.js"

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, "uploads/"),
  filename(_, file, cb) {
    const ext = path.extname(file.originalname)
    cb(null, `${file.fieldname}-${uuidv4()}${ext}`)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter: (_, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true)
    } else {
      cb(new Error("Only image files are allowed"))
    }
  },
})

const router = express.Router()

router.post("/", upload.single("file"), (req, res) => {
  if (!req.file) {
    res.status(400).json({ message: "No file uploaded" })
    return
  }
  const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
  res.json({
    message: "File uploaded successfully",
    data: {
      file_url: fileUrl,
      file_name: req.file.originalname,
      file_size: formatFileSize(req.file.size),
      file_type: req.file.mimetype,
    },
  })
})

export default router
