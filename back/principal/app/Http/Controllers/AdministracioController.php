<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdministracioController extends Controller
{
    public function getEstadistiques()
    {
        $totalEstudiantes = DB::table('usuaris')->where('Rol', 'Alumne')->count();

        $docentesActivos = DB::table('usuaris')->where('Rol', 'Profe')->count();

        $asistenciaMedia = 92.8;

        return response()->json([
            'total_estudiantes' => $totalEstudiantes,
            'docentes_activos' => $docentesActivos,
            'asistencia_media' => $asistenciaMedia
        ]);
    }
}