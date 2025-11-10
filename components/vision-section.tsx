"use client"

import { motion } from "framer-motion"
import { companyData } from "@/lib/data"

export function VisionSection() {
  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-4xl font-bold text-slate-900 mb-4 sm:mb-6">Notre Vision</h2>
            <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 leading-relaxed">
              {companyData.vision.description}
            </p>
            <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-4">Nos Principes</h3>
            <ul className="space-y-2 sm:space-y-3">
              {companyData.vision.principles.map((principle, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-3 text-sm sm:text-base text-gray-700"
                >
                  <span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0" />
                  {principle}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-xl p-8 sm:p-12 border border-slate-200"
          >
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">✓</span>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">Qualité</h4>
                  <p className="text-gray-600 text-sm">Exigence en matière de qualité de nos produits</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">✓</span>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">Partenariat</h4>
                  <p className="text-gray-600 text-sm">Confiance établie avec nos partenaires</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">✓</span>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">Innovation</h4>
                  <p className="text-gray-600 text-sm">Innovation continue dans nos processus</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
