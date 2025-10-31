import request from "supertest"
import { beforeEach, describe, expect, it, vi } from "vitest"

import app from "../src/app.js"
import prismaClient from "../src/prisma/index.js"

// Mocks must be declared before importing the app (which wires routes/handlers)
vi.mock("../src/prisma/index.js", () => {
  const user = {
    findFirst: vi.fn(),
    create: vi.fn(),
  }
  const region = {
    findUnique: vi.fn(),
  }
  const prisma = { user, region }
  return { default: prisma }
})

vi.mock("bcrypt", () => ({
  default: {
    genSalt: vi.fn().mockResolvedValue("salt"),
    hash: vi.fn().mockResolvedValue("hashed-password"),
    compare: vi.fn(),
  },
}))

vi.mock("../src/api/auth/utils/generate-access-token.js", () => ({
  generateAccessToken: vi.fn(() => "test-access-token"),
}))

describe("POST /api/v1/auth/register", () => {
  const validBody = {
    phone: "0501234567",
    password: "password123",
    name: "John Doe",
    email: "john@example.com",
    region_id: "1",
    address: "123 Main St",
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("creates a new user and returns 201 with token", async () => {
    // No existing user
    ;(prismaClient.user.findFirst as any).mockResolvedValue(null)
    // Region exists
    ;(prismaClient.region.findUnique as any).mockResolvedValue({ id: validBody.region_id })
    // Create user
    const createdUser = { id: "u1", ...validBody, password: "hashed-password" }
    ;(prismaClient.user.create as any).mockResolvedValue(createdUser)

    const res = await request(app)
      .post("/api/v1/auth/register")
      .set("Accept", "application/json")
      .send(validBody)
      .expect("Content-Type", /json/)
      .expect(201)

    expect(res.body?.data?.accessToken).toBe("test-access-token")
    expect(res.body?.data?.user?.id).toBe("u1")
    expect(prismaClient.user.create).toHaveBeenCalled()
  })

  it("returns 409 if user already exists (phone/email)", async () => {
    ;(prismaClient.user.findFirst as any).mockResolvedValue({ id: "exists" })

    const res = await request(app)
      .post("/api/v1/auth/register")
      .set("Accept", "application/json")
      .send(validBody)
      .expect("Content-Type", /json/)
      .expect(409)

    expect(res.body).toMatchObject({ message: "User already exists" })
  })

  it("returns 404 if region is not found", async () => {
    ;(prismaClient.user.findFirst as any).mockResolvedValue(null)
    ;(prismaClient.region.findUnique as any).mockResolvedValue(null)

    const res = await request(app)
      .post("/api/v1/auth/register")
      .set("Accept", "application/json")
      .send(validBody)
      .expect("Content-Type", /json/)
      .expect(404)

    expect(res.body).toMatchObject({ message: "Region not found" })
  })

  it("returns 422 on validation error (short password)", async () => {
    const invalid = { ...validBody, password: "short" }
    const res = await request(app)
      .post("/api/v1/auth/register")
      .set("Accept", "application/json")
      .send(invalid)
      .expect("Content-Type", /json/)
      .expect(422)

    expect(res.body?.message).toBe("Validation error")
    expect(res.body?.errors?.password).toBeDefined()
  })
})
