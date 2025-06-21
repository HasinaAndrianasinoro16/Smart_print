<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Client extends Model
{
    protected $table = 'client';
    protected $primaryKey = 'id';
    protected $fillable = ['nom','adresse','nif','email','stat','telephone','rcs','etat','code'];
    public $timestamps = false;

    //fonction pour creer un nouveau client
    public static function Save_Client($nom, $adresse, $nif, $email, $stat, $telephone, $rcs, $code)
    {
        try {
            $client = new Client();
            $client->nom = $nom;
            $client->adresse = $adresse;
            $client->nif = $nif;
            $client->email = $email;
            $client->stat = $stat;
            $client->telephone = $telephone;
            $client->rcs = $rcs;
            $client->etat = 0;
            $client->code = $code;
            $client->save();

            return $client;
        }catch (\Exception $exception){
            return $exception->getMessage();
        }
    }

    //(optionel)fonction pour modifier les infos clients
    public static function update_client($id,$nom, $adresse, $nif, $email, $stat, $telephone, $rcs, $code)
    {
        try {
            $update = DB::table('client')->where('id',$id)
                ->update([
                    'nom' => $nom,
                    'adresse' => $adresse,
                    'nif' => $nif,
                    'email' => $email,
                    'stat' => $stat,
                    'telephone' => $telephone,
                    'rcs' => $rcs,
                    'code' => $code,
                ]);
            return $update;
        }catch (\Exception $exception){
            return $exception->getMessage();
        }
    }

    //(optionnel) fonction pour recuperer un client en particulier
    public static function get_client($id){
        try {
            $client = DB::table('client')->where('id',$id)->first();
            return $client;
        }catch (\Exception $exception){
            return $exception->getMessage();
        }
    }
    use HasFactory;
}
