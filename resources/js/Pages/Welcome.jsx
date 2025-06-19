import FooterHome from '@/Components/FooterHome';
import NavigationHome from '@/Components/NavigationHome';
import { Button } from '@/Components/ui/button';
import { Head, Link } from '@inertiajs/react';
import { ArrowDownToDot } from 'lucide-react';
import { ToastContainer } from 'react-toastify';


export default function Welcome({ auth, laravelVersion, phpVersion }) {

    const handleImageError = () => {
        document
            .getElementById('screenshot-container')
            ?.classList.add('!hidden');
        document.getElementById('docs-card')?.classList.add('!row-span-1');
        document
            .getElementById('docs-card-content')
            ?.classList.add('!flex-row');
        document.getElementById('background')?.classList.add('!hidden');
    };

    return (
        <>
            <Head title="Bienvenue" />
            <NavigationHome />
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            <div className="bg-blue-500 p-4 sm:p-6 text-center text-white">
                <p className='text-3xl sm:text-5xl font-bold py-3'>
                    CofiExpress <br className="hidden sm:block" />
                </p>
                <p className='text-base sm:text-lg py-2 max-w-2xl mx-auto'>
                Parce que vos besoins ne peuvent pas attendre.
                Accédez à un financement immédiat pour vos médicaments ou demandez une avance sur salaire en toute simplicité.
                </p>
                {/* <Button variant="outline" className="mt-4 bg-white text-blue-500 hover:bg-blue-100 transition-colors duration-200">
                    <Link className='flex items-center justify-center gap-2' href="/demandes">
                        <ArrowDownToDot className="w-5 h-5" />
                        <span>Demander un financement</span>
                    </Link>
                </Button> */}
            </div>

            {/* Section Avantages */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
                <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">Nos Avantages</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold mb-3">Rapidité</h3>
                        <p className="text-gray-600">Traitement de votre demande sous 24h</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold mb-3">Simplicité</h3>
                        <p className="text-gray-600">Processus de demande en ligne simple et rapide</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold mb-3">Sécurité</h3>
                        <p className="text-gray-600">Données sécurisées et confidentialité garantie</p>
                    </div>
                </div>
            </div>

            {/* Section Comment ça marche */}
            <div className="bg-gray-50 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">Comment ça marche ?</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-bold text-blue-500">1</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Faites votre demande</h3>
                            <p className="text-gray-600">Remplissez notre formulaire en ligne</p>
                        </div>
                        <div className="text-center">
                            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-bold text-blue-500">2</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Traitement</h3>
                            <p className="text-gray-600">Notre équipe examine votre demande</p>
                        </div>
                        <div className="text-center">
                            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-bold text-blue-500">3</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Financement</h3>
                            <p className="text-gray-600">Obtenez votre financement rapidement</p>
                        </div>
                    </div>
                </div>
            </div>
            <FooterHome />
        </>
    );
}
