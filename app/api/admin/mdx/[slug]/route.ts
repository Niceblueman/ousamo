import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import fs from "fs"
import path from "path"
import matter from "gray-matter"

const REALISATIONS_DIR = path.join(process.cwd(), "content/realisations")

export async function GET(
  request: Request,
  { params }: { params: { slug: string } },
) {
  try {
    await requireAdmin()

    const filePath = path.join(REALISATIONS_DIR, `${params.slug}.mdx`)

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    const fileContent = fs.readFileSync(filePath, "utf-8")
    const { data: frontmatter, content } = matter(fileContent)

    return NextResponse.json({
      slug: params.slug,
      frontmatter,
      content,
    })
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    if (error instanceof Error && error.message.includes("Forbidden")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    console.error("[Admin MDX Get] Error:", error)
    return NextResponse.json(
      { error: "Failed to fetch MDX file" },
      { status: 500 },
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { slug: string } },
) {
  try {
    await requireAdmin()

    const body = await request.json()
    const { frontmatter, content, newSlug } = body

    if (!frontmatter || !content) {
      return NextResponse.json(
        { error: "Missing required fields: frontmatter, content" },
        { status: 400 },
      )
    }

    const filePath = path.join(REALISATIONS_DIR, `${params.slug}.mdx`)

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    // If newSlug is provided and different, rename the file
    const targetSlug = newSlug || params.slug
    const targetPath = path.join(REALISATIONS_DIR, `${targetSlug}.mdx`)

    // Combine frontmatter and content
    const fileContent = `---\n${Object.entries(frontmatter)
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          return `${key}:\n${value.map((v: any) => `  - ${JSON.stringify(v)}`).join("\n")}`
        }
        return `${key}: ${JSON.stringify(value)}`
      })
      .join("\n")}\n---\n\n${content}`

    if (targetSlug !== params.slug && fs.existsSync(targetPath)) {
      return NextResponse.json(
        { error: "File with new slug already exists" },
        { status: 409 },
      )
    }

    if (targetSlug !== params.slug) {
      fs.unlinkSync(filePath)
    }

    fs.writeFileSync(targetPath, fileContent, "utf-8")

    return NextResponse.json({ success: true, slug: targetSlug })
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    if (error instanceof Error && error.message.includes("Forbidden")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    console.error("[Admin MDX Update] Error:", error)
    return NextResponse.json(
      { error: "Failed to update MDX file" },
      { status: 500 },
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { slug: string } },
) {
  try {
    await requireAdmin()

    const filePath = path.join(REALISATIONS_DIR, `${params.slug}.mdx`)

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    fs.unlinkSync(filePath)

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    if (error instanceof Error && error.message.includes("Forbidden")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    console.error("[Admin MDX Delete] Error:", error)
    return NextResponse.json(
      { error: "Failed to delete MDX file" },
      { status: 500 },
    )
  }
}

