"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Moon, Palette } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const themes = [
  { value: "dark", label: "Slate", color: "bg-slate-600" },
  { value: "dark-blue", label: "Blue", color: "bg-blue-600" },
  { value: "dark-amber", label: "Amber", color: "bg-amber-600" },
] as const

export function ThemeSwitcher() {
  const [mounted, setMounted] = React.useState(false)
  const [isOpen, setIsOpen] = React.useState(false)
  const { theme, setTheme } = useTheme()

  React.useEffect(() => {
    setMounted(true)
  }, [])

  React.useEffect(() => {
    if (mounted && theme) {
      // Ensure theme class is applied and preserve scroll-smooth
      const html = document.documentElement
      const currentClasses = html.className.split(' ').filter(c => c !== 'dark' && c !== 'dark-blue' && c !== 'dark-amber' && c !== 'scroll-smooth')
      html.className = [theme, 'scroll-smooth', ...currentClasses].filter(Boolean).join(' ')
    }
  }, [theme, mounted])

  if (!mounted) {
    return (
      <button className="fixed bottom-6 right-6 p-3 rounded-full bg-slate-800 text-white shadow-lg z-50">
        <Palette className="w-5 h-5" />
      </button>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.2 }}
            className="mb-3 p-2 rounded-2xl bg-slate-800/95 backdrop-blur-sm border border-slate-700 shadow-2xl"
          >
            <div className="flex flex-col gap-2">
              {themes.map((t) => (
                <motion.button
                  key={t.value}
                  onClick={() => {
                    setTheme(t.value)
                    setIsOpen(false)
                  }}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${
                    theme === t.value
                      ? "bg-slate-700 text-white"
                      : "text-slate-300 hover:bg-slate-700/50"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className={`w-4 h-4 rounded-full ${t.color}`} />
                  <span className="text-sm font-medium">{t.label}</span>
                  {theme === t.value && (
                    <motion.div
                      layoutId="activeTheme"
                      className="ml-auto w-2 h-2 rounded-full bg-blue-500"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 rounded-full bg-slate-800/95 backdrop-blur-sm text-white shadow-lg border border-slate-700 hover:bg-slate-700 transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Toggle theme"
      >
        {isOpen ? (
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: 180 }}
            transition={{ duration: 0.3 }}
          >
            <Moon className="w-5 h-5" />
          </motion.div>
        ) : (
          <Palette className="w-5 h-5" />
        )}
      </motion.button>
    </div>
  )
}

