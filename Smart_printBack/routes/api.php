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
    Route::post('/add',[\App\Http\Controllers\Boncommande_controller::class,'form_BonCommande']);
});

