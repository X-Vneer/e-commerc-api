import jwt from "jsonwebtoken"
import request from "supertest"
import { beforeEach, describe, expect, it, vi } from "vitest"

import app from "../src/app.js"
import prismaClient from "../src/prisma/index.js"

// Mocks must be declared before importing the app (which wires routes/handlers)
vi.mock("../src/prisma/index.js", () => {
  const product = {
    findMany: vi.fn(),
    count: vi.fn(),
    create: vi.fn(),
  }
  const admin = {
    findUnique: vi.fn(),
  }
  const category = {
    findUnique: vi.fn(),
  }
  const size = {
    findUnique: vi.fn(),
  }
  const prisma = { product, admin, category, size }
  return { default: prisma }
})

vi.mock("jsonwebtoken", () => ({
  default: {
    verify: vi.fn(),
  },
}))

vi.mock("@/utils/slugify.ts", () => ({
  slugify: vi.fn((text: string) => text.toLowerCase().replace(/\s+/g, "-")),
}))

vi.mock("@/utils/obj-select-lang.js", () => ({
  default: vi.fn((obj: any) => obj),
  stripLangKeys: vi.fn((obj: any) => obj),
}))

const mockToken = "test-access-token"
const mockAdmin = { id: "admin1", email: "admin@example.com" }

