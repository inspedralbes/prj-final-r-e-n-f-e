<?php

namespace App\Http\Controllers;

use App\Models\Curs; 
use Illuminate\Http\Request;

class CursController extends Controller
{

    public function index()
    {
        $cursos = Curs::all(); 
        
        return response()->json($cursos);
    }

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

    public function destroy($id)
    {
        $curs = Curs::find($id); 

        if ($curs) {
            $curs->delete(); 
            return response()->json(['missatge' => 'Curs eliminat correctament!'], 200);
        }

        
        return response()->json(['missatge' => 'Curs no trobat'], 404);
    }



}