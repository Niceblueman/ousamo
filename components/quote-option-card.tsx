"use client"

import type React from "react"

import { motion, AnimatePresence } from "framer-motion"
import type { QuoteOption } from "@/lib/quote-utils"
import * as Icons from "lucide-react"
import { useState } from "react"

interface QuoteOptionCardProps {
  option: QuoteOption
  isSelected: boolean
  onSelect: (id: string) => void
}

export function QuoteOptionCard({ option, isSelected, onSelect }: QuoteOptionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const IconComponent = Icons[option.icon as keyof typeof Icons] as React.ComponentType<{ className?: string }>

  return (
    <>
      <motion.div
        onClick={() => setIsExpanded(true)}
        className={`relative p-6 rounded-2xl cursor-pointer transition-all ${
          isSelected
            ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg ring-2 ring-blue-400"
            : "bg-slate-900/50 border border-slate-700 text-slate-100 hover:border-slate-600"
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="flex flex-col items-center gap-4 text-center">
          <motion.div
            className="p-3 rounded-lg bg-slate-800/50"
            whileHover={{ rotate: 5 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            {IconComponent && <IconComponent className="w-8 h-8" />}
          </motion.div>
          <div>
            <h3 className="font-semibold text-lg">{option.title}</h3>
            <p className="text-sm opacity-75">{option.subtitle}</p>
          </div>
        </div>
      </motion.div>

      {/* Expanded Detail Modal */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsExpanded(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 rounded-2xl p-8 max-w-lg w-full border border-slate-700 shadow-2xl"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-lg bg-blue-500/20">
                  {IconComponent && <IconComponent className="w-8 h-8 text-blue-400" />}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{option.title}</h2>
                  <p className="text-slate-400">{option.subtitle}</p>
                </div>
              </div>

              <p className="text-slate-300 leading-relaxed mb-6">{option.details}</p>

              <div className="flex gap-3">
                <button
                  onClick={() => setIsExpanded(false)}
                  className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors"
                >
                  Fermer
                </button>
                <button
                  onClick={() => {
                    onSelect(option.id)
                    setIsExpanded(false)
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  Sélectionner
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
