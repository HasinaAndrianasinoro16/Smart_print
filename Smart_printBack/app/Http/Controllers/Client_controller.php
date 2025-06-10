<?php

namespace App\Http\Controllers;

use App\Models\Client;
use Illuminate\Http\Request;

class Client_controller extends Controller
{
    //controller pour la liste des clients
    public function get_all_Clients(){
        try {
            $clients = Client::all();
            return response()->json($clients);
        }catch (\Exception $e){
            throw new \Exception($e->getMessage());
        }
    }

    //controller pour ajouter les clients
    public function Form_add_client(Request $request)
    {
        try {
            $request->validate([
                'nom' => 'required|max:255',
                'adresse' => 'required|max:255',
                'nif' =>'required|max:255',
                'email' =>'required|max:255',
                'stat'=> 'required|max:255',
                'telephone' =>'required|max:255',
                'rcs' =>'required|max:255',
            ]);
            $clients = Client::Save_Client(\request('nom'),\request('adresse'),\request('nif'),\request('email'),\request('stat'),\request('telephone'),\request('rcs'));

            return response()->json($clients);
        }catch (\Exception $e){
            throw new \Exception($e->getMessage());
        }
    }

    //controller pour afficher un client par son id
    public function get_client($id){
        try {
            $clients = Client::get_client($id);
            return response()->json($clients);
        }catch (\Exception $e){
            throw new \Exception($e->getMessage());
        }
    }
}