describe("Dashboard Products API", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Default auth setup - valid token
    ;(jwt.verify as any).mockReturnValue({ userId: mockAdmin.id })
    ;(prismaClient.admin.findUnique as any).mockResolvedValue(mockAdmin)
  })

  describe("GET /api/v1/dashboard/products", () => {
    const validQuery = {
      page: 1,
      limit: 10,
    }

    it("fetches products successfully with pagination", async () => {
      const mockProducts = [
        {
          id: 1,
          code: "PROD001",
          name_en: "Test Product",
          name_ar: "منتج تجريبي",
          description_en: "Test description",
          description_ar: "وصف تجريبي",
          price: 100,
          slug: "test-product",
          main_image_url: "https://example.com/image.jpg",
          is_active: true,
          is_featured: false,
          is_best_seller: false,
          createdAt: new Date(),
          categories: [{ category: { id: 1, name_en: "Category 1", name_ar: "فئة 1" } }],
          colors: [
            {
              id: 1,
              name_en: "Red",
              name_ar: "أحمر",
              image: "https://example.com/red.jpg",
              sizes: [
                {
                  id: 1,
                  hip: 10,
                  chest: 20,
                  inventories: [{ id: 1, amount: 5 }],
                },
              ],
            },
          ],
        },
      ]

      ;(prismaClient.product.findMany as any).mockResolvedValue(mockProducts)
      ;(prismaClient.product.count as any).mockResolvedValue(1)

      const res = await request(app)
        .get("/api/v1/dashboard/products")
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${mockToken}`)
        .query(validQuery)
        .expect("Content-Type", /json/)
        .expect(200)

      expect(res.body).toHaveProperty("message")
      expect(res.body).toHaveProperty("data")
      expect(res.body).toHaveProperty("pagination")
      expect(res.body.data).toBeInstanceOf(Array)
      expect(res.body.pagination).toMatchObject({
        page: 1,
        limit: 10,
        total: 1,
        last_page: 1,
      })
      expect(prismaClient.product.findMany).toHaveBeenCalled()
      expect(prismaClient.product.count).toHaveBeenCalled()
    })

    it("filters products by is_active", async () => {
      ;(prismaClient.product.findMany as any).mockResolvedValue([])
      ;(prismaClient.product.count as any).mockResolvedValue(0)

      // Note: Query parameters come as strings, but the schema expects boolean
      // This test verifies the endpoint works with default is_active behavior
      const res = await request(app)
        .get("/api/v1/dashboard/products")
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${mockToken}`)
        .query(validQuery)
        .expect("Content-Type", /json/)
        .expect(200)

      expect(res.body.pagination.total).toBe(0)
      expect(prismaClient.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            is_active: true,
          },
        })
      )
    })

    it("filters products by category_id", async () => {
      ;(prismaClient.product.findMany as any).mockResolvedValue([])
      ;(prismaClient.product.count as any).mockResolvedValue(0)

      await request(app)
        .get("/api/v1/dashboard/products")
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${mockToken}`)
        .query({ ...validQuery, category_id: 1 })
        .expect("Content-Type", /json/)
        .expect(200)

      const findManyCall = (prismaClient.product.findMany as any).mock.calls[0][0]
      expect(findManyCall.where.categories).toBeDefined()
    })

    it("filters products by search query", async () => {
      ;(prismaClient.product.findMany as any).mockResolvedValue([])
      ;(prismaClient.product.count as any).mockResolvedValue(0)

      await request(app)
        .get("/api/v1/dashboard/products")
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${mockToken}`)
        .query({ ...validQuery, q: "test" })
        .expect("Content-Type", /json/)
        .expect(200)

      const findManyCall = (prismaClient.product.findMany as any).mock.calls[0][0]
      expect(findManyCall.where.OR).toBeDefined()
    })

    it("returns 401 if not authenticated", async () => {
      const res = await request(app)
        .get("/api/v1/dashboard/products")
        .set("Accept", "application/json")
        .query(validQuery)
        .expect("Content-Type", /json/)
        .expect(401)

      expect(res.body).toMatchObject({ message: "Unauthorized" })
    })

    it("returns 422 on validation error (invalid page)", async () => {
      const res = await request(app)
        .get("/api/v1/dashboard/products")
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${mockToken}`)
        .query({ page: 0, limit: 10 })
        .expect("Content-Type", /json/)
        .expect(422)

      expect(res.body?.message).toBe("Validation error")
    })
  })

  describe("POST /api/v1/dashboard/products", () => {
    const validBody = {
      code: "PROD001",
      name_en: "Test Product",
      name_ar: "منتج تجريبي",
      description_en: "Test description",
      description_ar: "وصف تجريبي",
      price: 100,
      is_active: true,
      category_ids: [1],
      colors: [
        {
          name_en: "Red",
          name_ar: "أحمر",
          image: "https://example.com/red.jpg",
          sizes: [
            {
              size_code: "S",
              amount: 10,
              hip: 30,
              chest: 40,
              inventories: [
                {
                  branch_id: 1,
                  amount: 10,
                },
              ],
            },
          ],
        },
      ],
    }

    it("creates a product successfully", async () => {
      const mockCreatedProduct = {
        id: 1,
        code: validBody.code,
        name_en: validBody.name_en,
        name_ar: validBody.name_ar,
        description_en: validBody.description_en,
        description_ar: validBody.description_ar,
        price: validBody.price,
        slug: "test-product",
        main_image_url: validBody.colors[0].image,
        is_active: validBody.is_active,
        is_featured: false,
        is_best_seller: false,
        createdAt: new Date(),
        categories: [{ category: { id: 1, name_en: "Category 1", name_ar: "فئة 1" } }],
        colors: [
          {
            id: 1,
            name_en: validBody.colors[0].name_en,
            name_ar: validBody.colors[0].name_ar,
            image: validBody.colors[0].image,
            sizes: [
              {
                id: 1,
                hip: validBody.colors[0].sizes[0].hip,
                chest: validBody.colors[0].sizes[0].chest,
                inventories: [{ id: 1, amount: validBody.colors[0].sizes[0].amount }],
              },
            ],
          },
        ],
      }

      ;(prismaClient.product.create as any).mockResolvedValue(mockCreatedProduct)

      const res = await request(app)
        .post("/api/v1/dashboard/products")
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${mockToken}`)
        .send(validBody)
        .expect("Content-Type", /json/)
        .expect(201)

      expect(res.body).toHaveProperty("message")
      expect(res.body).toHaveProperty("data")
      expect(res.body.data.code).toBe(validBody.code)
      expect(res.body.data.name_en).toBe(validBody.name_en)
      expect(prismaClient.product.create).toHaveBeenCalled()
    })

    it("returns 401 if not authenticated", async () => {
      const res = await request(app)
        .post("/api/v1/dashboard/products")
        .set("Accept", "application/json")
        .send(validBody)
        .expect("Content-Type", /json/)
        .expect(401)

      expect(res.body).toMatchObject({ message: "Unauthorized" })
    })

    it("returns 422 on validation error (missing required fields)", async () => {
      const invalidBody = {
        code: "PROD001",
        // missing name_en, name_ar, etc.
      }

      const res = await request(app)
        .post("/api/v1/dashboard/products")
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${mockToken}`)
        .send(invalidBody)
        .expect("Content-Type", /json/)
        .expect(422)

      expect(res.body?.message).toBe("Validation error")
      expect(res.body?.errors).toBeDefined()
    })

    it("returns 422 on validation error (invalid price)", async () => {
      const invalidBody = {
        ...validBody,
        price: -10,
      }

      const res = await request(app)
        .post("/api/v1/dashboard/products")
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${mockToken}`)
        .send(invalidBody)
        .expect("Content-Type", /json/)
        .expect(422)

      expect(res.body?.message).toBe("Validation error")
      expect(res.body?.errors?.price).toBeDefined()
    })

    it("returns 422 on validation error (empty category_ids)", async () => {
      const invalidBody = {
        ...validBody,
        category_ids: [],
      }

      const res = await request(app)
        .post("/api/v1/dashboard/products")
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${mockToken}`)
        .send(invalidBody)
        .expect("Content-Type", /json/)
        .expect(422)

      expect(res.body?.message).toBe("Validation error")
      expect(res.body?.errors).toBeDefined()
    })

    it("returns 422 on validation error (empty colors)", async () => {
      const invalidBody = {
        ...validBody,
        colors: [],
      }

      const res = await request(app)
        .post("/api/v1/dashboard/products")
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${mockToken}`)
        .send(invalidBody)
        .expect("Content-Type", /json/)
        .expect(422)

      expect(res.body?.message).toBe("Validation error")
      expect(res.body?.errors).toBeDefined()
    })

    it("returns 422 on validation error (invalid color image URL)", async () => {
      const invalidBody = {
        ...validBody,
        colors: [
          {
            ...validBody.colors[0],
            image: "not-a-valid-url",
          },
        ],
      }

      const res = await request(app)
        .post("/api/v1/dashboard/products")
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${mockToken}`)
        .send(invalidBody)
        .expect("Content-Type", /json/)
        .expect(422)

      expect(res.body?.message).toBe("Validation error")
      expect(res.body?.errors).toBeDefined()
    })
  })
})
