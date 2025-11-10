"use client"

import { motion } from "framer-motion"
import type { QuoteStep } from "@/lib/quote-utils"
import { QuoteOptionCard } from "./quote-option-card"

interface QuoteStepProps {
  step: QuoteStep
  selectedOptions: string | string[]
  onSelect: (optionId: string) => void
  stepNumber: number
  totalSteps: number
}

export function QuoteStepComponent({ step, selectedOptions, onSelect, stepNumber, totalSteps }: QuoteStepProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen flex flex-col justify-center items-center px-4 py-20"
    >
      {/* Progress Indicator */}
      <div className="mb-12 text-center">
        <motion.p className="text-sm font-semibold text-blue-400 uppercase tracking-wide mb-2">
          Étape {stepNumber} sur {totalSteps}
        </motion.p>
        <motion.h1 className="text-4xl md:text-5xl font-bold text-white mb-4 text-balance">{step.title}</motion.h1>
        <motion.p className="text-lg text-slate-400 max-w-2xl">{step.description}</motion.p>
      </div>

      {/* Progress Bar */}
      <motion.div
        className="w-full max-w-2xl h-1 bg-slate-700 rounded-full mb-12 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
          initial={{ width: 0 }}
          animate={{ width: `${(stepNumber / totalSteps) * 100}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </motion.div>

      {/* Options Grid */}
      <div className="w-full max-w-5xl">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
        >
          {step.options.map((option, index) => (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <QuoteOptionCard
                option={option}
                isSelected={
                  Array.isArray(selectedOptions) ? selectedOptions.includes(option.id) : selectedOptions === option.id
                }
                onSelect={onSelect}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  )
}
