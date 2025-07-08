import ResponsableLayout from '@/Layouts/ResponsableLayout'
import React, { useState } from 'react'
import { Head, Link, router } from '@inertiajs/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card'
import { Input } from '@/Components/ui/input'
import { Button } from '@/Components/ui/button'
import { Badge } from '@/Components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table'
import { Search, Filter, Download, Eye, CheckCircle, XCircle, Clock } from 'lucide-react'

const AllAvSalaire = ({ avSalaires, filters }) => {
    const [search, setSearch] = useState(filters?.search || '')
    const [status, setStatus] = useState(filters?.status || '')

    const handleSearch = (value) => {
        setSearch(value)
        router.get(route('responsable_ritel.av_salaire.all'), {
            ...filters,
            search: value,
            page: 1
        }, { preserveState: true })
    }

    const handleStatusFilter = (value) => {
        setStatus(value)
        router.get(route('responsable_ritel.av_salaire.all'), {
            ...filters,
            status: value,
            page: 1
        }, { preserveState: true })
    }

    const getStatusBadge = (status) => {
        const statusConfig = {
            'en attente': { variant: 'secondary', icon: Clock, text: 'En attente' },
            'acceptée': { variant: 'default', icon: CheckCircle, text: 'Acceptée' },
            'rejetée': { variant: 'destructive', icon: XCircle, text: 'Rejetée' },
            'débloquée': { variant: 'default', icon: CheckCircle, text: 'Débloquée' }
        }

        const config = statusConfig[status] || statusConfig['en attente']
        const Icon = config.icon

        return (
            <Badge variant={config.variant} className="flex items-center gap-1">
                <Icon className="w-3 h-3" />
                {config.text}
            </Badge>
        )
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const formatMontant = (montant) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'XOF'
        }).format(montant)
    }

    return (
        <ResponsableLayout>
            <Head title="Gestion des avances sur salaire" />

            <div className="space-y-6">
                {/* En-tête */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Gestion des avances sur salaire</h1>
                        <p className="text-gray-600 mt-1">
                            Gérez toutes les demandes d'avances sur salaire des employés
                        </p>
                    </div>
                    <Link href={route('av_salaire')}>
                        <Button className="bg-blue-600 hover:bg-blue-700">
                            Nouvelle demande
                        </Button>
                    </Link>
                </div>

                {/* Filtres et recherche */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Filter className="w-5 h-5" />
                            Filtres et recherche
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    placeholder="Rechercher..."
                                    value={search}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    className="pl-10"
                                />
                            </div>

                            <select
                                value={status}
                                onChange={(e) => handleStatusFilter(e.target.value)}
                                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <option value="">Tous les statuts</option>
                                <option value="en attente">En attente</option>
                                <option value="acceptée">Acceptée</option>
                                <option value="rejetée">Rejetée</option>
                                <option value="débloquée">Débloquée</option>
                            </select>

                            <Button
                                variant="outline"
                                onClick={() => {
                                    setSearch('')
                                    setStatus('')
                                    router.get(route('responsable_ritel.av_salaire.all'))
                                }}
                            >
                                Réinitialiser
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Tableau des avances */}
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Avances sur salaire ({avSalaires?.total || 0})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nom et prénom </TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Numéro de téléphone</TableHead>
                                        <TableHead>Numéro de compte bancaire</TableHead>
                                        <TableHead>Montant</TableHead>
                                        <TableHead>Statut</TableHead>
                                        <TableHead>Date de demande</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {!avSalaires?.data || avSalaires.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                                                Aucune avance sur salaire trouvée
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        avSalaires.data.map((avSalaire) => (
                                            <TableRow key={avSalaire.id} className="hover:bg-gray-50">
                                                <TableCell>
                                                    <div className="font-medium">
                                                        {avSalaire.nom} {avSalaire.prenom}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="space-y-1">
                                                        <div className="text-sm text-gray-600">
                                                            {avSalaire.email}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="text-sm text-gray-600">
                                                        {avSalaire.phone}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                                                        {avSalaire.numero_compte}
                                                    </code>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="font-semibold text-green-600">
                                                        {formatMontant(avSalaire.montant)}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    {getStatusBadge(avSalaire.status)}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="text-sm text-gray-600">
                                                        {formatDate(avSalaire.created_at)}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Link
                                                            variant="outline"
                                                            size="sm"
                                                            href={route('responsable_ritel.av_salaire.edit', avSalaire.id)}
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </Link>

                                                        {avSalaire.piece_joints_av && avSalaire.piece_joints_av.length > 0 && (
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => {
                                                                    console.log('Télécharger pièces jointes:', avSalaire.piece_joints_av)
                                                                }}
                                                            >
                                                                <Download className="w-4 h-4" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Pagination */}
                        {avSalaires?.last_page > 1 && (
                            <div className="flex items-center justify-between mt-6">
                                <div className="text-sm text-gray-700">
                                    Affichage de {avSalaires.from} à {avSalaires.to} sur {avSalaires.total} résultats
                                </div>
                                <div className="flex items-center gap-2">
                                    {avSalaires.links.map((link, index) => (
                                        <Button
                                            key={index}
                                            variant={link.active ? "default" : "outline"}
                                            size="sm"
                                            disabled={!link.url}
                                            onClick={() => {
                                                if (link.url) {
                                                    router.get(link.url, {}, { preserveState: true })
                                                }
                                            }}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </ResponsableLayout>
    )
}

export default AllAvSalaire