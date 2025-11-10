"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"
import { QuoteOptionCard } from "./quote-option-card"
import { QuoteForm } from "./quote-form"
import { getQuoteSteps } from "@/lib/quote-data"

export function QuoteWizardContainer() {
  const [currentStep, setCurrentStep] = useState(1)
  const [selections, setSelections] = useState<Record<number, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const steps = getQuoteSteps()
  const totalSteps = steps.length + 1 // +1 for form step

  const currentStepData = steps.find((s) => s.id === currentStep)

  // Auto scroll to current step
  useEffect(() => {
    if (containerRef.current) {
      const stepElement = containerRef.current.querySelector(`[data-step="${currentStep}"]`)
      if (stepElement) {
        setTimeout(() => {
          stepElement.scrollIntoView({ behavior: "smooth", block: "center" })
        }, 100)
      }
    }
  }, [currentStep])

  const handleSelect = (optionId: string) => {
    setSelections((prev) => ({
      ...prev,
      [currentStep]: optionId,
    }))

    // Auto advance after selection
    setTimeout(() => {
      if (currentStep < steps.length) {
        setCurrentStep(currentStep + 1)
      } else if (currentStep === steps.length) {
        setCurrentStep(steps.length + 1) // Go to form
      }
    }, 500)
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleNext = () => {
    if (selections[currentStep]) {
      if (currentStep < steps.length) {
        setCurrentStep(currentStep + 1)
      } else if (currentStep === steps.length) {
        setCurrentStep(steps.length + 1)
      }
    }
  }

  const handleFormSubmit = async (formData: any) => {
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/quote/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          selections,
        }),
      })

      if (response.ok) {
        setSubmitted(true)
      }
    } catch (error) {
      console.error("Error submitting quote:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Success screen
  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="min-h-screen flex items-center justify-center p-4"
      >
        <div className="text-center max-w-md">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 0.6 }}
            className="w-16 h-16 mx-auto mb-6 bg-green-500 rounded-full flex items-center justify-center"
          >
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              />
            </svg>
          </motion.div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Demande Reçue!</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            Merci pour votre demande. Notre équipe vous contactera très bientôt avec un devis personnalisé.
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-500">Vérifiez votre email pour les détails.</p>
        </div>
      </motion.div>
    )
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress indicator */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Demande de Devis</h1>
            <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">
              Étape {currentStep} sur {totalSteps}
            </span>
          </div>

          {/* Progress bar */}
          <motion.div
            className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="h-full bg-gradient-to-r from-blue-600 to-blue-500"
              initial={{ width: "0%" }}
              animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </motion.div>
        </div>

        {/* Steps */}
        <AnimatePresence mode="wait">
          {currentStep <= steps.length && currentStepData ? (
            <motion.div
              key={`step-${currentStep}`}
              data-step={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{currentStepData.title}</h2>
                <p className="text-slate-600 dark:text-slate-400">{currentStepData.description}</p>
              </div>

              {/* Options grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {currentStepData.options.map((option, idx) => (
                  <QuoteOptionCard
                    key={option.id}
                    {...option}
                    isSelected={selections[currentStep] === option.id}
                    onSelect={handleSelect}
                    index={idx}
                  />
                ))}
              </div>

              {/* Navigation */}
              <div className="flex gap-4 justify-between items-center">
                <button
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  className="px-6 py-2 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Précédent
                </button>

                <motion.div animate={{ y: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}>
                  <ChevronDown className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </motion.div>

                <button
                  onClick={handleNext}
                  disabled={!selections[currentStep]}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
                >
                  {currentStep === steps.length ? "Continuer au Formulaire" : "Suivant"}
                </button>
              </div>
            </motion.div>
          ) : currentStep === steps.length + 1 ? (
            <QuoteForm
              key="form"
              selections={selections}
              onSubmit={handleFormSubmit}
              isSubmitting={isSubmitting}
              onBack={() => setCurrentStep(steps.length)}
            />
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  )
}
