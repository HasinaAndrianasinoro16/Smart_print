<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Service extends Model
{
    protected $table = 'service';
    protected $primaryKey = 'id';
    protected $fillable = ['designation','prix','etat'];
    public $timestamps = false;

    //fonction pour creer un nouveau service
    public static function create_service($designation,$prix)
    {
        try {
            $service = new Service();
            $service->designation = $designation;
            $service->prix = $prix;
            $service->etat = 0;
            $service->save();
            return $service;
        }catch (\Exception $exception){
            throw new \Exception($exception->getMessage());
        }
    }

    //fonction pour recuperer un service par son ID
    public static function get_service_by_id($id)
    {
        try {
            $service = DB::table('service')
                ->where('id','=', $id)
                ->get();
            return $service;
        }catch (\Exception $exception){
            throw new \Exception($exception->getMessage());
        }
    }

    //fonction  pour recuperer les servvice
    public  static function get_service()
    {
        try {
            $service = DB::table('service')
                ->where('etat','=',0)
                ->get();
            return $service;
        }catch (\Exception $exception){
            throw new \Exception($exception->getMessage());
        }
    }

    //fonction pour suppression logique
    public static function delete_service($id)
    {
        try {
            $service = DB::table('service')
                ->where('id','=', $id)
                ->update(['etat'=>1]);
            return $service;
        }catch (\Exception $exception){
            throw new \Exception($exception->getMessage());
        }
    }

    //fonction pour modifier un service
    public static function update_service($id,$designation,$prix)
    {
        try {
            $service = DB::table('service')
                ->where('id','=', $id)
                ->update([
                    'designation'=>$designation,
                    'prix' => $prix,
                ]);
            return $service;
        }catch (\Exception $exception){
            throw new \Exception($exception->getMessage());
        }
    }

    //fonction pour enregistrer un/plusieur service a une facture
    public static function service_facture($facture, $description, $prix_unitaire)
    {
        try {
            $service = DB::table('servicefacture')
            ->insert([
                'facture' => $facture,
                'description' => $description,
                'prix_unitaire' => $prix_unitaire,
            ]);
            return $service;
        }catch (\Exception $exception){
            throw new \Exception($exception->getMessage());
        }
    }

    //fonction pour recuperer les services relier a une facture
    public static function service_facture_idFacture($facture)
    {
        try {
            $service = DB::table('servicefacture')
                ->where('facture','=', $facture)
                ->get();
            return $service;
        }catch (\Exception $exception){
            throw new \Exception($exception->getMessage());
        }
    }

    use HasFactory;
}
