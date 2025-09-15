import { Link } from '@inertiajs/react'
import { Facebook, Instagram, Twitter, Mail, Phone } from 'lucide-react'

export default function FooterHome() {
    return (
        <footer className="bg-gray-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Section À propos */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">À propos de CofiExpress</h3>
                        <p className="text-gray-300">
                        CofiExpress est une application pour financer vos médicaments ou demander une avance sur salaire, rapidement et en toute simplicité.
                        </p>
                    </div>

                    {/* Section Liens rapides */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">Liens rapides</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                                    Accueil
                                </Link>
                            </li>
                            <li>
                                <Link href="/demandes" className="text-gray-300 hover:text-white transition-colors">
                                    Demande cofi'Pharma
                                </Link>
                            </li>
                            <li>
                                <Link href="/demandeAvSalaire" className="text-gray-300 hover:text-white transition-colors">
                                    Demande avance sur salaire
                                </Link>
                            </li>
                            {/* <li>
                                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
                                    Contact
                                </Link>
                            </li> */}
                        </ul>
                    </div>

                    {/* Section Contact */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">Contactez-nous</h3>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-gray-300">
                                <Mail className="w-5 h-5" />
                                <a href="mailto:service.client.ga@cofinacorp.com" className="hover:text-white transition-colors">
                                    service.client.ga@cofinacorp.com
                                </a>
                            </div>
                            <div className="flex items-center gap-2 text-gray-300">
                                <Phone className="w-5 h-5" />
                                <a href="tel:+1234567890" className="hover:text-white transition-colors">
                                    +241 65 99 01 46
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section Réseaux sociaux */}
                <div className="mt-8 pt-8 border-t border-gray-800">
                    <div className="flex justify-center space-x-6">
                        <a href="#" className="text-gray-300 hover:text-white transition-colors">
                            <Facebook className="w-6 h-6" />
                        </a>
                        <a href="#" className="text-gray-300 hover:text-white transition-colors">
                            <Twitter className="w-6 h-6" />
                        </a>
                        <a href="#" className="text-gray-300 hover:text-white transition-colors">
                            <Instagram className="w-6 h-6" />
                        </a>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-8 text-center text-gray-400 text-sm">
                    <p>&copy; {new Date().getFullYear()} CofiPharma. Tous droits réservés.</p>
                </div>
            </div>
        </footer>
    )
}
