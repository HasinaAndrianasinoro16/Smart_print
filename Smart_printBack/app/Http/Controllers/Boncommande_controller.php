<?php

namespace App\Http\Controllers;

use App\Models\Boncommande;
use Illuminate\Http\Request;

class Boncommande_controller extends Controller
{
    //fcontroller pour creer une bon de commande
    public function form_BonCommande($request)
    {
        try {
            $request->validate([
                'facture' => 'required',
                'commande' => 'required',
            ]);
            $boncommande = Boncommande::create_Boncommande(
                $request->facture,
                $request->commande,
            );
            return response()->json($boncommande);
        }catch (\Exception $exception){
            throw new \Exception($exception->getMessage());
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
