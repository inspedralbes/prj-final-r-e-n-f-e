<?php

namespace App\Http\Controllers;

use App\Models\Imparteix;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ImparteixController extends Controller
{
    public function index()
    {
        return response()->json([
            'success' => true,
            'data' => Imparteix::with(['professor', 'assignatura'])->get(),
            'message' => 'Imparticions obtingudes correctament'
        ], Response::HTTP_OK);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'id_profe' => 'required|exists:usuaris,id',
            'id_assignatura' => 'required|exists:assignatures,id',
            'titular' => 'required|boolean',
        ]);

        $imparteix = Imparteix::create($validated);

        return response()->json([
            'success' => true,
            'data' => $imparteix->load(['professor', 'assignatura']),
            'message' => 'Impartició creada correctament'
        ], Response::HTTP_CREATED);
    }

    public function show($id)
    {
        $imparteix = Imparteix::with(['professor', 'assignatura'])->find($id);

        if (!$imparteix) {
            return response()->json([
                'success' => false,
                'message' => 'Impartició no trobada'
            ], Response::HTTP_NOT_FOUND);
        }

        return response()->json([
            'success' => true,
            'data' => $imparteix,
            'message' => 'Impartició obtinguda correctament'
        ], Response::HTTP_OK);
    }

    public function update(Request $request, $id)
    {
        $imparteix = Imparteix::find($id);

        if (!$imparteix) {
            return response()->json([
                'success' => false,
                'message' => 'Impartició no trobada'
            ], Response::HTTP_NOT_FOUND);
        }

        $validated = $request->validate([
            'id_profe' => 'sometimes|required|exists:usuaris,id',
            'id_assignatura' => 'sometimes|required|exists:assignatures,id',
            'titular' => 'sometimes|required|boolean',
        ]);

        $imparteix->update($validated);

        return response()->json([
            'success' => true,
            'data' => $imparteix->load(['professor', 'assignatura']),
            'message' => 'Impartició actualitzada correctament'
        ], Response::HTTP_OK);
    }

    public function destroy($id)
    {
        $imparteix = Imparteix::find($id);

        if (!$imparteix) {
            return response()->json([
                'success' => false,
                'message' => 'Impartició no trobada'
            ], Response::HTTP_NOT_FOUND);
        }

        $imparteix->delete();

        return response()->json([
            'success' => true,
            'message' => 'Impartició eliminada correctament'
        ], Response::HTTP_OK);
    }
}
