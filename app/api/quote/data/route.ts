import { NextResponse } from "next/server"
import quoteData from "@/data/quote-options.json"

export async function GET() {
  try {
    return NextResponse.json(quoteData, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    })
  } catch (error) {
    console.error("Error loading quote data:", error)
    return NextResponse.json({ error: "Failed to load quote data" }, { status: 500 })
  }
}

