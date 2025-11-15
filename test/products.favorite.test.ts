import jwt from "jsonwebtoken"
import request from "supertest"
import { beforeEach, describe, expect, it, vi } from "vitest"

import app from "../src/app.js"
import prismaClient from "../src/prisma/index.js"

vi.mock("../src/prisma/index.js", () => {
  const color = {
    findUnique: vi.fn(),
    update: vi.fn(),
  }
  const user = {
    findUnique: vi.fn(),
  }

  return { default: { color, user } }
})

vi.mock("jsonwebtoken", () => ({
  default: {
    verify: vi.fn(),
  },
}))

const mockToken = "test-access-token"
const mockUser = { id: "user-1", email: "user@example.com" }
const mockProduct = {
  id: 15,
  code: "PROD001",
  name_en: "Test Product",
  name_ar: "منتج تجريبي",
}

describe("POST /api/v1/products/:id/favorite", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(jwt.verify as any).mockReturnValue({ userId: mockUser.id })
    ;(prismaClient.user.findUnique as any).mockResolvedValue(mockUser)
  })

  it("marks a product as favorite for the authenticated user", async () => {
    ;(prismaClient.color.findUnique as any).mockResolvedValue(mockProduct)
    ;(prismaClient.color.update as any).mockResolvedValue({
      ...mockProduct,
      favorite_by: [{ id: mockUser.id }],
    })

    const res = await request(app)
      .post(`/api/v1/products/${mockProduct.id}/favorite`)
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${mockToken}`)
      .send({ is_favorite: "true" })
      .expect("Content-Type", /json/)
      .expect(200)

    expect(res.body.data).toEqual({ ...mockProduct, is_favorite: true })
    expect(prismaClient.color.findUnique).toHaveBeenCalledWith({
      where: { id: mockProduct.id },
    })
    expect(prismaClient.color.update).toHaveBeenCalledWith({
      where: { id: mockProduct.id },
      data: { favorite_by: { connect: { id: mockUser.id } } },
      include: {
        product: true,
        favorite_by: {
          where: { id: mockUser.id },
          select: { id: true },
        },
      },
    })
  })

  it("removes a product from favorites when toggled off", async () => {
    ;(prismaClient.color.findUnique as any).mockResolvedValue(mockProduct)
    ;(prismaClient.color.update as any).mockResolvedValue({
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
    expect(prismaClient.color.update).toHaveBeenCalledWith({
      where: { id: mockProduct.id },
      data: { favorite_by: { disconnect: { id: mockUser.id } } },
      include: {
        product: true,
        favorite_by: {
          where: { id: mockUser.id },
          select: { id: true },
        },
      },
    })
  })

  it("returns 404 when the product does not exist", async () => {
    ;(prismaClient.color.findUnique as any).mockResolvedValue(null)

    const res = await request(app)
      .post(`/api/v1/products/${mockProduct.id}/favorite`)
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${mockToken}`)
      .send({ is_favorite: "true" })
      .expect("Content-Type", /json/)
      .expect(404)

    expect(res.body.message).toContain("Product not found")
    expect(prismaClient.color.update).not.toHaveBeenCalled()
  })
})
