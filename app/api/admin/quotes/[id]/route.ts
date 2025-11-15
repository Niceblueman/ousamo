import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    await requireAdmin()

    const quote = await prisma.quoteRequest.findUnique({
      where: { id: Number(params.id) },
    })

    if (!quote) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 })
    }

    return NextResponse.json({ quote })
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    if (error instanceof Error && error.message.includes("Forbidden")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    console.error("[Admin Quote] Error:", error)
    return NextResponse.json(
      { error: "Failed to fetch quote" },
      { status: 500 },
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    await requireAdmin()

    const body = await request.json()
    const { status } = body

    const quote = await prisma.quoteRequest.update({
      where: { id: Number(params.id) },
      data: {
        status: status || "pending",
      },
    })

    return NextResponse.json({ quote })
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    if (error instanceof Error && error.message.includes("Forbidden")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    console.error("[Admin Quote Update] Error:", error)
    return NextResponse.json(
      { error: "Failed to update quote" },
      { status: 500 },
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    await requireAdmin()

    await prisma.quoteRequest.delete({
      where: { id: Number(params.id) },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    if (error instanceof Error && error.message.includes("Forbidden")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    console.error("[Admin Quote Delete] Error:", error)
    return NextResponse.json(
      { error: "Failed to delete quote" },
      { status: 500 },
    )
  }
}

