<?php

namespace App\Http\Controllers;

use App\Models\Boncommande;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class Boncommande_controller extends Controller
{
    //fcontroller pour creer une bon de commande
    public function form_BonCommande(Request $request)
    {
        try {
            $request->validate([
                'facture' => 'required|string',
                'commande' => 'required|file|mimes:pdf,png,jpg,jpeg|max:7120',
            ]);

            $uploadPath = public_path('file_upload');
            if (!file_exists($uploadPath)) {
                mkdir($uploadPath, 0775, true); // 0775 is important
            }

            if (!is_writable($uploadPath)) {
                throw new \Exception("Upload directory is not writable");
            }

            $file = $request->file('commande');
            $filename = $request->facture . '_' . time() . '.' . $file->getClientOriginalExtension();

            $filePath = $file->move($uploadPath, $filename);

            if (!file_exists($filePath)) {
                throw new \Exception("Failed to move uploaded file");
            }

            $boncommande = Boncommande::create_Boncommande(
                $request->facture,
                'file_upload/' . $filename
            );

            return response()->json([
                'success' => true,
                'message' => 'Bon de commande ajouté avec succès',
                'data' => $boncommande
            ]);

        } catch (\Exception $e) {
            \Log::error('Upload failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Upload failed: ' . $e->getMessage()
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

    //controller pour supprimer un bon de commande
    public function Delete_BonCommande($id)
    {
        try {
            $boncommande = Boncommande::delete_bon_commande($id);
            return response()->json($boncommande);
        }catch (\Exception $exception){
            throw new \Exception($exception->getMessage());
        }
    }

    //controller pour recuperer les bon de commande

    public function get_bon_commande_supprimer()
    {
        try {
            $boncommande = Boncommande::where("etat", 1)->get(); // sans with()

            return response()->json($boncommande, 200);
        } catch (\Exception $exception) {
            return response()->json([
                'error' => 'Erreur lors de la récupération des bons de commande',
                'details' => $exception->getMessage()
            ], 500);
        }
    }


    //controller pour restaurer une bon de commande
    public function restore_bon_commande($id)
    {
        try {
            $boncommande = Boncommande::restaure_bon_commande($id);
            return response()->json($boncommande);
        }catch (\Exception $exception){
            throw new \Exception($exception->getMessage());
        }
    }
}
