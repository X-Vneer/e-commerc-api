import jwt from "jsonwebtoken"
import request from "supertest"
import { beforeEach, describe, expect, it, vi } from "vitest"

import app from "../src/app.js"
import prismaClient from "../src/prisma/index.js"

vi.mock("../src/prisma/index.js", () => {
  const product = {
    findUnique: vi.fn(),
    update: vi.fn(),
  }
  const admin = {
    findUnique: vi.fn(),
  }

  return { default: { product, admin } }
})

vi.mock("jsonwebtoken", () => ({
  default: {
    verify: vi.fn(),
  },
}))

const mockToken = "test-access-token"
const mockAdmin = { id: "admin-1", email: "admin@example.com" }
const mockProduct = {
  id: 1,
  code: "PROD001",
  name_en: "Test Product",
  name_ar: "منتج تجريبي",
}

describe("POST /api/v1/products/:id/favorite", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(jwt.verify as any).mockReturnValue({ userId: mockAdmin.id })
    ;(prismaClient.admin.findUnique as any).mockResolvedValue(mockAdmin)
  })

  it("marks a product as favorite for the authenticated admin", async () => {
    ;(prismaClient.product.findUnique as any).mockResolvedValue(mockProduct)
    ;(prismaClient.product.update as any).mockResolvedValue({
      ...mockProduct,
      favorite_by: [{ id: mockAdmin.id }],
    })

    const res = await request(app)
      .post(`/api/v1/products/${mockProduct.id}/favorite`)
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${mockToken}`)
      .send({ is_favorite: "true" })
      .expect("Content-Type", /json/)
      .expect(200)

    expect(res.body.message).toContain("Product updated successfully")
    expect(res.body.data).toEqual({ ...mockProduct, is_favorite: true })
    expect(prismaClient.product.findUnique).toHaveBeenCalledWith({
      where: { id: mockProduct.id },
    })
    expect(prismaClient.product.update).toHaveBeenCalledWith({
      where: { id: mockProduct.id },
      data: { favorite_by: { connect: { id: mockAdmin.id } } },
      include: {
        favorite_by: {
          where: { id: mockAdmin.id },
          select: { id: true },
        },
      },
    })
  })

  it("removes a product from favorites when toggled off", async () => {
    ;(prismaClient.product.findUnique as any).mockResolvedValue(mockProduct)
    ;(prismaClient.product.update as any).mockResolvedValue({
      ...mockProduct,
      favorite_by: [],
    })

    const res = await request(app)
      .post(`/api/v1/products/${mockProduct.id}/favorite`)
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${mockToken}`)
      .send({ is_favorite: "false" })
      .expect("Content-Type", /json/)
      .expect(200)

    expect(res.body.message).toContain("Product updated successfully")
    expect(res.body.data).toEqual({ ...mockProduct, is_favorite: false })
    expect(prismaClient.product.update).toHaveBeenCalledWith({
      where: { id: mockProduct.id },
      data: { favorite_by: { disconnect: { id: mockAdmin.id } } },
      include: {
        favorite_by: {
          where: { id: mockAdmin.id },
          select: { id: true },
        },
      },
    })
  })

  it("returns 404 when the product does not exist", async () => {
    ;(prismaClient.product.findUnique as any).mockResolvedValue(null)

    const res = await request(app)
      .post(`/api/v1/products/${mockProduct.id}/favorite`)
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${mockToken}`)
      .send({ is_favorite: "true" })
      .expect("Content-Type", /json/)
      .expect(404)

    expect(res.body.message).toContain("Product not found")
    expect(prismaClient.product.update).not.toHaveBeenCalled()
  })
})
