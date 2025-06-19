import AdminLayout from '@/Layouts/AdminLayout'
import { Head, router } from '@inertiajs/react'
import { useState, useMemo } from 'react'
import { Trash, Eye } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import ResponsableLayout from '@/Layouts/ResponsableLayout';
import VisiteurLayout from '@/Layouts/VisiteurLayout';

const AllDemandes = ({ demandes }) => {
    const [selectedItems, setSelectedItems] = useState([])
    const [selectAll, setSelectAll] = useState(false)
    const [search, setSearch] = useState('')
    const [status, setStatus] = useState('')
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [demandeToDelete, setDemandeToDelete] = useState(null)
    console.log(demandes.data);
    const filteredDemandes = useMemo(() => {
        return demandes.data.filter(demande => {
            const matchesSearch = search === '' ||
                (demande.first_name && demande.first_name.toLowerCase().includes(search.toLowerCase())) ||
                (demande.last_name && demande.last_name.toLowerCase().includes(search.toLowerCase())) ||
                (demande.email && demande.email.toLowerCase().includes(search.toLowerCase())) ||
                (demande.montant && demande.montant.toString().includes(search)) ||
                (demande.type && demande.type.toLowerCase().includes(search.toLowerCase()));

            const matchesStatus = status === '' || demande.status === status;

            return matchesSearch && matchesStatus;
        });
    }, [demandes.data, search, status]);

    const handleSelectAll = (e) => {
        const checked = e.target.checked
        setSelectAll(checked)
        setSelectedItems(checked ? filteredDemandes.map(demande => demande.id) : [])
    }

    const handleSelectItem = (id) => {
        setSelectedItems(prev => {
            if (prev.includes(id)) {
                return prev.filter(itemId => itemId !== id)
            } else {
                return [...prev, id]
            }
        })
    }

    // Configuration globale d'Inertia pour gérer les erreurs de session
    router.on('error', (errors) => {
        if (errors.status === 419) {
            window.location.href = route('login');
        }
    });

    const handleDeleteSelected = () => {
        if (confirm('Êtes-vous sûr de vouloir supprimer les demandes sélectionnées ?')) {
            router.post(route('demandes.delete-multiple'), {
                ids: selectedItems,
                is_deleted: true
            }, {
                onSuccess: () => {
                    setSelectedItems([])
                    setSelectAll(false)
                    toast.success('Les demandes ont été supprimées avec succès', {
                        duration: 4000,
                        position: 'top-right',
                        style: {
                            background: '#10B981',
                            color: '#fff',
                        },
                    })
                },
                onError: (errors) => {
                    if (errors.status === 419) {
                        window.location.href = route('login');
                    } else {
                        toast.error('Une erreur est survenue lors de la suppression', {
                            duration: 4000,
                            position: 'top-right',
                            style: {
                                background: '#EF4444',
                                color: '#fff',
                            },
                        })
                    }
                }
            })
        }
    }

    const handleDeleteClick = (demande) => {
        setDemandeToDelete(demande)
        setShowDeleteModal(true)
    }

    const handleConfirmDelete = () => {
        if (demandeToDelete) {
            router.post(route('demandes.destroy', demandeToDelete.id), {
                _method: 'PUT',
                is_deleted: true
            }, {
                onSuccess: () => {
                    setShowDeleteModal(false)
                    setDemandeToDelete(null)
                    toast.success('La demande a été supprimée avec succès', {
                        duration: 4000,
                        position: 'top-right',
                        style: {
                            background: '#10B981',
                            color: '#fff',
                        },
                    })
                },
                onError: (errors) => {
                    if (errors.status === 419) {
                        window.location.href = route('login');
                    } else {
                        toast.error('Une erreur est survenue lors de la suppression', {
                            duration: 4000,
                            position: 'top-right',
                            style: {
                                background: '#EF4444',
                                color: '#fff',
                            },
                        })
                    }
                }
            })
        }
    }


  return (
    <VisiteurLayout
        header={
                <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Gestion des demandes
            </h2>
                    {selectedItems.length > 0 && (
                        <button
                            onClick={handleDeleteSelected}
                            className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500"
                        >
                            Supprimer ({selectedItems.length})
                        </button>
                    )}
                </div>
            }
        >
            <Head title="Gestion des demandes" />
            <Toaster />

            {/* Modal de confirmation de suppression */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>

                        <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">&#8203;</span>

                        <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                        <Trash className="h-6 w-6 text-red-600" />
                                    </div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <h3 className="text-lg font-medium leading-6 text-gray-900">
                                            Confirmer la suppression
                                        </h3>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">
                                                Êtes-vous sûr de vouloir supprimer la demande de {demandeToDelete?.first_name} {demandeToDelete?.last_name} ?
                                                Cette action est irréversible.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                <button
                                    type="button"
                                    onClick={handleConfirmDelete}
                                    className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Supprimer
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowDeleteModal(false)
                                        setDemandeToDelete(null)
                                    }}
                                    className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Annuler
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        <div className="py-12">
            <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* Barre de recherche et filtres */}
                            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="search" className="sr-only">Rechercher</label>
                                    <div className="relative rounded-md shadow-sm">
                                        <input
                                            type="text"
                                            name="search"
                                            id="search"
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            className="block w-full rounded-md border-gray-300 pr-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            placeholder="Rechercher par nom, email, montant..."
                                        />
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="status" className="sr-only">Statut</label>
                                    <select
                                        id="status"
                                        name="status"
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                        className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    >
                                        <option value="">Tous les statuts</option>
                                        <option value="en attente">En attente</option>
                                        <option value="accepte">Approuvé</option>
                                        <option value="rejete">Rejeté</option>
                                        <option value="debloque">Débloqué</option>
                                    </select>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="relative w-12 px-6 sm:w-16 sm:px-8">
                                                <input
                                                    type="checkbox"
                                                    className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                                    checked={selectAll}
                                                    onChange={handleSelectAll}
                                                />
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                N°
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Nom du demandeur
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Email
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Téléphone
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Montant
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Statut
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Date de demande
                                            </th>
                                            <th scope="col" className="relative px-6 py-3">
                                                <span className="sr-only">Actions</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {filteredDemandes.map((demande) => (
                                            <tr key={demande.id} className={selectedItems.includes(demande.id) ? 'bg-gray-50' : ''}>
                                                <td className="relative w-12 px-6 sm:w-16 sm:px-8">
                                                    <input
                                                        type="checkbox"
                                                        className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                                        checked={selectedItems.includes(demande.id)}
                                                        onChange={() => handleSelectItem(demande.id)}
                                                    />
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                    {demande.id}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                                                    {demande.first_name} {demande.last_name}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                    {demande.email}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                    {demande?.phone}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                    {demande.montant} FCFA
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm">
                                                    <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                                                        // Styles pour les différents statuts
                                                        demande.status === 'en attente' ? 'bg-yellow-100 text-yellow-800' :
                                                        demande.status === 'accepte' && demande.user_validateur_level === "responsable_ritel" ? 'bg-green-100 text-green-800' :
                                                        demande.status === 'accepte' && demande.user_validateur_level === "operation" ? 'bg-green-100 text-green-800' :
                                                        demande.status === "debloque" ? 'bg-purple-100 text-purple-800' :
                                                        demande.status === "rejete" ? 'bg-red-100 text-red-800' :
                                                        'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        {(() => {
                                                            // Logique pour le texte des statuts
                                                            if(demande.status === "en attente"){
                                                                if(demande.user_validateur_level === "responsable_ritel"){
                                                                    return 'En attente (responsable Ritel)';
                                                                }
                                                                if(demande.user_validateur_level === "charge client"){
                                                                    return 'En attente (Charge client)';
                                                                }
                                                            }
                                                            if (demande.status === 'accepte') {
                                                                if(demande.user_validateur_level === "responsable_ritel"){
                                                                    return 'En attente (responsable Ritel)';
                                                                }
                                                                if(demande.user_validateur_level === "charge client"){
                                                                    return 'En attente (Charge client)';
                                                                }
                                                            }
                                                            if (demande.status === 'accepte') {
                                                                if (demande.user_validateur_level === "responsable_ritel") {
                                                                    return 'En attente (responsable ritel)';
                                                                }
                                                                if (demande.user_validateur_level === "operation") {
                                                                    return 'En attente (Operation)';
                                                                }
                                                            }
                                                            if (demande.status === "debloque") {
                                                                return 'Débloqué';
                                                            }
                                                            if (demande.status === "rejete") {
                                                                if (demande.user_validateur_level === "operation") {
                                                                    return 'Rejeté par Opération';
                                                                }
                                                                if (demande.user_validateur_level === "responsable_ritel") {
                                                                    return 'Rejeté par Ritel';
                                                                }
                                                                if (demande.user_validateur_level === "charge client") {
                                                                    return 'Rejeté (charge client)';
                                                                }
                                                                return 'Rejeté';
                                                            }
                                                            return 'Statut inconnu';
                                                        })()}
                                                    </span>
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                    {new Date(demande.created_at).toLocaleDateString('fr-FR')}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium flex gap-1 items-center">
                                                    <a
                                                        href={route('visiteur.demandes.edit', demande.id)}
                                                        className="text-indigo-600 hover:text-indigo-900"
                                                        title='details'
                                                    >
                                                        <Eye />
                                                    </a>
                                                   {/* {demande?.status == "en attente" &&  ( <button
                                                        onClick={() => handleDeleteClick(demande)}
                                                        className="text-red-600 hover:text-red-900"
                                                        title='Supprimer'
                                                    >
                                                        <Trash />
                                                    </button>)} */}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {demandes.links.length > 3 && (
                                <div className="mt-4 flex items-center justify-between">
                                    <div className="flex-1 flex justify-between sm:hidden">
                                        {demandes.prev_page_url && (
                                            <a
                                                href={demandes.prev_page_url}
                                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                            >
                                                Précédent
                                            </a>
                                        )}
                                        {demandes.next_page_url && (
                                            <a
                                                href={demandes.next_page_url}
                                                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                            >
                                                Suivant
                                            </a>
                                        )}
                                    </div>
                                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                        <div>
                                            <p className="text-sm text-gray-700">
                                                Affichage de <span className="font-medium">{demandes.from}</span> à{' '}
                                                <span className="font-medium">{demandes.to}</span> sur{' '}
                                                <span className="font-medium">{demandes.total}</span> résultats
                                            </p>
                                        </div>
                                        <div>
                                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                                {demandes.links.map((link, index) => (
                                                    <a
                                                        key={index}
                                                        href={link.url}
                                                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                            link.active
                                                                ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                                                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                        }`}
                                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                                    />
                                                ))}
                                            </nav>
                                        </div>
                                    </div>
                                </div>
                            )}
                    </div>
                </div>
            </div>
        </div>
</VisiteurLayout>
  )
}

export default AllDemandes
