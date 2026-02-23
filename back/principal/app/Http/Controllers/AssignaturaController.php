<?php

namespace App\Http\Controllers;

use App\Models\Assignatura;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class AssignaturaController extends Controller
{
    /**
     * Display a listing of all subjects.
     */
    public function index()
    {
        return response()->json([
            'success' => true,
            'data' => Assignatura::all(),
            'message' => 'Assignatures obtingudes correctament'
        ], Response::HTTP_OK);
    }

    /**
     * Store a newly created subject.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'codi' => 'required|string|unique:assignatures,codi',
            'hores' => 'required|integer|min:1',
        ]);

        $assignatura = Assignatura::create($validated);

        return response()->json([
            'success' => true,
            'data' => $assignatura,
            'message' => 'Assignatura creada correctament'
        ], Response::HTTP_CREATED);
    }

    /**
     * Display the specified subject.
     */
    public function show($id)
    {
        $assignatura = Assignatura::find($id);

        if (!$assignatura) {
            return response()->json([
                'success' => false,
                'message' => 'Assignatura no trobada'
            ], Response::HTTP_NOT_FOUND);
        }

        return response()->json([
            'success' => true,
            'data' => $assignatura,
            'message' => 'Assignatura obtinguda correctament'
        ], Response::HTTP_OK);
    }

    /**
     * Update the specified subject.
     */
    public function update(Request $request, $id)
    {
        $assignatura = Assignatura::find($id);

        if (!$assignatura) {
            return response()->json([
                'success' => false,
                'message' => 'Assignatura no trobada'
            ], Response::HTTP_NOT_FOUND);
        }

        $validated = $request->validate([
            'nom' => 'sometimes|required|string|max:255',
            'codi' => 'sometimes|required|string|unique:assignatures,codi,' . $id,
            'hores' => 'sometimes|required|integer|min:1',
        ]);

        $assignatura->update($validated);

        return response()->json([
            'success' => true,
            'data' => $assignatura,
            'message' => 'Assignatura actualitzada correctament'
        ], Response::HTTP_OK);
    }

    /**
     * Remove the specified subject.
     */
    public function destroy($id)
    {
        $assignatura = Assignatura::find($id);

        if (!$assignatura) {
            return response()->json([
                'success' => false,
                'message' => 'Assignatura no trobada'
            ], Response::HTTP_NOT_FOUND);
        }

        $assignatura->delete();

        return response()->json([
            'success' => true,
            'message' => 'Assignatura eliminada correctament'
        ], Response::HTTP_OK);
    }
}
