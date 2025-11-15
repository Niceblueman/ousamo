"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, Mail, Phone, Building2, Calendar, Trash2, Check, X } from "lucide-react"
import type { QuoteRequest } from "@/lib/db"

export default function AdminQuotesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [quotes, setQuotes] = useState<QuoteRequest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin?callbackUrl=/admin/quotes")
    } else if (status === "authenticated") {
      const isAdmin = (session?.user as any)?.isAdmin
      if (!isAdmin) {
        router.push("/")
      } else {
        fetchQuotes()
      }
    }
  }, [session, status, router])

  const fetchQuotes = async () => {
    try {
      const response = await fetch("/api/admin/quotes")
      if (response.ok) {
        const data = await response.json()
        setQuotes(data.quotes || [])
      }
    } catch (error) {
      console.error("Error fetching quotes:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id: number, status: string) => {
    try {
      const response = await fetch(`/api/admin/quotes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        fetchQuotes()
      }
    } catch (error) {
      console.error("Error updating quote:", error)
      alert("Failed to update quote status")
    }
  }

  const deleteQuote = async (id: number) => {
    if (!confirm("Are you sure you want to delete this quote?")) return

    try {
      const response = await fetch(`/api/admin/quotes/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchQuotes()
      }
    } catch (error) {
      console.error("Error deleting quote:", error)
      alert("Failed to delete quote")
    }
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

        <h1 className="text-4xl font-bold text-white mb-8">Quote Requests</h1>

        <div className="space-y-4">
          {quotes.map((quote) => (
            <motion.div
              key={quote.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Building2 className="w-5 h-5 text-blue-400" />
                    <h3 className="text-xl font-bold text-white">{quote.company_name}</h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        quote.status === "pending"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : quote.status === "completed"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-slate-500/20 text-slate-400"
                      }`}
                    >
                      {quote.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-slate-400 text-sm">
                    <div className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      {quote.email}
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      {quote.phone}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(quote.created_at).toLocaleDateString("fr-FR")}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => deleteQuote(quote.id)}
                  className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {quote.description && (
                <p className="text-slate-300 mb-4">{quote.description}</p>
              )}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                {quote.service_type && (
                  <div>
                    <span className="text-slate-500">Service:</span>
                    <p className="text-white">{quote.service_type}</p>
                  </div>
                )}
                {quote.project_type && (
                  <div>
                    <span className="text-slate-500">Project:</span>
                    <p className="text-white">{quote.project_type}</p>
                  </div>
                )}
                {quote.timeline && (
                  <div>
                    <span className="text-slate-500">Timeline:</span>
                    <p className="text-white">{quote.timeline}</p>
                  </div>
                )}
                {quote.budget_range && (
                  <div>
                    <span className="text-slate-500">Budget:</span>
                    <p className="text-white">{quote.budget_range}</p>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => updateStatus(quote.id, "completed")}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-colors"
                >
                  <Check className="w-4 h-4" />
                  Mark Complete
                </button>
                <button
                  onClick={() => updateStatus(quote.id, "pending")}
                  className="flex items-center gap-2 px-4 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                  Mark Pending
                </button>
              </div>
            </motion.div>
          ))}

          {quotes.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-400">No quote requests yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

