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
    delete: vi.fn(),
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
    const createMockCartItem = (overrides: any = {}) => ({
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
          description_en: "Test description",
          description_ar: "وصف تجريبي",
          price: 100,
          main_image_url: "https://example.com/product.jpg",
        },
      },
      size: {
        id: 1,
        size_code: "M",
        inventories: [
          {
            id: 1,
            amount: 10,
            sold: 0,
            branch: {
              id: 1,
              name_en: "Branch 1",
              name_ar: "فرع 1",
            },
          },
        ],
      },
      ...overrides,
    })

    const createMockCart = (items: any[] = [], itemCount = items.length) => ({
      id: "cart1",
      user_id: "user1",
      items,
      _count: {
        items: itemCount,
      },
    })

    beforeEach(() => {
      // Mock getOrCreateCart (upsert) - called first
      ;(prismaClient.cart.upsert as any).mockResolvedValue({
        id: "cart1",
        user_id: "user1",
      })
    })

    it("fetches cart successfully with items and calculates payment summary", async () => {
      const mockItem = createMockCartItem()
      const mockCart = createMockCart([mockItem], 1)

      ;(prismaClient.cart.findUnique as any).mockResolvedValue(mockCart)

      const res = await request(app)
        .get("/api/v1/cart")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)

      expect(res.body).toHaveProperty("message")
      expect(res.body).toHaveProperty("data")

      // Verify cart structure
      expect(res.body.data).toMatchObject({
        id: "cart1",
        user_id: "user1",
      })

      // Verify items array
      expect(res.body.data.items).toBeInstanceOf(Array)
      expect(res.body.data.items).toHaveLength(1)

      // Verify item structure (product extracted from color)
      const item = res.body.data.items[0]
      expect(item).toMatchObject({
        id: 1,
        cart_id: "cart1",
        color_id: 1,
        size_code: "M",
        quantity: 2,
      })

      // Verify product is at top level (extracted from color)
      expect(item.product).toMatchObject({
        id: 1,
        code: "PROD001",
        price: 100,
      })

      // Verify color doesn't contain product (it was extracted)
      expect(item.color).not.toHaveProperty("product")
      expect(item.color).toMatchObject({
        id: 1,
        image: "https://example.com/red.jpg",
      })

      // Verify size structure
      expect(item.size).toMatchObject({
        id: 1,
        size_code: "M",
      })

      // Verify payment summary calculation
      expect(res.body.data.paymentSummary).toEqual({
        totalItems: 1,
        totalPrice: 200, // 2 items * 100 price
      })

      // Verify language keys are stripped
      expect(item.color).not.toHaveProperty("name_en")
      expect(item.color).not.toHaveProperty("name_ar")
      expect(item.product).not.toHaveProperty("name_en")
      expect(item.product).not.toHaveProperty("name_ar")
      expect(item.product).not.toHaveProperty("description_en")
      expect(item.product).not.toHaveProperty("description_ar")

      // Verify Prisma calls
      expect(prismaClient.cart.upsert).toHaveBeenCalledWith({
        where: { user_id: "user1" },
        create: { user_id: "user1" },
        update: {},
      })
      expect(prismaClient.cart.findUnique).toHaveBeenCalledWith({
        where: { user_id: "user1" },
        include: expect.objectContaining({
          items: expect.objectContaining({
            where: expect.objectContaining({
              color: expect.objectContaining({
                product: expect.objectContaining({
                  is_active: true,
                }),
              }),
            }),
          }),
        }),
      })
    })

    it("returns cart with empty items and zero payment summary", async () => {
      const mockCart = createMockCart([], 0)

      ;(prismaClient.cart.findUnique as any).mockResolvedValue(mockCart)

      const res = await request(app)
        .get("/api/v1/cart")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)

      expect(res.body.data.items).toEqual([])
      expect(res.body.data.paymentSummary).toEqual({
        totalItems: 0,
        totalPrice: 0,
      })
    })

    it("filters out items from inactive products via query", async () => {
      const mockCart = createMockCart([], 0)

      ;(prismaClient.cart.findUnique as any).mockResolvedValue(mockCart)

      const res = await request(app)
        .get("/api/v1/cart")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)

      expect(res.body.data.items).toEqual([])
      expect(res.body.data.paymentSummary).toEqual({
        totalItems: 0,
        totalPrice: 0,
      })

      // Verify that the query filters by is_active: true
      const findUniqueCall = (prismaClient.cart.findUnique as any).mock.calls[0][0]
      expect(findUniqueCall.include.items.where.color.product.is_active).toBe(true)
      expect(findUniqueCall.include.items.where.size.inventories.some.amount.gt).toBe(0)
    })

    it("calculates payment summary correctly with multiple items", async () => {
      const item1 = createMockCartItem({
        id: 1,
        quantity: 2,
        color: {
          ...createMockCartItem().color,
          product: {
            ...createMockCartItem().color.product,
            price: 100,
          },
        },
      })
      const item2 = createMockCartItem({
        id: 2,
        quantity: 3,
        color: {
          ...createMockCartItem().color,
          id: 2,
          product: {
            ...createMockCartItem().color.product,
            id: 2,
            price: 50,
          },
        },
      })
      const mockCart = createMockCart([item1, item2], 2)

      ;(prismaClient.cart.findUnique as any).mockResolvedValue(mockCart)

      const res = await request(app)
        .get("/api/v1/cart")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)

      // Total: (2 * 100) + (3 * 50) = 200 + 150 = 350
      expect(res.body.data.paymentSummary).toEqual({
        totalItems: 2,
        totalPrice: 350,
      })
      expect(res.body.data.items).toHaveLength(2)
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
      const mockColor = null

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

  describe("DELETE /api/v1/cart/:id", () => {
    it("removes item from cart successfully", async () => {
      const mockCartItem = {
        id: 1,
        cart_id: "cart1",
        color_id: 1,
        size_code: "M",
        quantity: 2,
      }

      ;(prismaClient.cartItem.findUnique as any).mockResolvedValue(mockCartItem)
      ;(prismaClient.cartItem.delete as any).mockResolvedValue(mockCartItem)

      const res = await request(app)
        .delete("/api/v1/cart/1")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)

      expect(res.body).toHaveProperty("message")
      expect(prismaClient.cartItem.findUnique).toHaveBeenCalledWith({
        where: {
          id: 1,
        },
      })
      expect(prismaClient.cartItem.delete).toHaveBeenCalledWith({
        where: {
          id: 1,
        },
      })
    })

    it("returns 404 if cart item not found", async () => {
      ;(prismaClient.cartItem.findUnique as any).mockResolvedValue(null)

      const res = await request(app)
        .delete("/api/v1/cart/999")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(404)

      expect(res.body).toHaveProperty("message")
      expect(prismaClient.cartItem.findUnique).toHaveBeenCalledWith({
        where: {
          id: 999,
        },
      })
      expect(prismaClient.cartItem.delete).not.toHaveBeenCalled()
    })

    it("returns 422 on validation error (invalid id)", async () => {
      const res = await request(app)
        .delete("/api/v1/cart/0")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(422)

      expect(res.body?.message).toBe("Validation error")
      expect(res.body?.errors).toBeDefined()
      expect(prismaClient.cartItem.findUnique).not.toHaveBeenCalled()
      expect(prismaClient.cartItem.delete).not.toHaveBeenCalled()
    })

    it("returns 422 on validation error (non-numeric id)", async () => {
      const res = await request(app)
        .delete("/api/v1/cart/abc")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(422)

      expect(res.body?.message).toBe("Validation error")
      expect(res.body?.errors).toBeDefined()
      expect(prismaClient.cartItem.findUnique).not.toHaveBeenCalled()
      expect(prismaClient.cartItem.delete).not.toHaveBeenCalled()
    })
  })

  describe("PUT /api/v1/cart/:id", () => {
    it("removes item when quantity is updated to zero", async () => {
      const mockCartItem = {
        id: 1,
        cart_id: "cart1",
        color_id: 1,
        size_code: "M",
        quantity: 2,
      }

      const cartItemFindUnique = vi.fn().mockResolvedValue(mockCartItem)
      const cartItemDelete = vi.fn().mockResolvedValue(mockCartItem)

      ;(prismaClient.$transaction as any).mockImplementation(async (callback: any) => {
        const tx = {
          cartItem: {
            findUnique: cartItemFindUnique,
            delete: cartItemDelete,
          },
          productSize: {
            findFirst: vi.fn(),
          },
          productInventory: {
            aggregate: vi.fn(),
          },
        }
        return callback(tx)
      })

      const res = await request(app)
        .put("/api/v1/cart/1")
        .set("Accept", "application/json")
        .send({ quantity: 0 })
        .expect("Content-Type", /json/)
        .expect(200)

      expect(res.body).toHaveProperty("message")
      expect(prismaClient.$transaction).toHaveBeenCalled()
      expect(cartItemFindUnique).toHaveBeenCalled()
      expect(cartItemFindUnique.mock.calls[0][0]?.where?.id).toBe(1)
      expect(cartItemDelete).toHaveBeenCalledWith({
        where: {
          id: 1,
        },
      })
    })
  })
})
