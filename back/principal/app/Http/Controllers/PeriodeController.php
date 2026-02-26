<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Periode;

class PeriodeController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'trimestre_1_ini' => 'required|date',
            'trimestre_1_fi'  => 'required|date|after:trimestre_1_ini',
            'trimestre_2_ini' => 'required|date',
            'trimestre_2_fi'  => 'required|date|after:trimestre_2_ini',
            'trimestre_3_ini' => 'required|date',
            'trimestre_3_fi'  => 'required|date|after:trimestre_3_ini',
        ]);

        $periode = Periode::create($request->all());

        return response()->json([
            'missatge' => 'Periode creat correctament!',
            'periode' => $periode
        ], 201);
    }
}