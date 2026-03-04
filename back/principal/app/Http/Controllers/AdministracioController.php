<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;

class AdministracioController extends Controller
{
    public function getEstadistiques()
    {
        $totalEstudiantes = DB::table('usuaris')->where('rol', 'Alumne')->count();

        $docentesActivos = DB::table('usuaris')->where('rol', 'Profe')->count();

        $totalRegistres = DB::table('assistencies')->count();

        $asistenciaMedia = 0;

        if ($totalRegistres > 0) {
        $presents = DB::table('assistencies')
            ->whereIn('Estat', ['Assistit', 'Retard'])
            ->count();

        $asistenciaMedia = ($presents / $totalRegistres) * 100;
        } else {
        
        }

        return response()->json([
            'total_estudiantes' => $totalEstudiantes,
            'docentes_activos' => $docentesActivos,
            'asistencia_media' => round($asistenciaMedia, 1)
        ]);
    }
}