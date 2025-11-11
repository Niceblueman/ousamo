#!/usr/bin/env node

/**
 * Test script to debug quote data loading
 * Run with: node scripts/test-quote-data.js
 */

const testQuoteDataLoading = async () => {
  const baseUrl = process.env.TEST_URL || "http://localhost:3000"
  
  console.log("🧪 Testing Quote Data Loading")
  console.log("=" .repeat(50))
  console.log("URL:", `${baseUrl}/api/quote/data`)
  console.log("=" .repeat(50))

  try {
    const startTime = Date.now()
    const response = await fetch(`${baseUrl}/api/quote/data`, {
      cache: "no-cache",
    })
    const loadTime = Date.now() - startTime

    const data = await response.json()

    console.log("\n📊 Response Status:", response.status, response.statusText)
    console.log("⏱️  Load Time:", `${loadTime}ms`)
    console.log("📦 Data Structure:", {
      hasSteps: !!data.steps,
      stepsCount: data.steps?.length || 0,
      firstStep: data.steps?.[0] ? {
        id: data.steps[0].id,
        title: data.steps[0].title,
        optionsCount: data.steps[0].options?.length || 0,
      } : null,
    })

    if (response.ok && data.steps && data.steps.length > 0) {
      console.log("\n✅ SUCCESS: Quote data loaded successfully!")
      console.log(`Found ${data.steps.length} steps`)
    } else {
      console.log("\n❌ ERROR: Data loading failed or invalid structure")
      console.log("Data:", JSON.stringify(data, null, 2))
    }
  } catch (error) {
    console.error("\n💥 EXCEPTION:", error.message)
    console.error("Stack:", error.stack)
  }
}

testQuoteDataLoading()

