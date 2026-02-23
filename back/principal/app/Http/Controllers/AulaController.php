<?php

namespace App\Http\Controllers;

use App\Models\Aula;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class AulaController extends Controller
{
    /**
     * Display a listing of all classrooms.
     */
    public function index()
    {
        return response()->json([
            'success' => true,
            'data' => Aula::all(),
            'message' => 'Aules obtingudes correctament'
        ], Response::HTTP_OK);
    }

    /**
     * Store a newly created classroom.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'numero' => 'required|string|unique:aules,numero',
            'capacitat' => 'required|integer|min:1',
            'ubicacio' => 'required|string|max:255',
        ]);

        $aula = Aula::create($validated);

        return response()->json([
            'success' => true,
            'data' => $aula,
            'message' => 'Aula creada correctament'
        ], Response::HTTP_CREATED);
    }

    /**
     * Display the specified classroom.
     */
    public function show($id)
    {
        $aula = Aula::find($id);

        if (!$aula) {
            return response()->json([
                'success' => false,
                'message' => 'Aula no trobada'
            ], Response::HTTP_NOT_FOUND);
        }

        return response()->json([
            'success' => true,
            'data' => $aula,
            'message' => 'Aula obtinguda correctament'
        ], Response::HTTP_OK);
    }

    /**
     * Update the specified classroom.
     */
    public function update(Request $request, $id)
    {
        $aula = Aula::find($id);

        if (!$aula) {
            return response()->json([
                'success' => false,
                'message' => 'Aula no trobada'
            ], Response::HTTP_NOT_FOUND);
        }

        $validated = $request->validate([
            'numero' => 'sometimes|required|string|unique:aules,numero,' . $id,
            'capacitat' => 'sometimes|required|integer|min:1',
            'ubicacio' => 'sometimes|required|string|max:255',
        ]);

        $aula->update($validated);

        return response()->json([
            'success' => true,
            'data' => $aula,
            'message' => 'Aula actualitzada correctament'
        ], Response::HTTP_OK);
    }

    /**
     * Remove the specified classroom.
     */
    public function destroy($id)
    {
        $aula = Aula::find($id);

        if (!$aula) {
            return response()->json([
                'success' => false,
                'message' => 'Aula no trobada'
            ], Response::HTTP_NOT_FOUND);
        }

        $aula->delete();

        return response()->json([
            'success' => true,
            'message' => 'Aula eliminada correctament'
        ], Response::HTTP_OK);
    }
}
