<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Décision concernant votre demande - CofiPharma</title>
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
        .status-approved {
            background-color: #d4edda;
            border: 1px solid #c3e6cb;
            color: #155724;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
        }
        .status-rejected {
            background-color: #f8d7da;
            border: 1px solid #f5c6cb;
            color: #721c24;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
        }
        .details {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 5px;
            margin: 20px 0;
        }
        .details p {
            margin: 10px 0;
        }
        .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #007bff;
            color: #ffffff;
            text-decoration: none;
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
            <h2>Décision concernant votre demande</h2>

            <p>Chèr(e) client(e),</p>

            @if($demande->status === 'accepte')
                <div class="status-approved">
                    <h3>🎉 Félicitations ! Votre demande a été validée</h3>
                    <p>Nous avons le plaisir de vous informer que votre demande de financement a été validée et nos équipes sont en train de la traiter.</p>
                </div>

                <div class="details">
                    <h3>Détails de la décision :</h3>
                    <p><strong>Numéro de demande :</strong> #{{ $demande->id }}</p>
                    <p><strong>Montant approuvé :</strong> {{ number_format($demande->montant, 2, ',', ' ') }} FCFA</p>
                    <p><strong>Date de validation :</strong> {{ $demande->updated_at->format('d/m/Y H:i') }}</p>
                    <!-- <p><strong>Numéro de commande :</strong> #{{ $demande->numero_commande }}</p>
                    <p><strong>Numéro de compte :</strong> {{ $demande->numero_compte }}</p> -->
                    <!-- <p><strong>Validé par :</strong> {{ $demande->user_validateur }}</p> -->
                </div>

                <p>Notre équipe vous contactera dans les plus brefs délais pour finaliser les modalités de votre financement.</p>

            @elseif($demande->status === 'rejete')
                <div class="status-rejected">
                    <h3>Décision concernant votre demande</h3>
                    <p>Nous regrettons de vous informer que votre demande de financement n'a pas pu être approuvée à ce stade.</p>
                    <p>Nous vous invitons à nous contacter pour plus d'informations sur les raisons de cette décision et pour discuter des possibilités de révision de votre demande.</p>
                    <p>Pour toute question, n'hésitez pas à nous contacter :</p>
                </div>

                <div class="details">
                    <h3>Détails de la décision :</h3>
                    <p><strong>Numéro de demande :</strong> #{{ $demande->id }}</p>
                    <p><strong>Montant demandé :</strong> {{ number_format($demande->montant, 2, ',', ' ') }} FCFA</p>
                    <p><strong>Date de la décision :</strong> {{ $demande->updated_at->format('d/m/Y H:i') }}</p>
                    <!-- <p><strong>Décision prise par :</strong> {{ $demande->user_validateur }}</p> -->
                </div>
            @elseif($demande->status === 'debloque')
                <div class="status-approved">
                    <h3>🎉 Félicitations ! Votre demande a été approuvée</h3>
                    <p>Nous avons le plaisir de vous informer que votre demande de financement a été validée et les fonds sont déjà à votre disposition.</p>
                </div>
                <div class="details">
                    <h3>Détails de la décision :</h3>
                    <p><strong>Numéro de demande :</strong> #{{ $demande->id }}</p>
                    <p><strong>Montant demandé :</strong> {{ number_format($demande->montant, 2, ',', ' ') }} FCFA</p>
                    <p><strong>Date de la décision :</strong> {{ $demande->updated_at->format('d/m/Y H:i') }}</p>
                    <!-- <p><strong>Décision prise par :</strong> {{ $demande->user_validateur }}</p> -->
                </div>
                <div class="details">
                    <h3>Contactez-nous :</h3>
                    <ul>
                        <li>Par téléphone : +241 65 99 01 46</li>
                        <li>Par email : service.client.ga@cofinacorp.com</li>
                    </ul>

                <p>Cordialement,<br>
                L'équipe CofiPharma</p>
                 </div>
          @endif
        <div class="footer">
            <p>© {{ date('Y') }} CofiPharma. Tous droits réservés.</p>
            <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
        </div>
    </div>
</body>
</html>
