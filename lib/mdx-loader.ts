import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { marked } from "marked"

const REALISATIONS_DIR = path.join(process.cwd(), "content/realisations")

export interface RealisationMeta {
  title: string
  description: string
  category: string
  year: number
  image: string
  images: string[]
  stats: Array<{ label: string; value: string }>
  highlights: string[]
  content: string
  slug: string
}

export async function getRealisations(): Promise<RealisationMeta[]> {
  // Ensure directory exists
  if (!fs.existsSync(REALISATIONS_DIR)) {
    fs.mkdirSync(REALISATIONS_DIR, { recursive: true })
    return []
  }

  const files = fs.readdirSync(REALISATIONS_DIR).filter((file) => file.endsWith(".mdx"))

  const realisations: RealisationMeta[] = await Promise.all(
    files.map(async (file) => {
      const filePath = path.join(REALISATIONS_DIR, file)
      const fileContent = fs.readFileSync(filePath, "utf-8")
      const { data, content } = matter(fileContent)

      let htmlContent = ""
      try {
        htmlContent = await marked(content || "")
      } catch (e) {
        console.error(`[v0] Error parsing markdown for ${file}:`, e)
        htmlContent = content || ""
      }

      return {
        title: data.title || "Untitled",
        description: data.description || "",
        category: data.category || "Général",
        year: data.year || new Date().getFullYear(),
        image: data.image || "/placeholder.svg?height=400&width=600",
        images:
          data.images && data.images.length > 0
            ? data.images
            : [data.image] || ["/placeholder.svg?height=400&width=600"],
        stats: data.stats || [],
        highlights: data.highlights || [],
        content: htmlContent,
        slug: file.replace(".mdx", ""),
      }
    }),
  )

  return realisations.sort((a, b) => b.year - a.year)
}

export async function getRealisationBySlug(slug: string): Promise<RealisationMeta | null> {
  const realisations = await getRealisations()
  return realisations.find((r) => r.slug === slug) || null
}
