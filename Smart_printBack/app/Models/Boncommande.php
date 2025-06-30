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
    public function factureRelation()
    {
        return $this->belongsTo(Facture::class, 'facture', 'id');
    }
//    public function factureRelation()
//    {
//        return $this->belongsTo(Facture::class, 'facture');
//    }


    //generation de l'ID
    public static function getId()
    {
        try {
            $reqvalue = DB::select("SELECT nextval('seq_boncommande')");
            if (!empty($reqvalue)){
                $id = $reqvalue[0]->nextval;
            } else {
                throw new \Exception("jereo tsara rah misy le sequence na diso ilay anarana sequence");
            }

            return "BC-" . str_pad($id, 5, "0", STR_PAD_LEFT); // Exemple de format : BC-00001
        } catch (\Exception $exception) {
            throw new \Exception($exception->getMessage());
        }
    }


    //creation du bon de commande
    public static function create_Boncommande($facture, $commande)
    {
        DB::beginTransaction();
        try {
            $boncommande = new Boncommande();
            $boncommande->id = self::getId();
            $boncommande->date_creation = Carbon::now();
            $boncommande->facture = $facture;
            $boncommande->commande = $commande;
            $boncommande->etat = 0;

            if (!$boncommande->save()) {
                throw new \Exception("Failed to save bon de commande");
            }

            DB::commit();
            return $boncommande;
        } catch (\Exception $exception) {
            DB::rollBack();
            Log::error('Failed to create boncommande', [
                'error' => $exception->getMessage(),
                'trace' => $exception->getTraceAsString(),
                'facture' => $facture,
                'commande_path' => $commande
            ]);
            throw new \Exception("Failed to create bon de commande: " . $exception->getMessage());
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
    //supprimer un bon de commande
    public static function delete_bon_commande($id)
    {
        try {
            $boncommande = DB::table("boncommande")
                ->where("id",'=', $id)
                ->update(['etat' => 1]);
            return $boncommande;
        }catch (\Exception $exception){
            throw new \Exception($exception->getMessage());
        }
    }

    //recuperer les bon de commande supprimer
//    public static function get_bon_commande_supprimer()
//    {
//        try {
//            $boncommande = DB::table("boncommande")
//                ->with("")
//                ->where("etat","=",1)
//                ->get();
//            return $boncommande;
//        }catch (\Exception $exception){
//            throw new \Exception($exception->getMessage());
//        }
//    }

    //restaurer un bon de commande supprimer
    public static function restaure_bon_commande($id)
    {
        try {
            $boncommande = DB::table("boncommande")
                ->where("id",'=', $id)
                ->update(['etat' => 0]);
            return $boncommande;
        }catch (\Exception $exception){
            throw new \Exception($exception->getMessage());
        }
    }

    use HasFactory;
}
