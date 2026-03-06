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
use App\Http\Controllers\AuthController;

Route::prefix('v1')->group(function (): void {

    // Rutes d'autenticació (sense autenticació requerida)
    Route::post('auth/google/redirect', [AuthController::class, 'googleRedirectUrl']);
    Route::post('auth/google/callback', [AuthController::class, 'googleCallback']);
    Route::post('auth/login-temporal', [AuthController::class, 'loginTemporal']);

    // Rutes d'Usuaris
    Route::apiResource('usuaris', UsuariController::class);

    // Rutes de Cursos
    Route::apiResource('cursos', \App\Http\Controllers\CursController::class)->only(['index']);

    // Rutes de Classes
    Route::get('classes/tutor/{idTutor}', [ClasseController::class, 'obtenirClasseTutor']);
    Route::apiResource('classes', ClasseController::class);
    Route::post('classes/assignarAlumnes', [ClasseController::class, 'assignarAlumnes']);

    // Rutes d'Assignatures
    Route::apiResource('administracio', AdministracioController::class);
        Route::get('/administracio/stats', [AdministracioController::class, 'getEstadistiques']);
    
    Route::apiResource('assignatures', AssignaturaController::class);

        Route::get('assistencies/alumne/{alumneId}', action: [AssistenciaController::class, 'assistenciaPerAlumne']);
        Route::get('assistencia/assignatura/{id}', [AssistenciaController::class, 'perAssignatura']);
        Route::post('assistencies/generar', [AssistenciaController::class, 'generar']);
    Route::apiResource('assistencies', AssistenciaController::class);
   
    Route::apiResource('aules', AulaController::class);

    Route::apiResource('classes', ClasseController::class);
        Route::post('classes/assignarAlumnes', [ClasseController::class, 'assignarAlumnes']);

    Route::apiResource('cursos', CursController::class);

    // Rutes d'Horaris
    Route::post('horaris/granular', [HorariController::class, 'actualitzarHorariGranular']);
    Route::apiResource('horaris', HorariController::class);

    // Rutes d'Imparteix
    Route::apiResource('imparteix', ImparteixController::class);

    // Rutes d'Assistència
    Route::apiResource('assistencies', AssistenciaController::class);
    Route::get('assistencies/alumne/{alumneId}', action: [AssistenciaController::class, 'assistenciaPerAlumne']);
    Route::post('assistencies/generar', [AssistenciaController::class, 'generar']);
    Route::get('assistencia/assignatura/{id}', [AssistenciaController::class, 'perAssignatura']);

    // Rutes de Justificants
    Route::apiResource('inscrits', InscritController::class);

    Route::apiResource('justificants', JustificantController::class);

    Route::apiResource('periodes', PeriodeController::class);

    Route::apiResource('usuaris', UsuariController::class);
});
