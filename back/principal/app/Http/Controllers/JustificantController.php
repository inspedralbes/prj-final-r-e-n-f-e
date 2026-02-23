<?php

namespace App\Http\Controllers;

use App\Models\Justificant;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class JustificantController extends Controller
{
    public function index()
    {
        return response()->json([
            'success' => true,
            'data' => Justificant::with(['alumne', 'assignaturaInici', 'assignaturaFi'])->get(),
            'message' => 'Justificants obtinguts correctament'
        ], Response::HTTP_OK);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'id_alum' => 'required|exists:usuaris,id',
            'id_ass_ini' => 'required|exists:assistencies,id',
            'id_ass_fi' => 'required|exists:assistencies,id',
            'comentari' => 'nullable|string',
            'document' => 'nullable|string',
            'acceptada' => 'required|boolean',
        ]);

        $justificant = Justificant::create($validated);

        return response()->json([
            'success' => true,
            'data' => $justificant->load(['alumne', 'assignaturaInici', 'assignaturaFi']),
            'message' => 'Justificant creat correctament'
        ], Response::HTTP_CREATED);
    }

    public function show($id)
    {
        $justificant = Justificant::with(['alumne', 'assignaturaInici', 'assignaturaFi'])->find($id);

        if (!$justificant) {
            return response()->json([
                'success' => false,
                'message' => 'Justificant no trobat'
            ], Response::HTTP_NOT_FOUND);
        }

        return response()->json([
            'success' => true,
            'data' => $justificant,
            'message' => 'Justificant obtingut correctament'
        ], Response::HTTP_OK);
    }

    public function update(Request $request, $id)
    {
        $justificant = Justificant::find($id);

        if (!$justificant) {
            return response()->json([
                'success' => false,
                'message' => 'Justificant no trobat'
            ], Response::HTTP_NOT_FOUND);
        }

        $validated = $request->validate([
            'id_alum' => 'sometimes|required|exists:usuaris,id',
            'id_ass_ini' => 'sometimes|required|exists:assistencies,id',
            'id_ass_fi' => 'sometimes|required|exists:assistencies,id',
            'comentari' => 'nullable|string',
            'document' => 'nullable|string',
            'acceptada' => 'sometimes|required|boolean',
        ]);

        $justificant->update($validated);

        return response()->json([
            'success' => true,
            'data' => $justificant->load(['alumne', 'assignaturaInici', 'assignaturaFi']),
            'message' => 'Justificant actualitzat correctament'
        ], Response::HTTP_OK);
    }

    public function destroy($id)
    {
        $justificant = Justificant::find($id);

        if (!$justificant) {
            return response()->json([
                'success' => false,
                'message' => 'Justificant no trobat'
            ], Response::HTTP_NOT_FOUND);
        }

        $justificant->delete();

        return response()->json([
            'success' => true,
            'message' => 'Justificant eliminat correctament'
        ], Response::HTTP_OK);
    }
}
