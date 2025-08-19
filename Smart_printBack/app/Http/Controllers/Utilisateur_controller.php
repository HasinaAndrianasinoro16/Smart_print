<?php

namespace App\Http\Controllers;

use App\Models\Utilisateur;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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

    //controller pour modifier un utilisateur
    public function update_user(Request $request,$id)
    {
        try {
            $request->validate([
                'name' => 'required',
                'email' => 'required',
                'password' => 'required',
                'role' => 'required',
            ]);

            $user = Utilisateur::Update_users($id,$request->input('name'),$request->input('email'),$request->input('password'),$request->input('role'));
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

    //controller pour recuperer un utilisateur par son id
    public function get_user_by_id($id){
        try {
            $users = DB::table('users')->where('id',$id)->get();
            return response()->json($users);
        }catch (\Exception $exception){
            throw new \Exception($exception->getMessage());
        }
    }
}
