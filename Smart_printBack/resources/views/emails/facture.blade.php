@component('mail::message')
    # Bonjour {{ $facture->clientRelation->nom }},

    Veuillez trouver ci-joint votre facture ({{ $facture->id }}) ainsi que les bons de commande associés.

    Merci pour votre confiance !

    Cordialement,
    **L'équipe Smart Print**
@endcomponent
