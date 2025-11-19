import request from "supertest"
import { beforeEach, describe, expect, it, vi } from "vitest"

import app from "../src/app.js"
import prismaClient from "../src/prisma/index.js"

// Mocks must be declared before importing the app (which wires routes/handlers)
vi.mock("../src/prisma/index.js", () => {
  const cart = {
    findUnique: vi.fn(),
    upsert: vi.fn(),
  }
  const cartItem = {
    findUnique: vi.fn(),
    upsert: vi.fn(),
  }
  const color = {
    findFirst: vi.fn(),
  }
  const productInventory = {
    aggregate: vi.fn(),
  }
  const prisma = {
    cart,
    cartItem,
    color,
    productInventory,
    $transaction: vi.fn(),
  }
  return { default: prisma }
})

// Bypass auth: inject a fake userId and continue
vi.mock("@/api/public/middlewares/auth.ts", () => ({
  authMiddleware: (req: any, _res: any, next: any) => {
    req.userId = "user1"
    next()
  },
  userIdMiddleware: (req: any, _res: any, next: any) => {
    next()
  },
}))

describe("Cart API", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("GET /api/v1/cart", () => {
    it("fetches cart successfully with items", async () => {
      const mockCart = {
        id: "cart1",
        user_id: "user1",
        items: [
          {
            id: 1,
            cart_id: "cart1",
            color_id: 1,
            size_code: "M",
            quantity: 2,
            color: {
              id: 1,
              name_en: "Red",
              name_ar: "أحمر",
              image: "https://example.com/red.jpg",
              product: {
                id: 1,
                code: "PROD001",
                name_en: "Test Product",
                name_ar: "منتج تجريبي",
                price: 100,
                is_active: true,
              },
              sizes: [
                {
                  id: 1,
                  size_code: "M",
                  hip: 30,
                  chest: 40,
                  size: {
                    code: "M",
                    weight: "Medium",
                  },
                },
              ],
            },
          },
        ],
      }

      // Mock getOrCreateCart (upsert)
      ;(prismaClient.cart.upsert as any).mockResolvedValue({
        id: "cart1",
        user_id: "user1",
      })

      // Mock findUnique for cart with items
      ;(prismaClient.cart.findUnique as any).mockResolvedValue(mockCart)

      const res = await request(app)
        .get("/api/v1/cart")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)

      expect(res.body).toHaveProperty("message")
      expect(res.body).toHaveProperty("data")
      expect(res.body.data).toMatchObject({
        id: "cart1",
        user_id: "user1",
      })
      expect(res.body.data.items).toBeInstanceOf(Array)
      expect(prismaClient.cart.upsert).toHaveBeenCalled()
      expect(prismaClient.cart.findUnique).toHaveBeenCalled()
    })

    it("returns cart with empty items when cart has no items", async () => {
      const mockCart = {
        id: "cart1",
        user_id: "user1",
        items: [],
      }

      ;(prismaClient.cart.upsert as any).mockResolvedValue({
        id: "cart1",
        user_id: "user1",
      })
      ;(prismaClient.cart.findUnique as any).mockResolvedValue(mockCart)

      const res = await request(app)
        .get("/api/v1/cart")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)

      expect(res.body.data.items).toEqual([])
    })

    it("filters out items from inactive products", async () => {
      const mockCart = {
        id: "cart1",
        user_id: "user1",
        items: [], // Empty because inactive products are filtered
      }

      ;(prismaClient.cart.upsert as any).mockResolvedValue({
        id: "cart1",
        user_id: "user1",
      })
      ;(prismaClient.cart.findUnique as any).mockResolvedValue(mockCart)

      const res = await request(app)
        .get("/api/v1/cart")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)

      expect(res.body.data.items).toEqual([])
      // Verify that the query filters by is_active: true
      const findUniqueCall = (prismaClient.cart.findUnique as any).mock.calls[0][0]
      expect(findUniqueCall.include.items.where.color.product.is_active).toBe(true)
    })
  })

  describe("POST /api/v1/cart/add", () => {
    const validBody = {
      color_id: 1,
      size_code: "M",
      quantity: 2,
    }

    it("adds item to cart successfully", async () => {
      const mockColor = {
        id: 1,
        product: {
          is_active: true,
        },
        sizes: [
          {
            id: 1,
            size_code: "M",
          },
        ],
      }

      const mockCart = {
        id: "cart1",
        user_id: "user1",
      }

      const mockCartItem = {
        id: 1,
        cart_id: "cart1",
        color_id: 1,
        size_code: "M",
        quantity: 2,
      }

      const mockInventoryAggregate = {
        _sum: {
          amount: 10,
        },
      }

      // Mock transaction
      ;(prismaClient.$transaction as any).mockImplementation(async (callback: any) => {
        const tx = {
          color: {
            findFirst: vi.fn().mockResolvedValue(mockColor),
          },
          productInventory: {
            aggregate: vi.fn().mockResolvedValue(mockInventoryAggregate),
          },
          cart: {
            upsert: vi.fn().mockResolvedValue(mockCart),
          },
          cartItem: {
            findUnique: vi.fn().mockResolvedValue(null), // No existing item
            upsert: vi.fn().mockResolvedValue(mockCartItem),
          },
        }
        return callback(tx)
      })

      const res = await request(app)
        .post("/api/v1/cart/add")
        .set("Accept", "application/json")
        .send(validBody)
        .expect("Content-Type", /json/)
        .expect(200)

      expect(res.body).toHaveProperty("message")
      expect(res.body).toHaveProperty("data")
      expect(res.body.data).toMatchObject({
        cart_id: "cart1",
        color_id: 1,
        size_code: "M",
        quantity: 2,
      })
      expect(prismaClient.$transaction).toHaveBeenCalled()
    })

    it("updates quantity when item already exists in cart", async () => {
      const mockColor = {
        id: 1,
        product: {
          is_active: true,
        },
        sizes: [
          {
            id: 1,
            size_code: "M",
          },
        ],
      }

      const mockCart = {
        id: "cart1",
        user_id: "user1",
      }

      const existingItem = {
        id: 1,
        cart_id: "cart1",
        color_id: 1,
        size_code: "M",
        quantity: 1, // Existing quantity
      }

      const updatedItem = {
        ...existingItem,
        quantity: 3, // 1 + 2 = 3
      }

      const mockInventoryAggregate = {
        _sum: {
          amount: 10,
        },
      }

      ;(prismaClient.$transaction as any).mockImplementation(async (callback: any) => {
        const tx = {
          color: {
            findFirst: vi.fn().mockResolvedValue(mockColor),
          },
          productInventory: {
            aggregate: vi.fn().mockResolvedValue(mockInventoryAggregate),
          },
          cart: {
            upsert: vi.fn().mockResolvedValue(mockCart),
          },
          cartItem: {
            findUnique: vi.fn().mockResolvedValue(existingItem),
            upsert: vi.fn().mockResolvedValue(updatedItem),
          },
        }
        return callback(tx)
      })

      const res = await request(app)
        .post("/api/v1/cart/add")
        .set("Accept", "application/json")
        .send(validBody)
        .expect("Content-Type", /json/)
        .expect(200)

      expect(res.body.data.quantity).toBe(3)
    })

    it("returns 404 if color not found", async () => {
      ;(prismaClient.$transaction as any).mockImplementation(async (callback: any) => {
        const tx = {
          color: {
            findFirst: vi.fn().mockResolvedValue(null),
          },
        }
        return callback(tx)
      })

      const res = await request(app)
        .post("/api/v1/cart/add")
        .set("Accept", "application/json")
        .send(validBody)
        .expect("Content-Type", /json/)
        .expect(404)

      expect(res.body).toHaveProperty("message")
    })

    it("returns 422 if product is inactive", async () => {
      const mockColor = {
        id: 1,
        product: {
          is_active: false,
        },
        sizes: [
          {
            id: 1,
            size_code: "M",
          },
        ],
      }

      ;(prismaClient.$transaction as any).mockImplementation(async (callback: any) => {
        const tx = {
          color: {
            findFirst: vi.fn().mockResolvedValue(mockColor),
          },
        }
        return callback(tx)
      })

      const res = await request(app)
        .post("/api/v1/cart/add")
        .set("Accept", "application/json")
        .send(validBody)
        .expect("Content-Type", /json/)
        .expect(422)

      expect(res.body).toHaveProperty("message")
    })

    it("returns 404 if size not found", async () => {
      const mockColor = {
        id: 1,
        product: {
          is_active: true,
        },
        sizes: [], // No sizes
      }

      ;(prismaClient.$transaction as any).mockImplementation(async (callback: any) => {
        const tx = {
          color: {
            findFirst: vi.fn().mockResolvedValue(mockColor),
          },
        }
        return callback(tx)
      })

      const res = await request(app)
        .post("/api/v1/cart/add")
        .set("Accept", "application/json")
        .send(validBody)
        .expect("Content-Type", /json/)
        .expect(404)

      expect(res.body).toHaveProperty("message")
    })

    it("returns 422 if not enough inventory", async () => {
      const mockColor = {
        id: 1,
        product: {
          is_active: true,
        },
        sizes: [
          {
            id: 1,
            size_code: "M",
          },
        ],
      }

      const mockCart = {
        id: "cart1",
        user_id: "user1",
      }

      const mockInventoryAggregate = {
        _sum: {
          amount: 1, // Only 1 available
        },
      }

      ;(prismaClient.$transaction as any).mockImplementation(async (callback: any) => {
        const tx = {
          color: {
            findFirst: vi.fn().mockResolvedValue(mockColor),
          },
          productInventory: {
            aggregate: vi.fn().mockResolvedValue(mockInventoryAggregate),
          },
          cart: {
            upsert: vi.fn().mockResolvedValue(mockCart),
          },
          cartItem: {
            findUnique: vi.fn().mockResolvedValue(null),
          },
        }
        return callback(tx)
      })

      const res = await request(app)
        .post("/api/v1/cart/add")
        .set("Accept", "application/json")
        .send(validBody) // quantity: 2
        .expect("Content-Type", /json/)
        .expect(422)

      expect(res.body).toHaveProperty("message")
    })

    it("returns 422 on validation error (invalid color_id)", async () => {
      const invalidBody = {
        color_id: 0, // Invalid: must be >= 1
        size_code: "M",
        quantity: 2,
      }

      const res = await request(app)
        .post("/api/v1/cart/add")
        .set("Accept", "application/json")
        .send(invalidBody)
        .expect("Content-Type", /json/)
        .expect(422)

      expect(res.body?.message).toBe("Validation error")
      expect(res.body?.errors).toBeDefined()
    })

    it("returns 422 on validation error (invalid quantity)", async () => {
      const invalidBody = {
        color_id: 1,
        size_code: "M",
        quantity: 0, // Invalid: must be >= 1
      }

      const res = await request(app)
        .post("/api/v1/cart/add")
        .set("Accept", "application/json")
        .send(invalidBody)
        .expect("Content-Type", /json/)
        .expect(422)

      expect(res.body?.message).toBe("Validation error")
      expect(res.body?.errors).toBeDefined()
    })

    it("returns 422 on validation error (missing required fields)", async () => {
      const invalidBody = {
        color_id: 1,
        // missing size_code and quantity
      }

      const res = await request(app)
        .post("/api/v1/cart/add")
        .set("Accept", "application/json")
        .send(invalidBody)
        .expect("Content-Type", /json/)
        .expect(422)

      expect(res.body?.message).toBe("Validation error")
      expect(res.body?.errors).toBeDefined()
    })
  })
})
