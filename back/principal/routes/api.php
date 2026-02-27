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
use App\Http\Controllers\AdministracioController;
use App\Http\Controllers\PeriodeController;

Route::prefix('v1')->group(function (): void {

    // Usuaris routes
    Route::apiResource('usuaris', UsuariController::class);

    // Classes routes
    Route::apiResource('classes', ClasseController::class);
    Route::post('classes/assignarAlumnes', [ClasseController::class, 'assignarAlumnes']);

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
    Route::post('assistencies/generar', [AssistenciaController::class, 'generar']);

    // Justificants routes
    Route::apiResource('justificants', JustificantController::class);

    // Rutes per als Cursos
    Route::apiResource('cursos', CursController::class);

    // Ruta per les estadistiques admin
    Route::get('/administracio/stats', [AdministracioController::class, 'getEstadistiques']);

    // Ruta per als Periodes
    Route::apiResource('periodes', PeriodeController::class);

});
