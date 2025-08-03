<?php

namespace App\Http\Controllers;

use App\Models\Utilisateur;
use Illuminate\Http\Request;

class Utilisateur_controller extends Controller
{
    //controller pour enregistrer un utilisateur
    public function save_user(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required',
                'email' => 'required',
                'password' => 'required',
                'role' => 'required',
            ]);

            $user = Utilisateur::Save_users(
                $request->input('name'),
                $request->input('email'),
                $request->input('password'),
                $request->input('role'),
            );

            return response()->json($user);

        }catch (\Exception $exception){
            throw new \Exception($exception->getMessage());
        }
    }


    //controller pour lister les utilisateurs
    public function get_all_users()
    {
        try {
            $users = Utilisateur::get_all_users();
            return response()->json($users);
        }catch (\Exception $exception){
            throw new \Exception($exception->getMessage());
        }
    }
}
