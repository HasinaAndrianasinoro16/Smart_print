<?php

namespace App\Http\Controllers;

use App\Models\Boncommande;
use Illuminate\Http\Request;

class Boncommande_controller extends Controller
{
    //fcontroller pour creer une bon de commande
    public function form_BonCommande(Request $request)
    {
        try {
            $request->validate([
                'facture' => 'required|string',
                'commande' => 'required|file|mimes:pdf,png,jpg,jpeg|max:7120'
            ]);

            $file = $request->file('commande');
            $filename = $request->facture . '_' . time() . '.' . $file->getClientOriginalExtension();
            $filePath = $file->move(public_path('file_upload'), $filename);

            // Enregistrement en base (chemin relatif pour la BDD)
            $boncommande = Boncommande::create_Boncommande(
                $request->facture,
                'file_upload/' . $filename
            );

            return response()->json([
                'message' => 'Bon de commande ajouté avec succès',
                'data' => $boncommande
            ]);
        } catch (\Exception $exception) {
            return response()->json([
                'error' => $exception->getMessage(),
                'file' => $file ?? null,
                'mime_type' => $file ? $file->getMimeType() : null,
                'extension' => $file ? $file->getClientOriginalExtension() : null,
            ], 500);
        }
    }


    //controller pour recuperer une/des bon de commande via une facture
    public function get_BonCommande_by_facture($facture)
    {
        try {
            $boncommande = Boncommande::get_BonCommande_by_facture($facture);
            return response()->json($boncommande);
        }catch (\Exception $exception){
            throw new \Exception($exception->getMessage());
        }
    }
}
