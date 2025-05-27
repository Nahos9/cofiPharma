import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Link } from '@inertiajs/react';
import {
    Users,
    FileText,
    ShoppingCart,
    DollarSign,
    Activity,
    TrendingUp
} from 'lucide-react';

export default function Dashboard({ auth, stats, recentUsers, recentDemandes }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Tableau de Bord Administrateur</h2>}
        >
            <Head title="Tableau de Bord Administrateur" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Statistiques */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Utilisateurs
                                </CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats?.users?.total}</div>
                                <p className="text-xs text-muted-foreground">
                                    +{stats?.users?.growth}% depuis le mois dernier
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Demandes
                                </CardTitle>
                                <FileText className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats?.demandes?.total}</div>
                                <p className="text-xs text-muted-foreground">
                                    +{stats?.demandes?.growth}% depuis le mois dernier
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Transactions
                                </CardTitle>
                                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats?.transactions?.total}</div>
                                <p className="text-xs text-muted-foreground">
                                    +{stats?.transactions?.growth}% depuis le mois dernier
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Revenus
                                </CardTitle>
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                    <div className="text-2xl font-bold">
                                    {stats?.revenue?.total ? `$${stats?.revenue?.total}` : '0'}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    +{stats?.revenue?.growth}% depuis le mois dernier
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Actions rapides */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        <Card>
                            <CardHeader>
                                <CardTitle>Actions Rapides</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-4">
                                    <Link href={route('admin.users.index')}>
                                        <Button className="w-full">
                                            <Users className="mr-2 h-4 w-4" />
                                            Nouvel Utilisateur
                                        </Button>
                                    </Link>
                                    <Link href={route('demande.index')}>
                                        <Button className="w-full">
                                            <FileText className="mr-2 h-4 w-4" />
                                            Voir les Demandes
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Activité Récente</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {recentDemandes?.map((demande) => (
                                        <div key={demande.id} className="flex items-center">
                                            <Activity className="mr-2 h-4 w-4" />
                                            <div>
                                                <p className="text-sm font-medium">
                                                    Nouvelle demande de {demande.user.name}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {new Date(demande.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Liste des derniers utilisateurs */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Derniers Utilisateurs</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentUsers?.map((user) => (
                                    <div key={user.id} className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium">{user.name}</p>
                                            <p className="text-xs text-muted-foreground">{user.email}</p>
                                        </div>
                                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-primary/10 text-primary">
                                            {user.role}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
