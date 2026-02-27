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
        if ($periode) {
            $periode->update($request->all());
            return response()->json(['missatge' => 'Període actualitzat!', 'periode' => $periode], 200);
        }
        return response()->json(['missatge' => 'Període no trobat'], 404);
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