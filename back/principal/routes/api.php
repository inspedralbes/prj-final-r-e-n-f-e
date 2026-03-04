<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AdministracioController;
use App\Http\Controllers\AssignaturaController;
use App\Http\Controllers\AssistenciaController;
use App\Http\Controllers\AulaController;
use App\Http\Controllers\ClasseController;
use App\Http\Controllers\CursController;
use App\Http\Controllers\HorariController;
use App\Http\Controllers\ImparteixController;
use App\Http\Controllers\InscritController;
use App\Http\Controllers\JustificantController;
use App\Http\Controllers\PeriodeController;
use App\Http\Controllers\UsuariController;

Route::prefix('v1')->group(function (): void {

    Route::apiResource('administracio', AdministracioController::class);
        Route::get('/administracio/stats', [AdministracioController::class, 'getEstadistiques']);
    
    Route::apiResource('assignatures', AssignaturaController::class);

    Route::apiResource('assistencies', AssistenciaController::class);
        Route::get('assistencies/alumne/{alumneId}', action: [AssistenciaController::class, 'assistenciaPerAlumne']);
        Route::get('assistencia/assignatura/{id}', [AssistenciaController::class, 'perAssignatura']);
        Route::post('assistencies/generar', [AssistenciaController::class, 'generar']);
   
    Route::apiResource('aules', AulaController::class);

    Route::apiResource('classes', ClasseController::class);
        Route::post('classes/assignarAlumnes', [ClasseController::class, 'assignarAlumnes']);

    Route::apiResource('cursos', CursController::class);

    Route::apiResource('horaris', HorariController::class);

    Route::apiResource('imparteix', ImparteixController::class);

    Route::apiResource('inscrits', InscritController::class);

    Route::apiResource('justificants', JustificantController::class);

    Route::apiResource('periodes', PeriodeController::class);

    Route::apiResource('usuaris', UsuariController::class);

});
