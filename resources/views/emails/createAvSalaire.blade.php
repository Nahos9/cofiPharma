<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nouvelle demande à traiter - Avance sur salaire</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            text-align: center;
            padding: 20px 0;
            background-color: #f8f9fa;
        }
        .logo {
            max-width: 200px;
            height: auto;
        }
        .content {
            padding: 30px 20px;
            background-color: #ffffff;
        }
        .footer {
            text-align: center;
            padding: 20px;
            font-size: 12px;
            color: #666;
            background-color: #f8f9fa;
        }
        .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #28a745;
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
        }
        .details {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 5px;
            margin: 20px 0;
            border-left: 4px solid #28a745;
        }
        .details p {
            margin: 10px 0;
        }
        .priority {
            color: #dc3545;
            font-weight: bold;
        }
        .action-required {
            background-color: #fff3cd;
            border: 1px solid #ffeeba;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <!-- <img src="{{ config('app.url') }}/img/cof.png" alt="CofiPharma Logo" class="logo"> -->
        </div>

        <div class="content">
            <h2>Nouvelle demande à traiter</h2>

            <div class="action-required">
                <p><strong>Action requise :</strong> Une nouvelle demande de financement nécessite votre attention.</p>
            </div>

            <div class="details">
                <h3>Informations du demandeur :</h3>
                <p><strong>Nom complet :</strong> {{ $avSalaire->nom }} {{ $avSalaire->prenom }}</p>
                <p> <strong>Numéro de compte : </strong> {{ $avSalaire->numero_compte }}</p>
                <p><strong>Email :</strong> {{ $avSalaire->email }}</p>
                <p><strong>Téléphone :</strong> {{ $avSalaire->phone }}</p>
                <p><strong>Montant demandé :</strong> <span class="priority">{{ number_format($avSalaire->montant, 2, ',', ' ') }} FCFA</span></p>
                <p><strong>Date de la demande :</strong> {{ $avSalaire->created_at->format('d/m/Y H:i') }}</p>
                <p><strong>ID de la demande :</strong> #{{ $avSalaire->id }}</p>
            </div>

            <p>Veuillez traiter cette demande dans les plus brefs délais. Vous pouvez accéder à la demande complète via le tableau de bord administratif.</p>

            <div style="text-align: center;">
                <a href="{{ route('demande.all') }}" class="button">Accéder à la demande</a>
            </div>

            <p><strong>Rappel des étapes de traitement :</strong></p>
            <ol>
                <li>Vérifier les informations du demandeur</li>
                <li>Analyser la demande</li>
                <li>Prendre une décision (Approuver/Rejeter)</li>
                <li>Notifier le demandeur</li>
            </ol>

            <p>Cordialement,<br>
            Système de notification CofiExpress</p>
        </div>

        <div class="footer">
            <p>© {{ date('Y') }} CofiExpress. Tous droits réservés.</p>
            <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
        </div>
    </div>
</body>
</html>
