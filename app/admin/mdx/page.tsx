"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, FileText, Plus, Edit, Trash2, Eye, X } from "lucide-react"
import type { RealisationMeta } from "@/lib/mdx-loader"

interface MDXFile {
  slug: string
  frontmatter: any
  content: string
}

export default function AdminMDXPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [files, setFiles] = useState<RealisationMeta[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<string | null>(null)
  const [viewing, setViewing] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState<MDXFile>({
    slug: "",
    frontmatter: {
      title: "",
      description: "",
      category: "",
      year: new Date().getFullYear(),
      image: "/placeholder.svg",
      images: [],
      stats: [],
      highlights: [],
    },
    content: "",
  })

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin?callbackUrl=/admin/mdx")
    } else if (status === "authenticated") {
      const isAdmin = (session?.user as any)?.isAdmin
      if (!isAdmin) {
        router.push("/")
      } else {
        fetchFiles()
      }
    }
  }, [session, status, router])

  const fetchFiles = async () => {
    try {
      const response = await fetch("/api/admin/mdx")
      if (response.ok) {
        const data = await response.json()
        setFiles(data.realisations || [])
      }
    } catch (error) {
      console.error("Error fetching files:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadFileForEdit = async (slug: string) => {
    try {
      const response = await fetch(`/api/admin/mdx/${slug}`)
      if (response.ok) {
        const data = await response.json()
        setFormData({
          slug: data.slug,
          frontmatter: data.frontmatter,
          content: data.content,
        })
        setEditing(slug)
        setShowForm(true)
      }
    } catch (error) {
      console.error("Error loading file:", error)
      alert("Failed to load file")
    }
  }

  const loadFileForView = async (slug: string) => {
    try {
      const response = await fetch(`/api/admin/mdx/${slug}`)
      if (response.ok) {
        const data = await response.json()
        setFormData({
          slug: data.slug,
          frontmatter: data.frontmatter,
          content: data.content,
        })
        setViewing(slug)
      }
    } catch (error) {
      console.error("Error loading file:", error)
      alert("Failed to load file")
    }
  }

  const saveFile = async () => {
    try {
      const url = editing
        ? `/api/admin/mdx/${editing}`
        : "/api/admin/mdx"
      const method = editing ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        fetchFiles()
        resetForm()
      } else {
        const error = await response.json()
        alert(error.error || "Failed to save file")
      }
    } catch (error) {
      console.error("Error saving file:", error)
      alert("Failed to save file")
    }
  }

  const deleteFile = async (slug: string) => {
    if (!confirm(`Are you sure you want to delete "${slug}"?`)) return

    try {
      const response = await fetch(`/api/admin/mdx/${slug}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchFiles()
      } else {
        alert("Failed to delete file")
      }
    } catch (error) {
      console.error("Error deleting file:", error)
      alert("Failed to delete file")
    }
  }

  const resetForm = () => {
    setFormData({
      slug: "",
      frontmatter: {
        title: "",
        description: "",
        category: "",
        year: new Date().getFullYear(),
        image: "/placeholder.svg",
        images: [],
        stats: [],
        highlights: [],
      },
      content: "",
    })
    setEditing(null)
    setViewing(null)
    setShowForm(false)
  }

  const addArrayItem = (key: string, item: string) => {
    setFormData((prev) => ({
      ...prev,
      frontmatter: {
        ...prev.frontmatter,
        [key]: [...(prev.frontmatter[key] || []), item],
      },
    }))
  }

  const removeArrayItem = (key: string, index: number) => {
    setFormData((prev) => ({
      ...prev,
      frontmatter: {
        ...prev.frontmatter,
        [key]: prev.frontmatter[key].filter((_: any, i: number) => i !== index),
      },
    }))
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
      </div>
    )
  }

  if (!session || !(session.user as any)?.isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <Link href="/admin" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">MDX Files</h1>
          <button
            onClick={() => {
              resetForm()
              setShowForm(true)
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            New File
          </button>
        </div>

        {/* File List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {files.map((file) => (
            <motion.div
              key={file.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700"
            >
              <FileText className="w-8 h-8 text-blue-400 mb-3" />
              <h3 className="text-xl font-bold text-white mb-2">{file.title}</h3>
              <p className="text-slate-400 text-sm mb-4 line-clamp-2">{file.description}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => loadFileForView(file.slug)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors text-sm"
                >
                  <Eye className="w-4 h-4" />
                  View
                </button>
                <button
                  onClick={() => loadFileForEdit(file.slug)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 rounded-lg transition-colors text-sm"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => deleteFile(file.slug)}
                  className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Form Modal */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={resetForm}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-slate-900 rounded-2xl p-8 max-w-4xl w-full border border-slate-700 shadow-2xl max-h-[90vh] overflow-y-auto"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white">
                    {editing ? "Edit MDX File" : "New MDX File"}
                  </h2>
                  <button
                    onClick={resetForm}
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Slug
                    </label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="my-file-name"
                      disabled={!!editing}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Title
                      </label>
                      <input
                        type="text"
                        value={formData.frontmatter.title}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            frontmatter: { ...prev.frontmatter, title: e.target.value },
                          }))
                        }
                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Category
                      </label>
                      <input
                        type="text"
                        value={formData.frontmatter.category}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            frontmatter: { ...prev.frontmatter, category: e.target.value },
                          }))
                        }
                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.frontmatter.description}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          frontmatter: { ...prev.frontmatter, description: e.target.value },
                        }))
                      }
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={2}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Year
                      </label>
                      <input
                        type="number"
                        value={formData.frontmatter.year}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            frontmatter: { ...prev.frontmatter, year: Number(e.target.value) },
                          }))
                        }
                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Image URL
                      </label>
                      <input
                        type="text"
                        value={formData.frontmatter.image}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            frontmatter: { ...prev.frontmatter, image: e.target.value },
                          }))
                        }
                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Content (Markdown)
                    </label>
                    <textarea
                      value={formData.content}
                      onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                      rows={10}
                    />
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={saveFile}
                      className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      {editing ? "Update" : "Create"}
                    </button>
                    <button
                      onClick={resetForm}
                      className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* View Modal */}
          {viewing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setViewing(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-slate-900 rounded-2xl p-8 max-w-4xl w-full border border-slate-700 shadow-2xl max-h-[90vh] overflow-y-auto"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white">{formData.frontmatter.title}</h2>
                  <button
                    onClick={() => setViewing(null)}
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Frontmatter:</h3>
                    <pre className="bg-slate-800 p-4 rounded-lg text-slate-300 text-sm overflow-x-auto">
                      {JSON.stringify(formData.frontmatter, null, 2)}
                    </pre>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Content:</h3>
                    <pre className="bg-slate-800 p-4 rounded-lg text-slate-300 text-sm whitespace-pre-wrap overflow-x-auto">
                      {formData.content}
                    </pre>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {files.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-slate-400">No MDX files yet</p>
          </div>
        )}
      </div>
    </div>
  )
}

