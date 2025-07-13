<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Service extends Model
{
    protected $table = 'service';
    protected $primaryKey = 'id';
    protected $fillable = ['designation','etat'];
    public $timestamps = false;

    //fonction pour creer un nouveau service
    public static function create_service($designation)
    {
        try {
            $service = new Service();
            $service->designation = $designation;
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
    public static function update_service($id,$designation)
    {
        try {
            $service = DB::table('service')
                ->where('id','=', $id)
                ->update(['designation'=>$designation]);
            return $service;
        }catch (\Exception $exception){
            throw new \Exception($exception->getMessage());
        }
    }

    use HasFactory;
}
