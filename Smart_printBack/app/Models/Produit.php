<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Produit extends Model
{

    protected $table = 'produit';
    protected $primaryKey = 'id';
    protected $keyType = 'string';
    protected $fillable = ['id','designation','prix_unitaire','etat'];
    public $timestamps = false;

    //generation de l'ID
    public static function getId()
    {
        try {
            $seqvalue = DB::select("SELECT nextval('seq_produit')");
            if (!empty($seqvalue)) {
                $seqvalue = $seqvalue[0]->nextval;
            }else{
                throw new \Exception("Impossible d'afficher le sequentiel");
            }
            return "PRDT00" . $seqvalue;
        }catch (\Exception $exception){
            throw new \Exception($exception->getMessage());
        }
    }

    //fonction pour creer un produits
    public static function create_produits($designation,$prix_unitaire){
        try {
            $produit = new Produit();
            $produit->id = self::getId();
            $produit->designation  = $designation;
            $produit->prix_unitaire = $prix_unitaire;
            $produit->etat = 0;
            $produit->save();

            return $produit;
        }catch (\Exception $exception){
            throw new \Exception($exception->getMessage());
        }
    }

    //fonction pour recuperer un produits
    public static function get_Produit(){
        try {
            $produit = DB::table('produit')->where('etat','=',0)->get();
            return $produit;
        }catch (\Exception $exception){
            throw new \Exception($exception->getMessage());
        }
    }

    //fonction pour suppression logique
    public static function delete_produit($id)
    {
        try {
            $produit = DB::table('produit')->where('id','=',$id)
            ->update(['etat' => 1]);
            return $produit;
        }catch (\Exception $exception){
            throw new \Exception($exception->getMessage());
        }
    }

    //fonction pour modifier les produits (optionnel)
    public static function update_produit($id,$designation,$prix_unitaire){
        try {
            $produit = DB::table('produit')->where('id','=',$id)
                ->update([
                    'designation' => $designation,
                    'prix_unitaire' => $prix_unitaire
                ]);
            return $produit;
        }catch (\Exception $exception){
            throw new \Exception($exception->getMessage());
        }
    }

    //fonction pour recuperer un produits par son ID
    public static function get_produits_by_id($id)
    {
        try {
            $produit = DB::table('produit')->where('id','=',$id)->get();
            return $produit;
        }catch (\Exception $exception){
            throw new \Exception($exception->getMessage());
        }
    }

    use HasFactory;
}
