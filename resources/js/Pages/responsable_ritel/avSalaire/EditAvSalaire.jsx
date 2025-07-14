import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/Components/ui/card'
import { Badge } from '@/Components/ui/badge'
import { Button } from '@/Components/ui/button'
import ResponsableLayout from '@/Layouts/ResponsableLayout'
import { Head, Link, router } from '@inertiajs/react'
import { Download, User, Mail, Phone, CreditCard, Calendar, FileText } from 'lucide-react'
import Modal from '@/Components/Modal'
import toast, { Toaster } from 'react-hot-toast'

const statusConfig = {
  'en attente': { variant: 'secondary', text: 'En attente' },
  'acceptée': { variant: 'default', text: 'Acceptée' },
  'rejetée': { variant: 'destructive', text: 'Rejetée' },
  'débloquée': { variant: 'default', text: 'Débloquée' }
}
//

const formatMontant = (montant) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF'
  }).format(montant)
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

const isPreviewable = (mime) => {
  // Types courants visualisables dans le navigateur
  return [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'
  ].includes(mime)
}



const EditAvSalaire = ({ avSalaire }) => {
  const status = statusConfig[avSalaire.status] || statusConfig['en attente']
  const [showModal,setShowModal] = useState(false)
  const [actionType,setActionType] = useState(null)

const handleValidateAvSalaire = (type) => {
    setActionType(type)
    setShowModal(true)
  }

  const handleConfirm = () => {
    // Ici, tu dois faire l'appel à l'API ou router.post/put selon le type
    // Ex: router.post(route('av_salaire.validateOrReject', avSalaire.id), { status: actionType })
    router.post(route('responsable_ritel.av_salaire.validate', avSalaire.id),{
        _method: 'PUT',
        status: actionType,
    },{
        onSuccess: () => {
            setShowModal(false)
            setActionType(null)
            toast.success('La demande a été validée avec succès', {
                duration: 2000,
                position: 'top-right',
                style: {
                    background: '#10B981',
                    color: '#fff',
                },
            })
        },
        onError: (error) => {
            setShowModal(false)
            setActionType(null)
            toast.error('Une erreur est survenue lors de la validation de l\'avance sur salaire')
        }
    })
  }

  const handleCancel = () => {
    setShowModal(false)
    setActionType(null)
  }

  return (
    <ResponsableLayout>
      <Head title={`Détail de l'avance sur salaire`} />
      <Toaster />

      <div className="max-w-2xl mx-auto mt-8">
        <div className="mb-4 flex items-center gap-2">
          <Link href={route('responsable_ritel.av_salaire.all')}>
            <Button variant="outline" size="sm">&larr; Retour</Button>
          </Link>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-6 h-6 text-blue-600" />
              {avSalaire.nom} {avSalaire.prenom}
              {avSalaire.status === 'en attente' && (
                <Badge variant="secondary">En attente</Badge>
              )}
              {avSalaire.status === 'accepte' && (
                <Badge variant="default">Acceptée</Badge>
              )}
              {avSalaire.status === 'rejete' && (
                <Badge variant="destructive">Rejetée</Badge>
              )}
              {avSalaire.status === 'débloquée' && (
                <Badge variant="default">Débloquée</Badge>
              )}
               {avSalaire.status == "accepte" && avSalaire.user_validateur_level == "responsable_ritel" && (
                <div className="flex gap-2">
                    <Button variant="default" size="sm" onClick={() => handleValidateAvSalaire('accepte')}>Valider</Button>
                    <Button variant="destructive" size="sm" onClick={() => handleValidateAvSalaire('rejete')}>Rejeter</Button>
                </div>
            )}
            </CardTitle>

            <CardDescription>
              Détail de la demande d'avance sur salaire
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-500" />
                <span className="text-gray-700">{avSalaire.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-500" />
                <span className="text-gray-700">{avSalaire.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-gray-500" />
                <span className="text-gray-700">{avSalaire.numero_compte}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-gray-700">{formatDate(avSalaire.created_at)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-green-600">{formatMontant(avSalaire.montant)}</span>
              </div>
            </div>
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <FileText className="w-5 h-5 text-gray-700" /> Pièces jointes
              </h3>
              {avSalaire.piece_joints_av && avSalaire.piece_joints_av.length > 0 ? (
                <ul className="space-y-2">
                  {avSalaire.piece_joints_av.map((piece, idx) => {
                    const url = piece.chemin_fichier.startsWith('http') ? piece.chemin_fichier : `/storage/${piece.chemin_fichier}`;
                    return (
                      <li key={idx} className="flex items-center gap-3 bg-gray-50 rounded p-2">
                        <span className="truncate flex-1">{piece.nom_fichier}</span>
                        {isPreviewable(piece.type_mime) && (
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button variant="secondary" size="sm" className="flex items-center gap-1">
                              Visualiser
                            </Button>
                          </a>
                        )}
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          download
                        >
                          <Button variant="outline" size="sm" className="flex items-center gap-1">
                            <Download className="w-4 h-4" /> Télécharger
                          </Button>
                        </a>
                      </li>
                    )
                  })}
                </ul>
              ) : (
                <div className="text-gray-500">Aucune pièce jointe</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      <Modal show={showModal} onClose={handleCancel} maxWidth="sm">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">
            {actionType === 'accepte' ? 'Confirmer la validation' : 'Confirmer le rejet'}
          </h2>
          <p className="mb-6">
            Êtes-vous sûr de vouloir {actionType === 'accepte' ? 'valider' : 'rejeter'} cette avance sur salaire ? Cette action est irréversible.
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleCancel}>Annuler</Button>
            <Button variant={actionType === 'accepte' ? 'default' : 'destructive'} onClick={handleConfirm}>
              {actionType === 'accepte' ? 'Valider' : 'Rejeter'}
            </Button>
          </div>
        </div>
      </Modal>
    </ResponsableLayout>
  )
}

export default EditAvSalaire
