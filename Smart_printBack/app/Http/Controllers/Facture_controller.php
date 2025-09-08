<?php

namespace App\Http\Controllers;

use App\Models\Facture;
use App\Models\Facture_user;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class Facture_controller extends Controller
{
    // Liste des factures (avec le client)
    public function get_All_Factures()
    {
        try {
            $factures = Facture::where('statut', 0)
                ->with('clientRelation')
                ->get();
            return response()->json($factures);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    //Liste des fatcure paye(historique)
    public function get_all_facture_payer()
    {
        try {
            $factures = Facture::where('statut', 2)
                ->with('clientRelation')
                ->get();
            return response()->json($factures);
        }catch (\Exception $exception){
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    // Ajouter une facture
    public function Form_add_facture(Request $request)
    {
        try {
            $request->validate([
                'client' => 'required',
                'date_emission' => 'required',
                'date_echeance' => 'required',
                'condition_paiement' => 'required',
                'user' => 'required',
            ]);

            $facture = Facture::create_facture(
                $request->input('client'),
                $request->input('date_emission'),
                $request->input('date_echeance'),
                $request->input('condition_paiement'),
                $request->input('user')
            );

            return response()->json($facture);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // Récupérer les factures d'un client
    public function get_facture($id)
    {
        try {
            $facture = Facture::get_factures($id);
            return response()->json($facture);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // Supprimer une facture (logique)
    public function delte_facture($id)
    {
        try {
            $facture = Facture::delete_factures($id);
            return response()->json($facture);
        } catch (\Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    // Modifier une facture
    public function update_facture(Request $request, $id)
    {
        try {
            $facture = Facture::update_facture(
                $id,
                $request->input('client'),
                $request->input('date_emission'),
                $request->input('date_echeance'),
                $request->input('condition_paiement')
            );

            return response()->json($facture);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    //Controller pour afficher les factures par leur propre id
    public function get_factures_by_id($id)
    {
        try {
            $facture = Facture::with('clientRelation')->find($id);
            return response()->json($facture);
        } catch (\Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    //recuperer les factures par statut
    public function get_facture_by_statut($statut)
    {
        try {
            $facture = Facture::with('clientRelation')
                ->where('statut', $statut)
                ->get();
            return $facture;
        }catch (\Exception $exception){
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    //compter les factures par statut
    public function count_facture_by_statut($statut)
    {
        try {
            $facture = DB::table('facture')->where('statut', $statut)->count();
            return  response()->json($facture);
        }catch (\Exception $exception){
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    //remettre les factures supprimer en non-supprimer
    public function undo_facture($id)
    {
        try {
            $facture = DB::table('facture')
                ->where('statut', '=',1)
                ->where('id', '=',$id)
                ->update(['statut' => 0]);
            return response()->json($facture);
        }catch (\Exception $exception){
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    //controller pour approuver une facture
    public function approuver_facture($id)
    {
        try {
            $facture = Facture::approuver_facture($id);
            return response()->json($facture);
        }catch (\Exception $exception){
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    //Liste des factures creer par utilisateur
    public function getFactures_by_users($user)
    {
        try {
            $factures = Facture_user::with('factureRelation')
                ->with('userRelation')
                ->where('userid', $user)
                ->get();
            return response()->json($factures);
        }catch (\Exception $exception){
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    //fonction pour recuperer quelle utilisateur a creer la facture
    public function getFacture_user_by_facture($id)
    {
        try {
            $factures = Facture_user::with('factureRelation')
                ->with('userRelation')
                ->where('facture', $id)
                ->get();
            return response()->json($factures);
        }catch (\Exception $exception){
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    public function getFacture_stat(Request $request)
    {
        try {
            $debut = $request->query('debut');
            $fin = $request->query('fin');

            $query = DB::table('facture_total_view');

            if ($debut && $fin) {
                $query->whereBetween('date_emission', [$debut, $fin]);
            }

            $attente = (clone $query)->where('statut', 0)->count();

            $annule = (clone $query)->where('statut', 1)->count();

            $paye = (clone $query)->where('statut', 2)->count();

            $total = (clone $query)->where('statut',0)->sum('total_facture');

            return response()->json([
                'attente' => $attente,
                'annule' => $annule,
                'paye' => $paye,
                'total' => $total,
            ]);
        }catch (\Exception $exception){
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }
}
