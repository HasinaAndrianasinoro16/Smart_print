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

Route::prefix('clients')->group(function () {
    Route::get('/',[\App\Http\Controllers\Client_controller::class,'get_all_Clients']);
    Route::get('/{id}',[\App\Http\Controllers\Client_controller::class,'get_Client']);
    Route::post('/add',[\App\Http\Controllers\Client_controller::class,'Form_add_client']);
    Route::put('/update/{id}', [\App\Http\Controllers\Client_controller::class, 'update']);
    Route::delete('/delete/{id}', [\App\Http\Controllers\Client_controller::class, 'destroy']);
});
