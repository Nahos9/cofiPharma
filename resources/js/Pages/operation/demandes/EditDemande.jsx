import AdminLayout from '@/Layouts/AdminLayout'
import { Head, Link, router } from '@inertiajs/react'
import { Trash,Check,OctagonX, Download, FileText, Image } from 'lucide-react'
import { toast } from 'react-hot-toast'
import React, { useState } from 'react'
import { Toaster } from 'react-hot-toast'
import ResponsableLayout from '@/Layouts/ResponsableLayout'
import OperationLayout from '@/Layouts/OperationLayout'

const EditDemande = ({demande}) => {
    const [showValidateModal, setShowValidateModal] = useState(false)
    const [showRejectModal, setShowRejectModal] = useState(false)
    const [demandeToValidate, setDemandeToValidate] = useState(null)
    const [demandeToReject, setDemandeToReject] = useState(null)

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
    const handleValideClick = (demande) => {
        setDemandeToValidate(demande)
        setShowValidateModal(true)
    }
    const handleRejectClick = (demande) => {
        setDemandeToReject(demande)
        setShowRejectModal(true)
    }

    const handleConfirmValidate = () => {
        if (demandeToValidate) {
            router.post(route('demandes.validateOrReject', demandeToValidate.id), {
                _method: 'PUT',
                status: "debloque"
            }, {
                onSuccess: () => {
                    setShowValidateModal(false)
                    setDemandeToValidate(null)
                    toast.success('La demande a été debloquée avec succès', {
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
                        toast.error('Une erreur est survenue lors de la validation', {
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
    const handleConfirmReject = () => {
        if (demandeToReject) {
            router.post(route('demandes.validateOrReject', demandeToReject.id), {
                _method: 'PUT',
                status: "rejete"
            }, {
                onSuccess: () => {
                    setShowRejectModal(false)
                    setDemandeToReject(null)
                    toast.success('La demande a été rejetée avec succès', {
                        duration: 4000,
                        position: 'top-right',
                        style: {
                            background: '#EF4444',
                            color: '#fff',
                        },
                    })
                },
                onError: (errors) => {
                    if (errors.status === 419) {
                        window.location.href = route('login');
                    } else {
                        toast.error('Une erreur est survenue lors du rejet', {
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

    const getFileIcon = (type) => {
        if (type.startsWith('image/')) {
            return <Image className="h-6 w-6 text-blue-500" />;
        }
        return <FileText className="h-6 w-6 text-blue-500" />;
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

  return (
    <OperationLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Détails de la demande # {demande.first_name}  {demande.last_name}
                    </h2>
                    <div className="flex space-x-4">
                  {demande.status == "accepte"  &&  demande.user_validateur_level == "operation" && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleValideClick(demande)}
                          className="text-green-600 hover:text-green-900"
                          title='Debloquer'
                        >
                            <Check size={35} />
                        </button>
                        <button
                          onClick={() => handleRejectClick(demande)}
                          className="text-red-600 hover:text-red-900"
                          title='Rejeter'
                        >
                            <OctagonX size={35} />
                        </button>
                      </div>
                  )}
                        <Link
                            href={route('operation.demandes.all')}
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
                                <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                                    <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                                        <dt className="text-sm font-medium text-gray-500">Montant demande</dt>
                                        <dd className="mt-1 text-lg text-gray-900">{demande.montant} FCFA</dd>
                                    </div>
                                    <div className="overflow-hidden lt-1 rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                                        <dt className="text-sm font-medium text-gray-500">Numéro de compte</dt>
                                        <dd className="mt-1 text-lg text-gray-900 whitespace-pre-wrap">{demande.numero_compte}</dd>
                                    </div>
                                </div>
                                <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                                    <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                                        <dt className="text-xl font-medium text-gray-500">Mode de paiement</dt>
                                        <dd className="mt-1 text-xl font-semibold text-gray-900">{demande.mode_paiement}</dd>
                                    </div>

                                    {demande.mode_paiement == "mobile" && (
                                        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                                            <dt className="text-xl font-medium text-gray-500">Numéro de téléphone</dt>
                                            <dd className="mt-1 text-xl font-semibold text-gray-900">{demande.phone}</dd>
                                        </div>
                                    )}
                                    {demande.mode_paiement == "carte" && (
                                        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                                            <dt className="text-xl font-medium text-gray-500">Numéro carte</dt>
                                            <dd className="mt-1 text-xl font-semibold text-gray-900">{demande.numero_carte}</dd>
                                        </div>
                                    )}
                                </div>

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

                            <div className="mt-8">
                                <h3 className="text-lg font-medium leading-6 text-gray-900">Pièces jointes</h3>
                                <div className="mt-5">
                                    {demande.piece_jointes && demande.piece_jointes.length > 0 ? (
                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                            {demande.piece_jointes.map((piece) => (
                                                <div key={piece.id} className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm hover:border-gray-400">
                                                    <div className="flex-shrink-0">
                                                        {getFileIcon(piece.type_mime)}
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-sm font-medium text-gray-900 truncate">
                                                            {piece.nom_fichier}
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            {formatFileSize(piece.taille_fichier)}
                                                        </p>
                                                    </div>
                                                    <div className="flex-shrink-0">
                                                        <a
                                                            href={`/storage/${piece.chemin_fichier}`}
                                                            download={piece.nom_fichier}
                                                            className="inline-flex items-center rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                                        >
                                                            <Download className="h-4 w-4 mr-1" />
                                                            Télécharger
                                                        </a>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-4">
                                            <p className="text-gray-500">Aucune pièce jointe disponible</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Toaster />
            {showValidateModal && (
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
                                        <Check className="h-6 w-6 text-green-600" />
                                    </div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <h3 className="text-lg font-medium leading-6 text-gray-900">
                                            Confirmer le debloquage
                                        </h3>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">
                                                Êtes-vous sûr de vouloir debloquer la demande de {demandeToValidate?.first_name} {demandeToValidate?.last_name} ?
                                                Cette action est irréversible.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                <button
                                    type="button"
                                    onClick={handleConfirmValidate}
                                    className="inline-flex w-full justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Debloquer
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowValidateModal(false)
                                        setDemandeToValidate(null)
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
             {showRejectModal && (
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
                                        <OctagonX className="h-6 w-6 text-red-600" />
                                    </div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <h3 className="text-lg font-medium leading-6 text-gray-900">
                                            Confirmer le rejet
                                        </h3>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">
                                                Êtes-vous sûr de vouloir rejeter la demande de {demandeToReject?.first_name} {demandeToReject?.last_name} ?
                                                Cette action est irréversible.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                <button
                                    type="button"
                                    onClick={handleConfirmReject}
                                    className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Rejeter
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowRejectModal(false)
                                        setDemandeToReject(null)
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
    </OperationLayout>
  )
}

export default EditDemande