"use client"

import * as React from "react"
import { useLanguage } from "@/components/language-provider"
import { type Language } from "@/lib/i18n"
import { Globe } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const languages: { code: Language; label: string; flag: string }[] = [
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "en", label: "English", flag: "🇬🇧" },
]

export function LanguageSwitcher() {
  const [isOpen, setIsOpen] = React.useState(false)
  const { language, setLanguage } = useLanguage()

  const currentLang = languages.find((l) => l.code === language) || languages[0]

  return (
    <div className="fixed bottom-6 left-6 z-50">
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
              {languages.map((lang) => (
                <motion.button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code)
                    setIsOpen(false)
                  }}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${
                    language === lang.code
                      ? "bg-slate-700 text-white"
                      : "text-slate-300 hover:bg-slate-700/50"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-lg">{lang.flag}</span>
                  <span className="text-sm font-medium">{lang.label}</span>
                  {language === lang.code && (
                    <motion.div
                      layoutId="activeLanguage"
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
        aria-label="Toggle language"
      >
        <Globe className="w-5 h-5" />
      </motion.button>
    </div>
  )
}

