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
    NEXT_PUBLIC_SUPABASE_URL: "https://test.supabase.co",
    SUPABASE_SERVICE_ROLE_KEY: "test-service-role-key",
    RESEND_API_KEY: "test-resend-key",
    NEXT_PUBLIC_ADMIN_EMAIL: "admin@test.com",
  }
})

afterEach(() => {
  process.env = originalEnv
})

// Mock Supabase
jest.mock("@supabase/ssr", () => ({
  createServerClient: jest.fn(() => ({
    from: jest.fn(() => ({
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn(),
        })),
      })),
    })),
  })),
}))

// Mock Next.js cookies
jest.mock("next/headers", () => ({
  cookies: jest.fn(() => ({
    getAll: jest.fn(() => []),
    set: jest.fn(),
  })),
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
    const mockSupabase = require("@supabase/ssr").createServerClient()
    const mockInsert = {
      select: jest.fn(() => ({
        single: jest.fn(() => ({
          data: { id: "123", company_name: "Test Company" },
          error: null,
        })),
      })),
    }
    mockSupabase.from.mockReturnValue({
      insert: jest.fn(() => mockInsert),
    })

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
  })

  it("should handle database errors gracefully", async () => {
    const mockSupabase = require("@supabase/ssr").createServerClient()
    const mockInsert = {
      select: jest.fn(() => ({
        single: jest.fn(() => ({
          data: null,
          error: { message: "Database error" },
        })),
      })),
    }
    mockSupabase.from.mockReturnValue({
      insert: jest.fn(() => mockInsert),
    })

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

  it("should handle missing environment variables", async () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL
    delete process.env.SUPABASE_SERVICE_ROLE_KEY

    const request = new NextRequest("http://localhost/api/quote/submit", {
      method: "POST",
      body: JSON.stringify({
        companyName: "Test Company",
        email: "test@example.com",
        phone: "+33123456789",
        description: "Test",
        budget: "medium",
        selections: { 1: "construction" },
      }),
    })

    const response = await POST(request)
    expect(response.status).toBe(500)
  })
})

