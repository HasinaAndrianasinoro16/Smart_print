<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class Service_controller extends Controller
{
    //controller pour creer un service
    public function save_service(Request $request)
    {
        try {
            $request->validate([
                'designation' => 'required',
                'prix' => 'required',
            ]);
            $service = service::create_service($request->input('designation'), $request->input('prix'));
            return response()->json($service);
        }catch (\Exception $exception){
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    //controller pour modifier un service
    public function update_service(Request $request,$id){
        try {
            $service = service::update_service($id,$request->input('designation'), $request->input('prix'));
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

    //controller pour inserer servicefacture
    public function insert_servicefacture(Request $request)
    {
        try {
            $request->validate([
                'facture' => 'required',
                'designation' => 'required',
                'prix' => 'required',
            ]);

            $service = Service::service_facture(
                $request->input('facture'),
                $request->input('designation'),
                $request->input('prix')
            );

            return response()->json($service);

        }catch (\Exception $exception){
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    //controller pour recuperer les services d'une facture
    public function servicefacture_by_idFacture($facture_id)
    {
        try {
            $detail = Service::service_facture_idFacture($facture_id);
            return response()->json($detail);
        }catch (\Exception $exception){
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }
}
