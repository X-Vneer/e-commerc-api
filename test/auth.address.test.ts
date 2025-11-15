import request from "supertest"
import { beforeEach, describe, expect, it, vi } from "vitest"

import app from "../src/app.js"
import prismaClient from "../src/prisma/index.js"

// Mock Prisma client before importing routes/handlers
vi.mock("@/prisma/index.js", () => {
  const user = {
    update: vi.fn(),
  }
  const prisma = { user }
  return { default: prisma }
})

// Bypass auth: inject a fake userId and continue
vi.mock("@/api/middlewares/auth.ts", () => ({
  authMiddleware: (req: any, _res: any, next: any) => {
    req.userId = 1
    next()
  },
  userIdMiddleware: (req: any, _res: any, next: any) => {
    next()
  },
}))

describe("PUT /api/v1/auth/address", () => {
  const validBody = {
    region_id: 2,
    address: "Apartment 12B, Sunset Blvd",
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("updates the user's region and address and returns 200", async () => {
    const updatedUser = { id: 1, ...validBody }
    ;(prismaClient.user.update as any).mockResolvedValue(updatedUser)

    const res = await request(app)
      .put("/api/v1/auth/address")
      .set("Accept", "application/json")
      .send(validBody)
      .expect("Content-Type", /json/)
      .expect(200)

    expect(prismaClient.user.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 1 },
        data: { region: { connect: { id: validBody.region_id } }, address: validBody.address },
      })
    )

    expect(res.body?.data?.id).toBe(1)
  })

  it("returns 422 on validation error (missing address)", async () => {
    const invalid = { ...validBody, address: "" }

    const res = await request(app)
      .put("/api/v1/auth/address")
      .set("Accept", "application/json")
      .send(invalid)
      .expect("Content-Type", /json/)
      .expect(422)

    expect(res.body?.message).toBe("Validation error")
    expect(res.body?.errors?.address).toBeDefined()
  })
})
