import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import { getRealisations } from "@/lib/mdx-loader"
import fs from "fs"
import path from "path"
import matter from "gray-matter"

const REALISATIONS_DIR = path.join(process.cwd(), "content/realisations")

export async function GET() {
  try {
    await requireAdmin()

    const realisations = await getRealisations()
    return NextResponse.json({ realisations })
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    if (error instanceof Error && error.message.includes("Forbidden")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    console.error("[Admin MDX] Error:", error)
    return NextResponse.json(
      { error: "Failed to fetch MDX files" },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin()

    const body = await request.json()
    const { slug, frontmatter, content } = body

    if (!slug || !frontmatter || !content) {
      return NextResponse.json(
        { error: "Missing required fields: slug, frontmatter, content" },
        { status: 400 },
      )
    }

    // Ensure directory exists
    if (!fs.existsSync(REALISATIONS_DIR)) {
      fs.mkdirSync(REALISATIONS_DIR, { recursive: true })
    }

    const filePath = path.join(REALISATIONS_DIR, `${slug}.mdx`)
    if (fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: "File with this slug already exists" },
        { status: 409 },
      )
    }

    // Combine frontmatter and content
    const fileContent = `---\n${Object.entries(frontmatter)
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          return `${key}:\n${value.map((v: any) => `  - ${JSON.stringify(v)}`).join("\n")}`
        }
        return `${key}: ${JSON.stringify(value)}`
      })
      .join("\n")}\n---\n\n${content}`

    fs.writeFileSync(filePath, fileContent, "utf-8")

    return NextResponse.json({ success: true, slug })
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    if (error instanceof Error && error.message.includes("Forbidden")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    console.error("[Admin MDX Create] Error:", error)
    return NextResponse.json(
      { error: "Failed to create MDX file" },
      { status: 500 },
    )
  }
}

