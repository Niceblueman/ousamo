#!/usr/bin/env node

/**
 * Test script to debug quote form submission
 * Run with: node scripts/test-quote-submit.js
 */

const testQuoteSubmission = async () => {
  const baseUrl = process.env.TEST_URL || "http://localhost:3000"
  
  const testData = {
    companyName: "Test Company",
    email: "test@example.com",
    phone: "+33123456789",
    description: "Test project description for debugging",
    budget: "medium",
    selections: {
      1: "construction",
      2: "new",
      3: "normal",
      4: "budget-medium",
    },
    timestamp: new Date().toISOString(),
  }

  console.log("🧪 Testing Quote Form Submission")
  console.log("=" .repeat(50))
  console.log("URL:", `${baseUrl}/api/quote/submit`)
  console.log("Data:", JSON.stringify(testData, null, 2))
  console.log("=" .repeat(50))

  try {
    const response = await fetch(`${baseUrl}/api/quote/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testData),
    })

    const data = await response.json()

    console.log("\n📊 Response Status:", response.status, response.statusText)
    console.log("📦 Response Body:", JSON.stringify(data, null, 2))

    if (response.ok) {
      console.log("\n✅ SUCCESS: Quote submitted successfully!")
      console.log("Quote ID:", data.quoteId)
    } else {
      console.log("\n❌ ERROR: Submission failed")
      console.log("Error:", data.error)
      if (data.details) {
        console.log("Details:", data.details)
      }
    }
  } catch (error) {
    console.error("\n💥 EXCEPTION:", error.message)
    console.error("Stack:", error.stack)
  }
}

// Check environment variables
console.log("\n🔍 Environment Check:")
console.log("NEXT_PUBLIC_SUPABASE_URL:", process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Set" : "❌ Missing")
console.log("SUPABASE_SERVICE_ROLE_KEY:", process.env.SUPABASE_SERVICE_ROLE_KEY ? "✅ Set" : "❌ Missing")
console.log("RESEND_API_KEY:", process.env.RESEND_API_KEY ? "✅ Set" : "⚠️  Optional")
console.log("NEXT_PUBLIC_ADMIN_EMAIL:", process.env.NEXT_PUBLIC_ADMIN_EMAIL || "support@ousamo.sarl")

testQuoteSubmission()

