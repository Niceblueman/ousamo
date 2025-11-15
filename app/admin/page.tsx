"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { FileText, ClipboardList, LogOut } from "lucide-react"
import { signOut } from "next-auth/react"

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin?callbackUrl=/admin")
    } else if (status === "authenticated") {
      const isAdmin = (session?.user as any)?.isAdmin
      if (!isAdmin) {
        router.push("/")
      }
    }
  }, [session, status, router])

  if (status === "loading") {
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-slate-400">Welcome back, {session.user?.name}</p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/admin/quotes">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700 hover:border-blue-500 transition-colors cursor-pointer"
            >
              <ClipboardList className="w-12 h-12 text-blue-400 mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Quote Requests</h2>
              <p className="text-slate-400">
                View and manage all submitted quote requests
              </p>
            </motion.div>
          </Link>

          <Link href="/admin/mdx">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700 hover:border-blue-500 transition-colors cursor-pointer"
            >
              <FileText className="w-12 h-12 text-blue-400 mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">MDX Files</h2>
              <p className="text-slate-400">
                Manage your realisation MDX files (add, edit, remove, view)
              </p>
            </motion.div>
          </Link>
        </div>
      </div>
    </div>
  )
}

