import request from "supertest"
import { beforeEach, describe, expect, it, vi } from "vitest"

import app from "../src/app.js"

// Prisma won't be hit because validation fails before handlers, but mock defensively
vi.mock("../src/prisma/index.js", () => ({
  default: {
    user: {
      findUnique: vi.fn().mockResolvedValue(null), // no user -> 401
    },
  },
}))

describe("Phone number validation", () => {
  const invalidPhone = "123"
  const validPassword = "password123"
  const validPhone = "+970598654781"

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("register: returns 422 with translated phone error", async () => {
    const res = await request(app)
      .post("/api/v1/auth/register")
      .set("Accept", "application/json")
      .send({
        phone: invalidPhone,
        password: validPassword,
        name: "John",
        email: "john@example.com",
        region_id: 1,
        address: "Somewhere",
      })
      .expect("Content-Type", /json/)
      .expect(422)

    expect(res.body?.message).toBe("Validation error")
    expect(res.body?.errors?.phone).toBe("Invalid phone number")
  })

  it("login: returns 422 with translated phone error", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .set("Accept", "application/json")
      .send({
        phone: invalidPhone,
        password: validPassword,
      })
      .expect("Content-Type", /json/)
      .expect(422)

    expect(res.body?.message).toBe("Validation error")
    expect(res.body?.errors?.phone).toBe("Invalid phone number")
  })

  it("login: accepts valid phone format (no 422)", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .set("Accept", "application/json")
      .send({
        phone: validPhone,
        password: validPassword,
      })
      .expect("Content-Type", /json/)
      // With valid input, handler runs and will likely return 401 (no user)
      .expect(401)

    expect(res.body?.message).toBe("Unauthorized")
  })
})
