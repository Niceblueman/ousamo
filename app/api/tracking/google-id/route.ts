import { NextResponse } from "next/server"
import { type NextRequest } from "next/server"
import { prisma } from "@/lib/db"

/**
 * API endpoint to store Google Advertising ID for tracking
 * This is called after user accepts cookies
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { advertisingId, clientId, sessionId, timestamp } = body

    if (!advertisingId) {
      return NextResponse.json(
        { error: "Missing advertisingId" },
        { status: 400 },
      )
    }

    // Store in tracking table
    try {
      // Check if record exists
      const existing = await prisma.googleTracking.findUnique({
        where: { advertisingId },
      })

      if (existing) {
        // Update existing record
        await prisma.googleTracking.update({
          where: { advertisingId },
          data: {
            lastSeen: new Date(),
            visitCount: { increment: 1 },
            clientId: clientId || existing.clientId,
            sessionId: sessionId || existing.sessionId,
          },
        })
      } else {
        // Insert new record
        await prisma.googleTracking.create({
          data: {
            advertisingId,
            clientId,
            sessionId,
            lastSeen: new Date(),
            visitCount: 1,
          },
        })
      }
    } catch (error) {
      console.error("[Google Tracking] Database error:", error)
      // Continue even if database fails
    }

    return NextResponse.json({
      success: true,
      message: "Google Advertising ID stored successfully",
    })
  } catch (error) {
    console.error("[Google Tracking] Error:", error)
    return NextResponse.json(
      {
        error: "Failed to store Google Advertising ID",
        details: process.env.NODE_ENV === "development" && error instanceof Error ? error.message : undefined,
      },
      { status: 500 },
    )
  }
}

