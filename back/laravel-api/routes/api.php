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
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CartaFaltesController;

Route::prefix('v1')->group(function (): void {

    // Rutes d'autenticació (sense autenticació requerida)
    Route::post('auth/google/redirect', [AuthController::class, 'googleRedirectUrl']);
    Route::post('auth/google/callback', [AuthController::class, 'googleCallback']);
    Route::post('auth/login-temporal', [AuthController::class, 'loginTemporal']);

    // Rutes d'Usuaris
    Route::get('usuaris/rol/{rol}', [UsuariController::class, 'usuarisPerRol']);
    Route::apiResource('usuaris', UsuariController::class);

    // Rutes de Cursos
    Route::apiResource('cursos', \App\Http\Controllers\CursController::class)->only(['index']);

    // Rutes de Classes
    Route::get('classes/tutor/{idTutor}', [ClasseController::class, 'obtenirClasseTutor']);
    Route::get('classes/{id}/alumnes', [ClasseController::class, 'getAlumnesClasse']);
    Route::post('classes/assignarAlumnes', [ClasseController::class, 'assignarAlumnes']);
    Route::post('classes/treureAlumne', [ClasseController::class, 'treureAlumne']);
    Route::apiResource('classes', ClasseController::class);

    // Rutes d'Assignatures
    Route::apiResource('assignatures', AssignaturaController::class);

    // Rutes d'Aules
    Route::apiResource('aules', AulaController::class);

    // Rutes d'Inscrits
    Route::apiResource('inscrits', InscritController::class);

    // Rutes d'Horaris
    Route::post('horaris/granular', [HorariController::class, 'actualitzarHorariGranular']);
    Route::get('classes/{id}/horaris', [HorariController::class, 'getHorarisClasse']);
    Route::get('horaris/professor/{id}', [HorariController::class, 'getSessionsProfessor']);
    Route::apiResource('horaris', HorariController::class);
    Route::get('/horaris/usuari/{id}', [HorariController::class, 'getHorari']);
    Route::get('/usuaris/{id}/classe-actual', [HorariController::class, 'getClasseActual']);

    // Rutes d'Imparteix
    Route::apiResource('imparteix', ImparteixController::class);

    // Rutes d'Assistència
    Route::get('horaris/{idHorari}/assistencia-setmanal', [AssistenciaController::class, 'assistenciaSetmanalHorari']);
    Route::apiResource('assistencies', AssistenciaController::class);
    Route::get('assistencies/alumne/{alumneId}', action: [AssistenciaController::class, 'assistenciaPerAlumne']);
    Route::post('assistencies/generar', [AssistenciaController::class, 'generar']);
    Route::get('assistencia/assignatura/{id}', [AssistenciaController::class, 'perAssignatura']);

    // Rutes de Justificants
    Route::apiResource('justificants', JustificantController::class);

    // Rutes de Carta de Faltes
    Route::post('carta-faltes/generar', [CartaFaltesController::class, 'generar']);
});
