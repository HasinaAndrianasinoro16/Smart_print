<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Facture extends Model
{
    protected $table = 'facture';
    protected $primaryKey = 'id';
    protected $keyType = 'string';
    protected $fillable = ['id','client','date_emission','date_echeance','condition_paiement','statut'];
    public $timestamps = false;

    //fonction pour creer l'id
    public static function getId()
    {
        try {
            $seqvalue = DB::select("SELECT nextval('seq_facture')");
            if (!empty($seqvalue)) {
                $seqvalue = $seqvalue[0]->nextval;
            } else {
                throw new QueryException("jereo tsara le anarana sequence na verifeo ko hoe misy sequence tokoa v, ao ligne 20 ny olana");
            }

            return "FACT000" . $seqvalue;
        }catch (\Exception $exception){
            throw new \Exception($exception->getMessage());
        }
    }

    //fonction pour creer une facture
    public static function create_facture($client,$date_emission,$date_echeance,$condition_paiement,$statut)
    {
        try {
            $facture = new Facture();
            $facture->id = self::getId();
            $facture->client = $client;
            $facture->date_emission = $date_emission;
            $facture->date_echeance  = $date_echeance;
            $facture->condition_paiement = $condition_paiement;
            $facture->statut  = 0; //par defaut 0 car elle sont toutes en attentes au depart
        }catch (\Exception $exception){
            return $exception->getMessage();
        }
    }

    //fonction pour recuperer une facture
    public static function get_factures($id)
    {
        try {
            $factures = DB::table('facture')->where('client',$id)->get();
            return $factures;
        }catch (\Exception $exception){
            throw new \Exception($exception->getMessage());
        }
    }

    //fonction pour supprimer une facture
    public static function delete_factures($id){
        try {
            $factures = DB::table('facture')->where('id',$id)->update(['statut'=>1]);
            return $factures;
        }catch (\Exception $exception){
            throw new \Exception($exception->getMessage());
        }
    }

    //fonction pour modifier une facture
    public static function update_facture($id, $client, $date_emission, $date_echeance, $condition_paiement)
    {
        try {
            $factures = DB::table('facture')->where('id',$id)
                ->update([
                    'client' => $client,
                    'date_emission' => $date_emission,
                    'date_echeance' => $date_echeance,
                    'condition_paiement' => $condition_paiement,
                ]);
        }catch (\Exception $exception){
            throw new \Exception($exception->getMessage());
        }
    }

    use HasFactory;
}
