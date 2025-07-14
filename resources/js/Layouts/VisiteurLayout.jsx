import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import { Head } from '@inertiajs/react';

export default function VisiteurLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { url } = usePage();

    const navigation = [
        {
            name: 'Tableau de bord',
            href: route('visiteur.dashboard'),
            icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
            active: route().current('visiteur.dashboard')
        },
        {
            name: 'Cofi\'Pharma',
            href: route('visiteur.demandes.all'),
            icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
            active: route().current('visiteur.demandes.all')
        },
        {
            name: 'Avances sur salaire',
            href: route('visiteur.av_salaire.all'),
            icon: 'M12 4v16m8-8H4',
            active: route().current('visiteur.av_salaire.all')
        }
    ];

    return (
        <div className="min-h-screen bg-gray-100">
            <Head title="Administration" />

            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 w-64 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} bg-red-500 transition duration-300 ease-in-out lg:translate-x-0`}>
                <div className="flex h-16 items-center justify-around border-b border-gray-700">
                    <Link href="/visiteur/dashboard" className="flex items-center">
                        <img src="/img/cofina.png" alt="" className='w-1/4' />
                        <span className="ml-3 text-white text-lg font-bold">CofiExpress</span>
                    </Link>
                </div>
                <nav className="mt-5 space-y-1 px-2">
                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium transition-colors duration-200 ${
                                item.active
                                    ? 'bg-red-600 text-white'
                                    : 'text-white hover:bg-red-600'
                            }`}
                        >
                            <svg
                                className={`mr-3 h-6 w-6 flex-shrink-0 ${
                                    item.active
                                        ? 'text-white'
                                        : 'text-white group-hover:text-white'
                                }`}
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d={item.icon}
                                />
                            </svg>
                            {item.name}
                        </Link>
                    ))}
                </nav>
            </div>

            {/* Main content */}
            <div className="lg:pl-64">
                <div className="sticky top-0 z-40 flex h-16 flex-shrink-0 bg-white shadow">
                    <button
                        type="button"
                        className="border-r border-gray-200 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 lg:hidden"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                    >
                        <span className="sr-only">Ouvrir le menu</span>
                        <svg
                            className="h-6 w-6"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>
                    </button>
                    <div className="flex flex-1 justify-end px-4">
                        <div className="ml-4 flex items-center md:ml-6">
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <span className="inline-flex rounded-md">
                                        <button
                                            type="button"
                                            className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none"
                                        >
                                            {user?.name}
                                            <svg
                                                className="-me-0.5 ms-2 h-4 w-4"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </button>
                                    </span>
                                </Dropdown.Trigger>

                                <Dropdown.Content>
                                    <Dropdown.Link href={route('profile.edit')}>
                                        Profil
                                    </Dropdown.Link>
                                    <Dropdown.Link
                                        href={route('logout')}
                                        method="post"
                                        as="button"
                                    >
                                        Déconnexion
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>
                    </div>
                </div>

                <main className="py-6">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        {header && (
                            <div className="mb-1">
                                <h1 className="text-2xl font-semibold text-gray-900">
                                    {header}
                                </h1>
                            </div>
                        )}
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
