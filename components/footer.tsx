"use client"

export function Footer() {
  return (
    <footer className="bg-slate-900 text-gray-300 py-12 sm:py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="text-white font-bold text-lg mb-4">OUSAMO</h3>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
              Atelier métallurgique spécialisé en construction métallique et fabrication d'équipements industriels.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm sm:text-base">Services</h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <a
                  href="#"
                  className="hover:text-blue-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded px-1"
                >
                  Construction métallique
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-blue-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded px-1"
                >
                  Travaux industriels
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-blue-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded px-1"
                >
                  Décoration métallique
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm sm:text-base">Entreprise</h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <a
                  href="#"
                  className="hover:text-blue-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded px-1"
                >
                  À propos
                </a>
              </li>
              <li>
                <a
                  href="/realisations"
                  className="hover:text-blue-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded px-1"
                >
                  Nos réalisations
                </a>
              </li>
              <li>
                <a
                  href="/quote"
                  className="hover:text-blue-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded px-1"
                >
                  Demander un Devis
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-blue-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded px-1"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm sm:text-base">Informations</h4>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-400">
              <li>Créée en 2014</li>
              <li>SARL au capital de 2M Dhs</li>
              <li>Basée au Maroc</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 pt-8 text-center text-xs sm:text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} OUSAMO. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  )
}
