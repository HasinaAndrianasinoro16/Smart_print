<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Illuminate\Http\Request;

class Service_controller extends Controller
{
    //controller pour creer un service
    public function save_service(Request $request)
    {
        try {
            $request->validate([
                'designation' => 'required',
            ]);
            $service = service::create_service($request->input('designation'));
            return response()->json($service);
        }catch (\Exception $exception){
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    //controller pour modifier un service
    public function update_service(Request $request,$id){
        try {
            $service = service::update_service($id,$request->input('designation'));
            return response()->json($service);
        }catch (\Exception $exception){
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    //fonctio pour supprimer un service
    public function delete_service($id){
        try {
            $service = service::delete_service($id);
            return response()->json($service);
        }catch (\Exception $exception){
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    //controller pour recuperer les services
    public function get_service(){
        try {
            $service = service::get_service();
            return response()->json($service);
        }catch (\Exception $exception){
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    //controller pour recuperer
    public function get_service_by_id($id){
        try {
            $service = service::get_service_by_id($id);
            return response()->json($service);
        }catch (\Exception $exception){
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }
}
