import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card } from '@/Components/Card';

export default function Dashboard() {
    // Ces données devraient normalement venir de votre backend
    const stats = [
        {
            title: 'Demandes en cours',
            value: '24',
            icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
            color: 'bg-blue-500'
        },
        {
            title: 'Demandes validées',
            value: '156',
            icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
            color: 'bg-green-500'
        },
        {
            title: 'Demandes rejetées',
            value: '12',
            icon: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
            color: 'bg-red-500'
        },
        // {
        //     title: 'Utilisateurs actifs',
        //     value: '45',
        //     icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
        //     color: 'bg-purple-500'
        // }
    ];

    return (
        <AdminLayout header="Tableau de bord">
            <Head title="Tableau de bord" />

            <div className="flex justify-around gap-3">
                {stats.map((stat) => (
                    <Card key={stat.title} className="overflow-hidden">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className={`flex-shrink-0 rounded-md p-3 ${stat.color}`}>
                                    <svg
                                        className="h-6 w-6 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d={stat.icon}
                                        />
                                    </svg>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="truncate text-sm font-medium text-gray-500">
                                            {stat.title}
                                        </dt>
                                        <dd className="text-3xl font-semibold text-gray-900">
                                            {stat.value}
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
                <Card>
                    <div className="p-6">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">
                            Dernières demandes
                        </h3>
                        <div className="mt-4">
                            {/* Ici, vous pouvez ajouter une liste des dernières demandes */}
                            <p className="text-gray-500">Aucune demande récente</p>
                        </div>
                    </div>
                </Card>

                <Card>
                    <div className="p-6">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">
                            Activité récente
                        </h3>
                        <div className="mt-4">
                            {/* Ici, vous pouvez ajouter un flux d'activité */}
                            <p className="text-gray-500">Aucune activité récente</p>
                        </div>
                    </div>
                </Card>
            </div>
        </AdminLayout>
    );
}
