<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

//API Client
Route::prefix('clients')->group(function () {
    Route::get('/',[\App\Http\Controllers\Client_controller::class,'get_all_Clients']);
    Route::get('/{id}',[\App\Http\Controllers\Client_controller::class,'get_Client']);
    Route::post('/add',[\App\Http\Controllers\Client_controller::class,'Form_add_client']);
    Route::put('/update/{id}', [\App\Http\Controllers\Client_controller::class, 'update']);
    Route::put('/delete/{id}', [\App\Http\Controllers\Client_controller::class, 'destroy']);
});

//API factures
Route::prefix('factures')->group(function () {
    Route::get('/',[\App\Http\Controllers\Facture_controller::class,'get_All_Factures']);
    Route::get('/{id}',[\App\Http\Controllers\Facture_controller::class,'get_facture']);
    Route::get('/self/{id}',[\App\Http\Controllers\Facture_controller::class,'get_factures_by_id']);
    Route::post('/add',[\App\Http\Controllers\Facture_controller::class,'Form_add_facture']);
    Route::put('/update/{id}', [\App\Http\Controllers\Facture_controller::class, 'update_facture']);
    Route::put('/delete/{id}', [\App\Http\Controllers\Facture_controller::class, 'delte_facture']);
    Route::get('/get_payer',[\App\Http\Controllers\Facture_controller::class,'get_all_facture_payer']);
    Route::get('/get_facture_statut/{statut}',[\App\Http\Controllers\Facture_controller::class,'get_facture_by_statut']);
    Route::get('/count_facture_statut/{statut}',[\App\Http\Controllers\Facture_controller::class,'count_facture_by_statut']);
    Route::put('/undo/{id}',[\App\Http\Controllers\Facture_controller::class,'undo_facture']);
});

//API sous facture
Route::prefix('sousfactures')->group(function () {
    Route::get('/',[\App\Http\Controllers\Sousfacture_controller::class,'get_All_Sous_Factures']);
    Route::get('/{id_facture}',[\App\Http\Controllers\Sousfacture_controller::class,'get_sous_facture_with_facture']);
    Route::post('/add',[\App\Http\Controllers\Sousfacture_controller::class,'Form_add_Sous_Facture']);
    Route::get('/details/{facture_id}',[\App\Http\Controllers\Sousfacture_controller::class,'get_detail_sousfacture_by_facture']);
});

//API bon de commande
Route::prefix('boncommandes')->group(function () {
    Route::get('/{facture}',[\App\Http\Controllers\Boncommande_controller::class,'get_BonCommande_by_facture']);
    Route::get('get_by_etat/{etat}',[\App\Http\Controllers\Boncommande_controller::class,'get_bon_commande_by_etat']);
    Route::post('/add',[\App\Http\Controllers\Boncommande_controller::class,'form_BonCommande']);
    Route::put('Delete/{id}',[\App\Http\Controllers\Boncommande_controller::class,'Delete_BonCommande']);
    Route::put('/restore/{id}',[\App\Http\Controllers\Boncommande_controller::class,'restore_bon_commande']);
});

//API pour l'email
Route::prefix('email')->group(function (){
    Route::post('/send-facture-mail', [\App\Http\Controllers\MailController::class, 'sendFactureMail']);
});

//API pour produits
Route::prefix('produits')->group(function (){
    Route::get('/',[\App\Http\Controllers\Produit_controller::class,'get_produits']);
    Route::get('/{id}',[\App\Http\Controllers\Produit_controller::class,'get_produit_by_id']);
    Route::post('/add',[\App\Http\Controllers\Produit_controller::class,'save_produit']);
    Route::put('/update/{id}', [\App\Http\Controllers\Produit_controller::class, 'update_produit']);
    Route::put('/delete/{id}', [\App\Http\Controllers\Produit_controller::class, 'delete_produit']);
});

//API pour service
Route::prefix('services')->group(function (){
   Route::get('/',[\App\Http\Controllers\Service_controller::class,'get_service']);
   Route::get('/{id}',[\App\Http\Controllers\Service_controller::class,'get_service_by_id']);
   Route::post('/add',[\App\Http\Controllers\Service_controller::class,'save_service']);
   Route::put('/update/{id}', [\App\Http\Controllers\Service_controller::class, 'update_service']);
   Route::put('/delete/{id}', [\App\Http\Controllers\Service_controller::class, 'delete_service']);
   Route::post('/service-facture',[\App\Http\Controllers\Service_controller::class,'insert_servicefacture']);
   Route::get('/service-facture/{id}',[\App\Http\Controllers\Service_controller::class,'servicefacture_by_idFacture']);
});
