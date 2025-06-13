<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Sousfacture extends Model
{
    protected $table = 'sousfacture';
    protected $primaryKey = 'id';
    protected $fillable = ['facture','description','quantite','prix_unitaire'];
    public $timestamps = false;

    //relation avec facture
    public function FactureRelation()
    {
        return $this->belongsTo(Facture::class,'facture');
    }

    //fonction pour creer une sous_facture
    public static function create_sous_facture($facture,$description,$quantite,$prix_unitaire)
    {
        try {
            $sousfacture = new Sousfacture();
            $sousfacture->facture = $facture;
            $sousfacture->description = $description;
            $sousfacture->quantite = $quantite;
            $sousfacture->prix_unitaire = $prix_unitaire;
            $sousfacture->save();

            return $sousfacture;
        }catch (\Exception $exception){
            throw new \Exception($exception->getMessage());
        }
    }

    //fonction pour recuperer une sous facture a partir d'une facture
    public static function get_sous_facture($facture)
    {
        try {
            $sous_facture = DB::table('sousfacture')->where('facture',$facture)->get();
            return $sous_facture;
        }catch (\Exception $exception){
            throw new \Exception($exception->getMessage());
        }
    }

    //fonction pour recuperer les details factures d'une facture
    public static function get_details_facture($facture)
    {
        try {
            $details = DB::table('vue_detail_facture')->where('facture_id',$facture)->get();
            return $details;
        }catch (\Exception $exception){
            throw new \Exception($exception->getMessage());
        }
    }

    //fonction pour recuperer les details sous factures avec une facture
    public static function get_vue_detail_facture($facture)
    {
        try {
            $detail = DB::table('vue_detail_facture')->where('facture_id',$facture)->get();
            return $detail;
        }catch (\Exception $exception){
            throw new \Exception($exception->getMessage());
        }
    }

    use HasFactory;
}
