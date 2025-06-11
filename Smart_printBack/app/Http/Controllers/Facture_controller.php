<?php

namespace App\Http\Controllers;

use App\Models\Facture;
use Illuminate\Http\Request;

class Facture_controller extends Controller
{
    //controller pour la liste des factures
    public function get_All_Factures()
    {
        try {
            $factures = Facture::where('statut','=',0)->get();
            return response()->json($factures);
        }catch (\Exception $e){
            return response()->json(['error'=>$e->getMessage()],500);
        }
    }

    //controller pour ajouter les factures
    public function Form_add_facture(Request $request)
    {
        try {
            $request->validate([
                'client' => 'required',
                'date_emission' => 'required',
                'date_echeance' => 'required',
                'condition_paiement' => 'required',
            ]);
            $facture = Facture::create_facture(\request('client'),\request('date_emission'),\request('date_echeance'),\request('condition_paiement'));

            return response()->json($facture);
        }catch (\Exception $e){
            return response()->json(['error'=>$e->getMessage()],500);
        }
    }

    //controller pour afficher une facture par son id
    public function get_facture($id){
        try {
            $facture = Facture::get_factures($id);
            return response()->json($facture);
        }catch (\Exception $e){
            return response()->json(['error'=>$e->getMessage()],500);
        }
    }

    //controller pour supprimer une facture
    public function delte_facture($id)
    {
        try {
            $facture = Facture::delete_factures($id);
            return response()->json($facture);
        }catch (\Exception $exception){
            return response()->json(['error'=>$exception->getMessage()],500);
        }
    }

    //controller pour modifier une facture
    public function update_facture(Request $request,$id)
    {
        $facture = Facture::update_facture(
            $id,
            \request('client'),
            \request('date_emission'),
            \request('date_echeance'),
            \request('condition_paiement')
        );

        return response()->json($facture);
    }
}
