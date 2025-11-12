'use client'

import * as React from 'react'
import { detectLanguage, type Language, supportedLanguages } from '@/lib/i18n'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = React.createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = React.useState<Language>(() => {
    if (typeof window !== 'undefined') {
      return detectLanguage()
    }
    return 'fr'
  })

  React.useEffect(() => {
    // Detect and set language on mount
    const detectedLang = detectLanguage()
    setLanguageState(detectedLang)
    
    // Update HTML lang attribute
    document.documentElement.lang = detectedLang
  }, [])

  const setLanguage = React.useCallback((lang: Language) => {
    setLanguageState(lang)
    if (typeof window !== 'undefined') {
      localStorage.setItem('ousamo-language', lang)
      document.documentElement.lang = lang
    }
  }, [])

  const t = React.useCallback((key: string): string => {
    const { getTranslation } = require('@/lib/i18n')
    return getTranslation(language, key)
  }, [language])

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = React.useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

