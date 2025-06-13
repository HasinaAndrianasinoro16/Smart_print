<?php

namespace App\Http\Controllers;

use App\Models\Sousfacture;
use Illuminate\Http\Request;

class Sousfacture_controller extends Controller
{
    //liste des sousfacure (avec la facture)
    public function get_All_Sous_Factures()
    {
        try {
            $sousfactures = Sousfacture::all()->with('FactureRelation');
            return response()->json($sousfactures);
        }catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    //recuperer les sous facture a l'aide d'une facture
    public function get_sous_facture_with_facture($id_facture)
    {
        try {
            $sousfacture = Sousfacture::where('facture','=', $id_facture)->with('FactureRelation')->get();
            return response()->json($sousfacture);
        }catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    //controller pour le formulaire d'ajout de sous facture
    public function Form_add_Sous_Facture(Request $request)
    {
        try {
            $request->validate([
                'facture' => 'required',
                'description' => 'required',
                'quantite' => 'required',
                'prix_unitaire' => 'required',
            ]);

            $sousfacture = Sousfacture::create_sous_facture(
                $request->input('facture'),
                $request->input('description'),
                $request->input('quantite'),
                $request->input('prix_unitaire')
            );

            return response()->json($sousfacture);

        }catch (\Exception $e){
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    //controller pour recuperer les details des sous fature d'une facture
    public function get_detail_sousfacture_by_facture($facture_id)
    {
        try {
            $detail = Sousfacture::get_vue_detail_facture($facture_id);
            return response()->json($detail);
        }catch (\Exception $e){
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
