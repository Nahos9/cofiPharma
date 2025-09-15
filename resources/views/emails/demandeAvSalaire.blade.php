<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmation de votre demande - CofiExpress</title>
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
            background-color: #007bff;
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
        }
        .details p {
            margin: 10px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
        <!-- <img src="{{ config('app.url') }}/img/cof.png" alt="CofiPharma Logo" class="logo"> -->
        </div>

        <div class="content">
            <h2>Confirmation de demande</h2>

            <p>Chèr(e) client(e),</p>

            <p>Nous accusons réception de votre demande d'avance sur salaire.</p>

            <div class="details">
                <h3>Détails de la demande :</h3>
                <p><strong>Nom :</strong> {{ $avSalaire->first_name }} {{ $avSalaire->last_name }}</p>
                <p><strong>Montant demandé :</strong> {{ number_format($avSalaire->montant, 2, ',', ' ') }} FCFA</p>
                <p><strong>Date de la demande :</strong> {{ $avSalaire->created_at->format('d/m/Y H:i') }}</p>
            </div>

            <p>Notre équipe étudiera votre demande dans les plus brefs délais. Vous serez contacté(e) prochainement pour la suite à y réserver.</p>

            <p>Pour toute question ou information complémentaire, n'hésitez pas à nous contacter :</p>
                <ul>
                    <li><strong>Téléphone :</strong> +241 65 99 01 46</li>
                    <li><strong>Email :</strong> service.client.ga@cofinacorp.com</li>
                </ul>

            <p>Cordialement,<br>
            L'équipe CofiExpress</p>
        </div>

        <div class="footer">
            <p>© {{ date('Y') }} CofiExpress. Tous droits réservés.</p>
            <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
        </div>
    </div>
</body>
</html>
