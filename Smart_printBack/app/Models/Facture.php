<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Facture extends Model
{
    use HasFactory;

    protected $table = 'facture';
    protected $primaryKey = 'id';
    protected $keyType = 'string';
    protected $fillable = ['id','client','date_emission','date_echeance','condition_paiement','statut','created_at'];
    public $timestamps = false;

    // Relation avec le client
    public function clientRelation() {
        return $this->belongsTo(Client::class, 'client');
    }

    // Génération de l'ID
    public static function getId()
    {
        try {
            $seqvalue = DB::select("SELECT nextval('seq_facture')");
            if (!empty($seqvalue)) {
                $seqvalue = $seqvalue[0]->nextval;
            } else {
                throw new \Exception("Vérifie la séquence 'seq_facture'.");
            }
            return "FACT000" . $seqvalue;
        } catch (\Exception $exception) {
            throw new \Exception($exception->getMessage());
        }
    }

    // Création de facture
    public static function create_facture($client, $date_emission, $date_echeance, $condition_paiement, $user)
    {
        try {
            $id = self::getId();
            $facture = new Facture();
            $facture->id = $id;
            $facture->client = $client;
            $facture->date_emission = $date_emission;
            $facture->date_echeance = $date_echeance;
            $facture->condition_paiement = $condition_paiement;
            $facture->statut = 0;
            $facture->created_at = Carbon::now();
            $facture->save();

            $made_by = Facture_user::Made_by($id,$user);

            return $facture;
        } catch (\Exception $exception) {
            throw new \Exception($exception->getMessage());
        }
    }

    // Récupération de factures par client
    public static function get_factures($id)
    {
        try {
            return self::where('client', $id)->get();
        } catch (\Exception $exception) {
            throw new \Exception($exception->getMessage());
        }
    }

    // Suppression (désactivation logique)
    public static function delete_factures($id)
    {
        try {
            return self::where('id', $id)->update(['statut' => 1]);
        } catch (\Exception $exception) {
            throw new \Exception($exception->getMessage());
        }
    }

    // Modification de facture
    public static function update_facture($id, $client, $date_emission, $date_echeance, $condition_paiement)
    {
        try {
            return self::where('id', $id)->update([
                'client' => $client,
                'date_emission' => $date_emission,
                'date_echeance' => $date_echeance,
                'condition_paiement' => $condition_paiement,
            ]);
        } catch (\Exception $exception) {
            throw new \Exception($exception->getMessage());
        }
    }

    //fonction pour recuperer les factures par leur id
    public static function get_facture_by_id($id)
    {
        try {
            $factures = DB::table('facture')->where('id', $id)->first();
            return $factures;
        }catch (\Exception $exception){
            throw new \Exception($exception->getMessage());
        }
    }
    //fonction pour approuver une facture
    public static function approuver_facture($id)
    {
        try {
            $factures = DB::table('facture')->where('id', $id)
                ->update(['statut' => 2]);
            return $factures;
        }catch (\Exception $exception){
            throw new \Exception($exception->getMessage());
        }
    }

    public static function facture_stats()
    {
        try {
            $stats= DB::table('facture_total_view')->get();
            return $stats;
        }catch (\Exception $exception){
            throw new \Exception($exception->getMessage());
        }
    }
}
