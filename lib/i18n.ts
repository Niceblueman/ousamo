import fr from './translations/fr.json'
import en from './translations/en.json'

export type Language = 'fr' | 'en'

export const translations = {
  fr,
  en,
} as const

export const defaultLanguage: Language = 'fr'
export const supportedLanguages: Language[] = ['fr', 'en']

export function detectLanguage(): Language {
  if (typeof window === 'undefined') {
    return defaultLanguage
  }

  // Check localStorage first
  const savedLang = localStorage.getItem('ousamo-language') as Language | null
  if (savedLang && supportedLanguages.includes(savedLang)) {
    return savedLang
  }

  // Detect from browser
  const browserLang = navigator.language || (navigator as any).userLanguage
  const langCode = browserLang.split('-')[0].toLowerCase()

  if (langCode === 'en') {
    return 'en'
  }

  // Default to French
  return 'fr'
}

export function getTranslation(lang: Language, key: string): string {
  const keys = key.split('.')
  let value: any = translations[lang]

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k]
    } else {
      // Fallback to French if key not found
      value = translations[defaultLanguage]
      for (const fallbackKey of keys) {
        if (value && typeof value === 'object' && fallbackKey in value) {
          value = value[fallbackKey]
        } else {
          return key
        }
      }
      break
    }
  }

  return typeof value === 'string' ? value : key
}

