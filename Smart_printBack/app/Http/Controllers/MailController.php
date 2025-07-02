<?php
namespace App\Http\Controllers;

use App\Mail\FactureWithBonCommande;
use App\Models\Boncommande;
use App\Models\Facture;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;

class MailController extends Controller
{
    public function sendFactureMail(Request $request)
    {
        $request->validate([
            'facture' => 'required|string',
            'pdf' => 'required|file|mimes:pdf|max:5120',
        ]);

        $pdfPath = $request->file('pdf')->storeAs(
            'temp', 'facture_' . $request->facture . '.pdf'
        );

        $facture = Facture::with('clientRelation')->findOrFail($request->facture);
        $bons = Boncommande::where('facture', $facture->id)
            ->where('etat', 0)
            ->get();

        $bonPaths = [];
        foreach ($bons as $bon) {
            $fullPath = public_path($bon->commande);
            if (file_exists($fullPath)) {
                $bonPaths[] = $fullPath;
            }
        }

        $email = $facture->clientRelation->email;

        Mail::to($email)
            ->send(new FactureWithBonCommande(
            $facture,
            storage_path('app/' . $pdfPath),
            $bonPaths
        ));

        return response()->json(['message' => 'Email envoyé avec succès']);
    }
}

