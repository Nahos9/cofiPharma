import AppLayout from '../Layouts/AppLayout';

export default function Home({ auth }) {
    return (
        <AppLayout user={auth.user}>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h1 className="text-2xl font-bold mb-4">Bienvenue sur Cofipharame</h1>
                            {auth.user ? (
                                <div>
                                    <p>Bonjour {auth.user.name} !</p>
                                    {auth.user?.hasRole('responsable_ritel') && (
                                        <div className="mt-4">
                                            <h2 className="text-xl font-semibold mb-2">Fonctionnalités Responsable Retail :</h2>
                                            <ul className="list-disc pl-5">
                                                <li>Gestion des stocks</li>
                                                <li>Suivi des ventes</li>
                                                <li>Gestion des employés</li>
                                            </ul>
                                        </div>
                                    )}
                                    {auth.user.isCassiere() && (
                                        <div className="mt-4">
                                            <h2 className="text-xl font-semibold mb-2">Fonctionnalités Caissier :</h2>
                                            <ul className="list-disc pl-5">
                                                <li>Encaissement des ventes</li>
                                                <li>Gestion des tickets</li>
                                                <li>Retour produits</li>
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <p>Veuillez vous connecter pour accéder aux fonctionnalités.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
