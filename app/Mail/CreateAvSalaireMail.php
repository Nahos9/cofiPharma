<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;
use Illuminate\Mail\Attachment;


class CreateAvSalaireMail extends Mailable
{
    use Queueable, SerializesModels;
    public $avSalaire;

    /**
     * Create a new message instance.
     */
    public function __construct($avSalaire)
    {
        $this->avSalaire = $avSalaire;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Nouvelle demande à traiter - Avance sur salaire',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.createAvSalaire',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        // $attachments = [];

        // // dd($this->avSalaire->pieceJointsAv);
        // if ($this->avSalaire->pieceJointsAv) {
        //     foreach ($this->avSalaire->pieceJointsAv as $pieceJointe) {
        //         $path = Storage::disk('public')->path($pieceJointe->chemin_fichier);
        //         if (file_exists($path)) {
        //             $attachments[] = Attachment::fromPath($path)
        //                 ->as($pieceJointe->nom_fichier)
        //                 ->withMime($pieceJointe->type_mime);
        //         }
        //     }
        // }

        // return $attachments;
        return [];
    }
}
