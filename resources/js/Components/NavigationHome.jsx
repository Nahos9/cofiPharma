import React, { useState } from 'react'
import { BriefcaseMedical, Menu, X } from 'lucide-react';
import { Link, usePage } from '@inertiajs/react';
import { Button } from './ui/button';


const NavigationHome = () => {
  const { url } = usePage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className='flex flex-col sm:flex-row justify-between items-center border-b border-black p-2'>
        <div className="flex justify-between w-full sm:w-auto items-center">
            <div className="flex gap-2 items-center">
                <BriefcaseMedical size={30} />
                <p className='text-xl sm:text-2xl font-bold'>Cofi<span className='text-xl sm:text-2xl text-red-600 font-bold'>Express</span></p>
            </div>
            <button
                className="sm:hidden p-2"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
        </div>

        <div className={`${isMenuOpen ? 'block' : 'hidden'} sm:block w-full sm:w-auto mt-4 sm:mt-0`}>
            <nav className='flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-7'>
                <Link
                    href="/"
                    className={`text-lg font-medium transition-colors duration-200 p-2 rounded-sm ${
                        url === '/'
                            ? 'text-white bg-red-500'
                            : 'text-black hover:text-white hover:bg-red-500'
                    }`}
                >
                    Accueil
                </Link>
                <Link
                    href="/demandes"
                    className={`text-lg font-medium transition-colors duration-200 p-2 rounded-sm ${
                        url === '/demandes'
                            ? 'text-white bg-red-500'
                            : 'text-black hover:text-white hover:bg-red-500'
                    }`}
                >
                    Demande cofi'Pharma
                </Link>
                <Link
                    href="/av_salaire"
                    className={`text-lg font-medium transition-colors duration-200 p-2 rounded-sm ${
                        url === '/av_salaire'
                            ? 'text-white bg-red-500'
                            : 'text-black hover:text-white hover:bg-red-500'
                    }`}
                >
                    Demande avance sur salaire
                </Link>
                {/* <Link
                    href="/contact"
                    className={`text-lg font-medium transition-colors duration-200 p-2 rounded-sm ${
                        url === '/contact'
                            ? 'text-white bg-red-500'
                            : 'text-black hover:text-white hover:bg-red-500'
                    }`}
                >
                    Contact
                </Link> */}
            </nav>
        </div>

        <div className={`${isMenuOpen ? 'block' : 'hidden'} sm:block w-full sm:w-auto mt-4 sm:mt-0`}>
            <Button variant="outline" className="w-full sm:w-auto hover:bg-blue-600 hover:text-white transition-colors duration-200">
                <Link href="/login" className="w-full text-center">
                    Connexion
                </Link>
            </Button>
        </div>
    </div>
  )
}

export default NavigationHome