"use client"

import { motion } from "framer-motion"
import { Award, CheckCircle2 } from "lucide-react"
import { companyData } from "@/lib/data"

export function CertificatesSection() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4"
          >
            <Award className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600 dark:text-blue-400" />
          </motion.div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-3 sm:mb-4">
            Certifications & Standards
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Conformité aux normes industrielles et certifications de qualité
          </p>
        </motion.div>

        {/* Certificates Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {companyData.certificates.map((certificate, index) => (
            <motion.div
              key={certificate.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-slate-800 rounded-xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-slate-200 dark:border-slate-700"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-2">
                    {certificate.name}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                    {certificate.description}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-500">
                    <span className="font-semibold">Émis:</span>
                    <span>{certificate.issuedDate}</span>
                  </div>
                  {certificate.expiryDate && (
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-500 mt-1">
                      <span className="font-semibold">Expire:</span>
                      <span>{certificate.expiryDate}</span>
                    </div>
                  )}
                  {certificate.standard && (
                    <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                      <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                        {certificate.standard}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

