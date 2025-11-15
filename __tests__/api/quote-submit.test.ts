/**
 * @jest-environment node
 */

import { POST } from "@/app/api/quote/submit/route"
import { NextRequest } from "next/server"

// Mock environment variables
const originalEnv = process.env

beforeEach(() => {
  jest.resetModules()
  process.env = {
    ...originalEnv,
    RESEND_API_KEY: "test-resend-key",
    NEXT_PUBLIC_ADMIN_EMAIL: "admin@test.com",
  }
})

afterEach(() => {
  process.env = originalEnv
  jest.clearAllMocks()
})

// Mock Prisma
const mockPrismaClient = {
  quoteRequest: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}

jest.mock("@/lib/db", () => ({
  prisma: mockPrismaClient,
  getDatabase: () => mockPrismaClient,
}))

// Mock fetch for Resend API
global.fetch = jest.fn()

describe("POST /api/quote/submit", () => {
  it("should return 500 if required fields are missing", async () => {
    const request = new NextRequest("http://localhost/api/quote/submit", {
      method: "POST",
      body: JSON.stringify({
        companyName: "",
        email: "",
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(500)
  })

  it("should successfully submit a quote request with valid data", async () => {
    const mockQuoteRequest = {
      id: 123,
      companyName: "Test Company",
      email: "test@example.com",
      phone: "+33123456789",
      description: "Test project description",
      serviceType: "construction",
      projectType: "new",
      timeline: "normal",
      budgetRange: "medium",
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    mockPrismaClient.quoteRequest.create.mockResolvedValue(mockQuoteRequest)

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    })
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    })

    const request = new NextRequest("http://localhost/api/quote/submit", {
      method: "POST",
      body: JSON.stringify({
        companyName: "Test Company",
        email: "test@example.com",
        phone: "+33123456789",
        description: "Test project description",
        budget: "medium",
        selections: {
          1: "construction",
          2: "new",
          3: "normal",
          4: "budget-medium",
        },
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.quoteId).toBeDefined()
    expect(mockPrismaClient.quoteRequest.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        companyName: "Test Company",
        email: "test@example.com",
        phone: "+33123456789",
      }),
    })
  })

  it("should handle database errors gracefully", async () => {
    mockPrismaClient.quoteRequest.create.mockRejectedValue(
      new Error("Database error")
    )

    const request = new NextRequest("http://localhost/api/quote/submit", {
      method: "POST",
      body: JSON.stringify({
        companyName: "Test Company",
        email: "test@example.com",
        phone: "+33123456789",
        description: "Test project",
        budget: "medium",
        selections: { 1: "construction" },
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe("Failed to save quote request")
  })
})

