<?php

namespace App\Http\Controllers;

use App\Models\Curs; 
use Illuminate\Http\Request;

class CursController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'nom' => 'required|string',
            'tipus' => 'required|in:GM,GS', 
            'id_tutor' => 'nullable|integer',
            'id_periode' => 'nullable|integer',
        ]);

        $curs = Curs::create([
            'nom' => $request->nom,
            'tipus' => $request->tipus,
            'id_tutor' => $request->id_tutor,
            'id_periode' => $request->id_periode,
        ]);

        return response()->json([
            'missatge' => 'Curs creat correctament!',
            'curs' => $curs
        ], 201);
    }
}