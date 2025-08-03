<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class Utilisateur extends Model
{
    protected $table = 'users';
    protected $fillable = ['name','email','password','role'];

    //fonction pour enregistrer un utilisateur
    public static function Save_users($name, $email, $password, $role)
    {
        try {
            $Utilisateur = new Utilisateur();
            $Utilisateur->name = $name;
            $Utilisateur->email = $email;
            $Utilisateur->password = Hash::make($password);
            $Utilisateur->role = $role;
            $Utilisateur->save();
            return $Utilisateur;
        }catch (\Exception $exception){
            throw new \Exception($exception->getMessage());
        }
    }

    //fonction pour lister tous les utilisateurs
    public static function get_all_users ()
    {
        try {
            $users = DB::table('users')->get();
            return $users;
        }catch (\Exception $exception){
            throw new \Exception($exception->getMessage());
        }
    }
    use HasFactory;
}
