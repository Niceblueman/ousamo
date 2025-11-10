"use client"

import type React from "react"

import { motion } from "framer-motion"
import { useState } from "react"
import { Mail, Phone, Building2, MessageSquare, Send } from "lucide-react"

interface QuoteFormProps {
  onSubmit: (data: FormData) => Promise<void>
  isLoading?: boolean
}

export interface FormData {
  companyName: string
  email: string
  phone: string
  description: string
  budget: string
}

export function QuoteForm({ onSubmit, isLoading = false }: QuoteFormProps) {
  const [formData, setFormData] = useState<FormData>({
    companyName: "",
    email: "",
    phone: "",
    description: "",
    budget: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.companyName.trim()) newErrors.companyName = "Le nom de l'entreprise est requis"
    if (!formData.email.trim()) newErrors.email = "L'email est requis"
    if (!formData.email.includes("@")) newErrors.email = "Email invalide"
    if (!formData.phone.trim()) newErrors.phone = "Le téléphone est requis"
    if (!formData.description.trim()) newErrors.description = "La description est requise"
    if (!formData.budget.trim()) newErrors.budget = "Le budget est requis"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      await onSubmit(formData)
      setSubmitted(true)
    } catch (error) {
      console.error("Form submission error:", error)
    }
  }

  if (submitted) {
    return (
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-screen flex items-center justify-center px-4 py-20"
      >
        <motion.div
          className="text-center max-w-lg"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <motion.div className="mb-6 flex justify-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
              <motion.svg
                className="w-8 h-8 text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </motion.svg>
            </div>
          </motion.div>
          <h2 className="text-3xl font-bold text-white mb-4">Devis en cours de traitement</h2>
          <p className="text-slate-400 mb-8">
            Merci pour votre demande! Nous analyserons votre projet et vous enverrons un devis détaillé par email dans
            les 24-48 heures.
          </p>
          <motion.button
            onClick={() => (window.location.href = "/")}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Retour à l'accueil
          </motion.button>
        </motion.div>
      </motion.section>
    )
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen flex flex-col justify-center items-center px-4 py-20"
    >
      {/* Section Title */}
      <div className="mb-12 text-center">
        <motion.p className="text-sm font-semibold text-blue-400 uppercase tracking-wide mb-2">Étape 5 sur 5</motion.p>
        <motion.h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Détails de Votre Entreprise</motion.h1>
        <motion.p className="text-lg text-slate-400 max-w-2xl">
          Complétez vos informations pour recevoir un devis personnalisé
        </motion.p>
      </div>

      {/* Progress Bar */}
      <motion.div
        className="w-full max-w-2xl h-1 bg-slate-700 rounded-full mb-12 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 to-blue-600 w-full"
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </motion.div>

      {/* Form */}
      <motion.form onSubmit={handleSubmit} className="w-full max-w-2xl space-y-6">
        {/* Company Name */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <label className="block text-sm font-medium text-slate-300 mb-2">Nom de l'entreprise</label>
          <div className="relative">
            <Building2 className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="Votre entreprise"
              className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
          {errors.companyName && <p className="text-red-400 text-sm mt-1">{errors.companyName}</p>}
        </motion.div>

        {/* Email */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
          <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="votre@email.com"
              className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
          {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
        </motion.div>

        {/* Phone */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <label className="block text-sm font-medium text-slate-300 mb-2">Téléphone</label>
          <div className="relative">
            <Phone className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+33 6 12 34 56 78"
              className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
          {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}
        </motion.div>

        {/* Budget */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}>
          <label className="block text-sm font-medium text-slate-300 mb-2">Budget estimé</label>
          <select
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          >
            <option value="">Sélectionnez votre budget</option>
            <option value="small">Moins de 10 000€</option>
            <option value="medium">10 000€ - 50 000€</option>
            <option value="large">50 000€ - 200 000€</option>
            <option value="enterprise">200 000€+</option>
          </select>
          {errors.budget && <p className="text-red-400 text-sm mt-1">{errors.budget}</p>}
        </motion.div>

        {/* Description */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
          <label className="block text-sm font-medium text-slate-300 mb-2">Description du projet</label>
          <div className="relative">
            <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Décrivez votre projet en détail..."
              rows={5}
              className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
            />
          </div>
          {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description}</p>}
        </motion.div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={isLoading}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-5 h-5" />
          {isLoading ? "Envoi en cours..." : "Envoyer ma demande"}
        </motion.button>
      </motion.form>
    </motion.section>
  )
}
