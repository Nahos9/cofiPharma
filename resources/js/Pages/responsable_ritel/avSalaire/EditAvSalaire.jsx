import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/Components/ui/card'
import { Badge } from '@/Components/ui/badge'
import { Button } from '@/Components/ui/button'
import ResponsableLayout from '@/Layouts/ResponsableLayout'
import { Head, Link } from '@inertiajs/react'
import { Download, User, Mail, Phone, CreditCard, Calendar, FileText } from 'lucide-react'

const statusConfig = {
  'en attente': { variant: 'secondary', text: 'En attente' },
  'acceptée': { variant: 'default', text: 'Acceptée' },
  'rejetée': { variant: 'destructive', text: 'Rejetée' },
  'débloquée': { variant: 'default', text: 'Débloquée' }
}

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

  return (
    <ResponsableLayout>
      <Head title={`Détail de l'avance sur salaire`} />
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
              <Badge variant={status.variant}>{status.text}</Badge>
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
    </ResponsableLayout>
  )
}

export default EditAvSalaire