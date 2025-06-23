import { Link } from '@inertiajs/react';
import { Toaster } from 'react-hot-toast';

export default function AppLayout({ children, user }) {
    return (
        <div className="min-h-screen bg-gray-100">
             <Toaster position="top-right" />
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center">
                                <Link href="/" className="text-xl font-bold">
                                    CofiExpress
                                </Link>
                            </div>
                        </div>
                        <div className="flex items-center">
                            {user ? (
                                <div className="flex items-center space-x-4">
                                    <span className="text-gray-700">{user.name}</span>
                                    <Link
                                        href={route('logout')}
                                        method="post"
                                        className="text-gray-700 hover:text-gray-900"
                                    >
                                        Déconnexion
                                    </Link>
                                </div>
                            ) : (
                                <Link
                                    href={route('login')}
                                    className="text-gray-700 hover:text-gray-900"
                                >
                                    Connexion
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            <main className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
