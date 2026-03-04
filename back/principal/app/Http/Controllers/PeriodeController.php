<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Periode;

class PeriodeController extends Controller
{
    public function store(Request $request)
    {
        $regles = [
            'trimestre_1_ini' => 'required|date',
            'trimestre_1_fi'  => 'required|date|after:trimestre_1_ini',
            'trimestre_2_ini' => 'required|date',
            'trimestre_2_fi'  => 'required|date|after:trimestre_2_ini',
            'trimestre_3_ini' => 'required|date',
            'trimestre_3_fi'  => 'required|date|after:trimestre_3_ini',
        ];

        $missatges = [
            'trimestre_1_fi.after' => 'La data de fi del 1r trimestre ha de ser posterior a la data d\'inici.',
            'trimestre_2_fi.after' => 'La data de fi del 2n trimestre ha de ser posterior a la data d\'inici.',
            'trimestre_3_fi.after' => 'La data de fi del 3r trimestre ha de ser posterior a la data d\'inici.',
        ];

        $validated = $request->validate($regles, $missatges);

        $periode = Periode::create($validated);

        return response()->json([
            'missatge' => 'Periode creat correctament!',
            'periode' => $periode
        ], 201);
    }


    public function index()
    {
        return response()->json(Periode::all(), 200);
    }

    public function show($id)
    {
        $periode = Periode::find($id);
        if ($periode) {
            return response()->json($periode, 200);
        }
        return response()->json(['missatge' => 'Període no trobat'], 404);
    }

    public function update(Request $request, $id)
    {
        $periode = Periode::find($id);
        
        if (!$periode) {
            return response()->json(['missatge' => 'Període no trobat'], 404);
        }

        $regles = [
            'trimestre_1_ini' => 'required|date',
            'trimestre_1_fi'  => 'required|date|after:trimestre_1_ini',
            'trimestre_2_ini' => 'required|date',
            'trimestre_2_fi'  => 'required|date|after:trimestre_2_ini',
            'trimestre_3_ini' => 'required|date',
            'trimestre_3_fi'  => 'required|date|after:trimestre_3_ini',
        ];

        $missatges = [
            'trimestre_1_fi.after' => 'La data de fi del 1r trimestre ha de ser posterior a la data d\'inici.',
            'trimestre_2_fi.after' => 'La data de fi del 2n trimestre ha de ser posterior a la data d\'inici.',
            'trimestre_3_fi.after' => 'La data de fi del 3r trimestre ha de ser posterior a la data d\'inici.',
        ];

        $validated = $request->validate($regles, $missatges);

        $periode->update($validated);
        
        return response()->json(['missatge' => 'Període actualitzat!', 'periode' => $periode], 200);
    }

    public function destroy($id)
    {
        $periode = Periode::find($id);
        if ($periode) {
            $periode->delete();
            return response()->json(['missatge' => 'Període eliminat correctament'], 200);
        }
        return response()->json(['missatge' => 'Període no trobat'], 404);
    }
}