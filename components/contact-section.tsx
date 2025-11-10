"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { companyData } from "@/lib/data"
import { Phone, Mail, MapPin } from "lucide-react"

export function ContactSection() {
  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">
            Parlons de Votre Projet
          </h2>
          <p className="text-base sm:text-lg text-gray-300">Contactez-nous pour discuter de vos besoins industriels</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-white/10 backdrop-blur rounded-xl p-6 sm:p-8 border border-white/20 hover:bg-white/15 transition-colors duration-300"
          >
            <Phone className="w-10 h-10 sm:w-12 sm:h-12 text-blue-400 mb-4" />
            <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Téléphone</h3>
            <p className="text-sm sm:text-base text-gray-300">{companyData.company.contact.phone}</p>
            <p className="text-xs sm:text-sm text-gray-400">Fax: {companyData.company.contact.fax}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="bg-white/10 backdrop-blur rounded-xl p-6 sm:p-8 border border-white/20 hover:bg-white/15 transition-colors duration-300"
          >
            <Mail className="w-10 h-10 sm:w-12 sm:h-12 text-blue-400 mb-4" />
            <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Email</h3>
            <p className="text-sm sm:text-base text-gray-300">{companyData.company.contact.email}</p>
            <p className="text-xs sm:text-sm text-gray-400">{companyData.company.contact.website}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-white/10 backdrop-blur rounded-xl p-6 sm:p-8 border border-white/20 hover:bg-white/15 transition-colors duration-300 sm:col-span-2 lg:col-span-1"
          >
            <MapPin className="w-10 h-10 sm:w-12 sm:h-12 text-blue-400 mb-4" />
            <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Adresse</h3>
            <p className="text-xs sm:text-sm text-gray-300">{companyData.company.contact.address}</p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <Link href="/quote">
            <button className="px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900 text-white rounded-lg font-semibold text-base sm:text-lg transition-all duration-200 active:scale-95 w-full sm:w-auto">
              Demander un Devis Gratuit
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
