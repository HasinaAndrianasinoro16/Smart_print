<?php

namespace App\Http\Controllers;

use App\Models\Produit;
use Illuminate\Http\Request;

class Produit_controller extends Controller
{
    //controller pour inserer un produits
    public function save_produit(Request $request){
        try {
            $request->validate([
                'designation' => 'required',
                'prix_unitaire' => 'required',
            ]);

            $produit = Produit::create_produits(\request('designation'),\request('prix_unitaire'));
            return response()->json($produit);
        }catch (\Exception $exception){
            throw new \Exception($exception->getMessage());
        }
    }

    //controller pour recuperer les produits
    public function get_produits(){
        try {
            $produit = Produit::get_Produit();
            return response()->json($produit);
        }catch (\Exception $exception){
            throw new \Exception($exception->getMessage());
        }
    }

    //controller pour supprimer un produits
    public function delete_produit($id){
        try {
            $produits = Produit::delete_produit($id);
            return response()->json($produits);
        }catch (\Exception $exception){
            throw new \Exception($exception->getMessage());
        }
    }

    //controller pour modifier un produit
    public function update_produit(Request $request,$id){
        try {
            $produits = Produit::update_produit($id,\request('designation'),\request('prix_unitaire'));
            return response()->json($produits);
        }catch (\Exception $exception){
            throw new \Exception($exception->getMessage());
        }
    }

    //controller pour recuperer un produits par son id
    public function get_produit_by_id($id){
        try {
            $produits = Produit::get_produits_by_id($id);
            return response()->json($produits);
        }catch (\Exception $exception){
            throw new \Exception($exception->getMessage());
        }
    }
}
