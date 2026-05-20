<?php

namespace App\Http\Controllers;

use App\Models\Curs;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class CursController extends Controller
{
    /**
     * Display a listing of all courses.
     */
    public function index()
    {
        return response()->json([
            'success' => true,
            'data' => Curs::with(['tutor', 'periode'])->get(),
            'message' => 'Cursos obtinguts correctament'
        ], Response::HTTP_OK);
    }

    /**
     * Store a newly created course.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'tipus' => 'required|in:GM,GS',
            'nom' => 'required|string|max:255',
            'id_tutor' => 'nullable|exists:usuaris,id',
            'id_periode' => 'nullable|exists:periodes,id',
        ]);

        $curs = Curs::create($validated);

        return response()->json([
            'success' => true,
            'data' => $curs->load(['tutor', 'periode']),
            'message' => 'Curs creat correctament'
        ], Response::HTTP_CREATED);
    }

    /**
     * Display the specified course.
     */
    public function show($id)
    {
        $curs = Curs::with(['tutor', 'periode'])->find($id);

        if (!$curs) {
            return response()->json([
                'success' => false,
                'message' => 'Curs no trobat'
            ], Response::HTTP_NOT_FOUND);
        }

        return response()->json([
            'success' => true,
            'data' => $curs,
            'message' => 'Curs obtingut correctament'
        ], Response::HTTP_OK);
    }

    /**
     * Update the specified course.
     */
    public function update(Request $request, $id)
    {
        $curs = Curs::find($id);

        if (!$curs) {
            return response()->json([
                'success' => false,
                'message' => 'Curs no trobat'
            ], Response::HTTP_NOT_FOUND);
        }

        $validated = $request->validate([
            'tipus' => 'sometimes|required|in:GM,GS',
            'nom' => 'sometimes|required|string|max:255',
            'id_tutor' => 'nullable|exists:usuaris,id',
            'id_periode' => 'nullable|exists:periodes,id',
        ]);

        $curs->update($validated);

        return response()->json([
            'success' => true,
            'data' => $curs->load(['tutor', 'periode']),
            'message' => 'Curs actualitzat correctament'
        ], Response::HTTP_OK);
    }

    /**
     * Remove the specified course.
     */
    public function destroy($id)
    {
        $curs = Curs::find($id);

        if (!$curs) {
            return response()->json([
                'success' => false,
                'message' => 'Curs no trobat'
            ], Response::HTTP_NOT_FOUND);
        }

        $curs->delete();

        return response()->json([
            'success' => true,
            'message' => 'Curs eliminat correctament'
        ], Response::HTTP_OK);
    }
}
