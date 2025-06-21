<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Boncommande extends Model
{
    protected $table = 'boncommande';
    protected $primaryKey = 'id';
    protected $keyType = 'string';
    protected $fillable = ['id','date_creation','facture','commande','etat'];
    public $timestamps = false;

    //relation avec facture
    public function FactureRelation()
    {
        return $this->belongsTo(Facture::class,'facture');
    }

    //generation de l'ID
    public static function getId()
    {
        try {
            $reqvalue = DB::select("SELECT nextval('seq_boncommande')");
            if (!empty($reqvalue)){
                $id = $reqvalue[0]->nextval;
            }else{
                throw new \Exception("jereo tsara rah misy le sequence na diso ilay anarana sequence");
            }
        }catch (\Exception $exception){
            throw new \Exception($exception->getMessage());
        }
    }

    //creation du bon de commande
    public static function create_Boncommande($facture, $commande)
    {
        try {
            $boncommande = new Boncommande();
            $boncommande->id = self::getId();
            $boncommande->date_creation = Carbon::now();
            $boncommande->facture = $facture;
            $boncommande->commande =  $commande;
            $boncommande->etat = 0;
            $boncommande->save();
            return $boncommande;
        }catch (\Exception $exception){
            throw new \Exception($exception->getMessage());
        }
    }

    //recuperation de bon de commande via une facture
    public static function get_BonCommande_by_facture($facture)
    {
        try {
            $boncommande = DB::table("boncommande")
                ->where("facture", $facture)
                ->where("etat", 0)
                ->get();
            return $boncommande;
        }catch (\Exception $exception){
            throw new \Exception($exception->getMessage());
        }
    }

    use HasFactory;
}
