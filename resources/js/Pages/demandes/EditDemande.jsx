import AdminLayout from '@/Layouts/AdminLayout'
import { Head, Link } from '@inertiajs/react'

import React from 'react'

const EditDemande = ({demande}) => {
    const getStatusColor = (status) => {
        switch (status) {
            case 'en attente':
                return 'bg-yellow-100 text-yellow-800'
            case 'accepte':
                return 'bg-green-100 text-green-800'
            case 'rejected':
                return 'bg-red-100 text-red-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    const getStatusText = (status) => {
        switch (status) {
            case 'en attente':
                return 'En attente'
            case 'accepte':
                return 'Approuvé'
            case 'rejected':
                return 'Rejeté'
            default:
                return status
        }
    }
  return (
    <AdminLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Détails de la demande # {demande.first_name}  {demande.last_name}
                    </h2>
                    <div className="flex space-x-4">
                        <Link
                            href={route('demandes.edit', demande.id)}
                            className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            Modifier
                        </Link>
                        <Link
                            href={route('demande.all')}
                            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            Retour à la liste
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`Détails de la demande #${demande.id}`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                    <h3 className="text-lg font-medium leading-6 text-gray-900">Informations générales</h3>
                                    <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                                        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                                            <dt className="truncate text-sm font-medium text-gray-500">N° demande</dt>
                                            <dd className="mt-1 text-3xl font-semibold text-gray-900">{demande.id}</dd>
                                        </div>
                                        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                                            <dt className="truncate text-sm font-medium text-gray-500">Statut</dt>
                                            <dd className="mt-1">
                                                <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(demande.status)}`}>
                                                    {getStatusText(demande.status)}
                                                </span>
                                            </dd>
                                        </div>
                                    </dl>
                                </div>

                                <div>
                                    <h3 className="text-lg font-medium leading-6 text-gray-900">Informations du demandeur</h3>
                                    <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                                        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                                            <dt className="truncate text-sm font-medium text-gray-500">Nom</dt>
                                            <dd className="mt-1 text-xl font-semibold text-gray-900">{demande.first_name}</dd>
                                        </div>
                                        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                                            <dt className="truncate text-sm font-medium text-gray-500">Email</dt>
                                            <dd className="mt-1  font-semibold text-gray-900">{demande.email}</dd>
                                        </div>
                                    </dl>
                                </div>
                            </div>

                            <div className="mt-8">
                                <h3 className="text-lg font-medium leading-6 text-gray-900">Détails de la demande</h3>
                                <div className="mt-5">
                                    <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                                        <dt className="text-sm font-medium text-gray-500">Montant demande</dt>
                                        <dd className="mt-1 text-lg text-gray-900">{demande.montant} FCFA</dd>
                                    </div>
                                </div>
                                {/* <div className="mt-5">
                                    <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                                        <dt className="text-sm font-medium text-gray-500">Description</dt>
                                        <dd className="mt-1 text-lg text-gray-900 whitespace-pre-wrap">{demande.description}</dd>
                                    </div>
                                </div> */}
                            </div>

                            <div className="mt-8">
                                <h3 className="text-lg font-medium leading-6 text-gray-900">Dates</h3>
                                <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                                    <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                                        <dt className="truncate text-sm font-medium text-gray-500">Date de création</dt>
                                        <dd className="mt-1 text-lg text-gray-900">
                                            {new Date(demande.created_at).toLocaleDateString('fr-FR', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </dd>
                                    </div>
                                    <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                                        <dt className="truncate text-sm font-medium text-gray-500">Dernière modification</dt>
                                        <dd className="mt-1 text-lg text-gray-900">
                                            {new Date(demande.updated_at).toLocaleDateString('fr-FR', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </dd>
                                    </div>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
  )
}

export default EditDemande