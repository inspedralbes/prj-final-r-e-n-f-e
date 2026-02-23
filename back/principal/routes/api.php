<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UsuariController;
use App\Http\Controllers\ClasseController;
use App\Http\Controllers\AssignaturaController;
use App\Http\Controllers\AulaController;
use App\Http\Controllers\InscritController;
use App\Http\Controllers\HorariController;
use App\Http\Controllers\ImparteixController;
use App\Http\Controllers\AssistenciaController;
use App\Http\Controllers\JustificantController;
use App\Http\Controllers\CursController;

Route::prefix('api/v1')->group(function () {

    // Usuaris routes
    Route::apiResource('usuaris', UsuariController::class);

    // Classes routes
    Route::apiResource('classes', ClasseController::class);

    // Assignatures routes
    Route::apiResource('assignatures', AssignaturaController::class);

    // Aules routes
    Route::apiResource('aules', AulaController::class);

    // Inscrits routes
    Route::apiResource('inscrits', InscritController::class);

    // Horaris routes
    Route::apiResource('horaris', HorariController::class);

    // Imparteix routes
    Route::apiResource('imparteix', ImparteixController::class);

    // Assistencia routes
    Route::apiResource('assistencies', AssistenciaController::class);

    // Justificants routes
    Route::apiResource('justificants', JustificantController::class);

    // Rutes per als Cursos
    Route::apiResource('cursos', CursController::class);

});
