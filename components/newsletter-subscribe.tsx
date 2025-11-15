"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Mail, Check, Loader2 } from "lucide-react"
import { useLanguage } from "./language-provider"

const translations = {
  fr: {
    title: "Abonnez-vous à notre newsletter",
    subtitle: "Recevez nos dernières actualités et annonces",
    placeholder: "Votre adresse email",
    button: "S'abonner",
    success: "Merci ! Vérifiez votre email pour confirmer.",
    error: "Une erreur est survenue. Veuillez réessayer.",
    invalidEmail: "Veuillez entrer une adresse email valide.",
    alreadySubscribed: "Cet email est déjà abonné.",
  },
  en: {
    title: "Subscribe to our newsletter",
    subtitle: "Get the latest news and announcements",
    placeholder: "Your email address",
    button: "Subscribe",
    success: "Thank you! Please check your email to confirm.",
    error: "An error occurred. Please try again.",
    invalidEmail: "Please enter a valid email address.",
    alreadySubscribed: "This email is already subscribed.",
  },
}

export function NewsletterSubscribe() {
  const { language } = useLanguage()
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const t = translations[language as keyof typeof translations] || translations.fr

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim()) {
      setMessage(t.invalidEmail)
      setStatus("error")
      return
    }

    if (!validateEmail(email)) {
      setMessage(t.invalidEmail)
      setStatus("error")
      return
    }

    setStatus("loading")
    setMessage("")

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 409) {
          setMessage(t.alreadySubscribed)
          setStatus("error")
        } else {
          setMessage(data.error || t.error)
          setStatus("error")
        }
        return
      }

      setMessage(t.success)
      setStatus("success")
      setEmail("")

      // Reset status after 5 seconds
      setTimeout(() => {
        setStatus("idle")
        setMessage("")
      }, 5000)
    } catch (error) {
      console.error("Newsletter subscription error:", error)
      setMessage(t.error)
      setStatus("error")
    }
  }

  return (
    <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
      <div className="flex items-center gap-3 mb-3">
        <Mail className="w-5 h-5 text-blue-400 flex-shrink-0" />
        <h4 className="text-white font-semibold text-sm sm:text-base">{t.title}</h4>
      </div>
      <p className="text-slate-400 text-xs sm:text-sm mb-4">{t.subtitle}</p>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t.placeholder}
            disabled={status === "loading"}
            className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          />
        </div>
        <button
          type="submit"
          disabled={status === "loading" || status === "success"}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm whitespace-nowrap"
        >
          {status === "loading" ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="hidden sm:inline">...</span>
            </>
          ) : status === "success" ? (
            <>
              <Check className="w-4 h-4" />
              <span className="hidden sm:inline">✓</span>
            </>
          ) : (
            t.button
          )}
        </button>
      </form>

      {message && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-3 text-xs sm:text-sm ${
            status === "success" ? "text-green-400" : "text-red-400"
          }`}
        >
          {message}
        </motion.p>
      )}
    </div>
  )
}

