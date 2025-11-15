"use client"

import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { QuoteStepComponent } from "@/components/quote-step"
import { QuoteForm, type FormData } from "@/components/quote-form"
import { type QuoteStep, type QuoteData, loadQuoteData } from "@/lib/quote-utils"
import { ChevronDown, Home } from "lucide-react"
import { ThemeSwitcher } from "@/components/theme-switcher"
import Link from "next/link"

export default function QuotePage() {
  const [steps, setSteps] = useState<QuoteStep[]>([])
  const [currentStep, setCurrentStep] = useState(1)
  const [selections, setSelections] = useState<Record<number, string>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        // Add timeout to prevent hanging (5 seconds should be plenty)
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Timeout: Data loading took too long")), 5000)
        )
        
        const dataPromise = loadQuoteData()
        const data = await Promise.race([dataPromise, timeoutPromise]) as QuoteData
        
        if (data && data.steps && Array.isArray(data.steps) && data.steps.length > 0) {
          setSteps(data.steps)
        } else {
          throw new Error("Invalid data structure or empty steps")
        }
      } catch (err) {
        console.error("Error loading quote data:", err)
        setError("Erreur lors du chargement. Veuillez rafraîchir la page.")
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const handleSelectOption = (optionId: string) => {
    setSelections((prev) => ({
      ...prev,
      [currentStep]: optionId,
    }))

    // Auto-advance to next step
    if (currentStep < steps.length + 1) {
      setTimeout(() => {
        setCurrentStep((prev) => prev + 1)
        // Smooth scroll
        setTimeout(() => {
          containerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
        }, 100)
      }, 500)
    }
  }

  const handleFormSubmit = async (formData: FormData) => {
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/quote/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          selections,
          timestamp: new Date().toISOString(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        console.error("[Quote] API Error:", {
          status: response.status,
          statusText: response.statusText,
          error: data.error,
          body: data,
        })
        throw new Error(data.error || `HTTP ${response.status}: ${response.statusText}`)
      }

      // Success - form component will handle showing success message
      console.log("[Quote] Submission successful:", data)
    } catch (error) {
      console.error("[Quote] Form submission error:", error)
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Erreur lors de l'envoi du formulaire. Veuillez réessayer."
      alert(errorMessage)
      throw error // Re-throw so form component can handle it
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading || steps.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            className="inline-block"
          >
            <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full" />
          </motion.div>
          <p className="text-slate-400 mt-4">Chargement...</p>
          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-400 mt-4 text-sm"
            >
              {error}
            </motion.p>
          )}
        </div>
      </div>
    )
  }

  const totalSteps = steps.length + 1
  const step = currentStep <= steps.length ? steps[currentStep - 1] : null

  return (
    <main ref={containerRef} className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 overflow-hidden">
      {/* Back to Home Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-6 left-6 z-50"
      >
        <Link href="/">
          <motion.button
            className="flex items-center gap-2 px-4 py-2 bg-slate-800/80 backdrop-blur-sm hover:bg-slate-700/80 text-white rounded-lg font-medium border border-slate-700 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">Accueil</span>
          </motion.button>
        </Link>
      </motion.div>

      <AnimatePresence mode="wait">
        {currentStep <= steps.length && step ? (
          <QuoteStepComponent
            key={`step-${currentStep}`}
            step={step}
            selectedOptions={selections[currentStep] || ""}
            onSelect={handleSelectOption}
            stepNumber={currentStep}
            totalSteps={totalSteps}
          />
        ) : currentStep === totalSteps ? (
          <QuoteForm key="form" onSubmit={handleFormSubmit} isLoading={isSubmitting} />
        ) : null}
      </AnimatePresence>

      {/* Back Button */}
      {currentStep > 1 && (
        <motion.button
          onClick={() => {
            setCurrentStep((prev) => Math.max(1, prev - 1))
            setTimeout(() => {
              containerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
            }, 100)
          }}
          className="fixed bottom-8 left-8 px-6 py-3 bg-slate-800/50 hover:bg-slate-700/50 text-white rounded-lg font-medium border border-slate-700 transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Précédent
        </motion.button>
      )}

      {/* Scroll Indicator */}
      {currentStep <= steps.length && (
        <motion.div className="fixed bottom-8 right-24 flex flex-col items-center gap-2">
          <span className="text-slate-400 text-sm">Défiler pour continuer</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}>
            <ChevronDown className="w-5 h-5 text-blue-400" />
          </motion.div>
        </motion.div>
      )}

      {/* <ThemeSwitcher /> */}
    </main>
  )
}
