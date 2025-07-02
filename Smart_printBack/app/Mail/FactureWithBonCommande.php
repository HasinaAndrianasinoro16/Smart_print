<?php

namespace App\Mail;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class FactureWithBonCommande extends Mailable
{
    use Queueable, SerializesModels;

    public $facture;
    public $pdfPath;
    public $bonPaths;

    public function __construct($facture, $pdfPath, $bonPaths)
    {
        $this->facture = $facture;
        $this->pdfPath = $pdfPath;
        $this->bonPaths = $bonPaths;
    }

    public function build()
    {
        $email = $this->markdown('emails.facture')
            ->from('handrianasinoro@gmail.com')
            ->subject("Votre facture " . $this->facture->id)
            ->attach($this->pdfPath);

        foreach ($this->bonPaths as $bon) {
            $email->attach($bon);
        }

        return $email;
    }
}
