<?php

namespace App\Http\Controllers;

use App\Models\Inscrit;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class InscritController extends Controller
{
    public function index()
    {
        return response()->json([
            'success' => true,
            'data' => Inscrit::with(['alumne', 'assignatura'])->get(),
            'message' => 'Inscrits obtinguts correctament'
        ], Response::HTTP_OK);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'id_alumne' => 'required|exists:usuaris,id',
            'id_assignatura' => 'required|exists:assignatures,id',
        ]);

        $inscrit = Inscrit::create($validated);

        return response()->json([
            'success' => true,
            'data' => $inscrit->load(['alumne', 'assignatura']),
            'message' => 'Inscrit creat correctament'
        ], Response::HTTP_CREATED);
    }

    public function show($id)
    {
        $inscrit = Inscrit::with(['alumne', 'assignatura'])->find($id);

        if (!$inscrit) {
            return response()->json([
                'success' => false,
                'message' => 'Inscrit no trobat'
            ], Response::HTTP_NOT_FOUND);
        }

        return response()->json([
            'success' => true,
            'data' => $inscrit,
            'message' => 'Inscrit obtingut correctament'
        ], Response::HTTP_OK);
    }

    public function update(Request $request, $id)
    {
        $inscrit = Inscrit::find($id);

        if (!$inscrit) {
            return response()->json([
                'success' => false,
                'message' => 'Inscrit no trobat'
            ], Response::HTTP_NOT_FOUND);
        }

        $validated = $request->validate([
            'id_alumne' => 'sometimes|required|exists:usuaris,id',
            'id_assignatura' => 'sometimes|required|exists:assignatures,id',
        ]);

        $inscrit->update($validated);

        return response()->json([
            'success' => true,
            'data' => $inscrit->load(['alumne', 'assignatura']),
            'message' => 'Inscrit actualitzat correctament'
        ], Response::HTTP_OK);
    }

    public function destroy($id)
    {
        $inscrit = Inscrit::find($id);

        if (!$inscrit) {
            return response()->json([
                'success' => false,
                'message' => 'Inscrit no trobat'
            ], Response::HTTP_NOT_FOUND);
        }

        $inscrit->delete();

        return response()->json([
            'success' => true,
            'message' => 'Inscrit eliminat correctament'
        ], Response::HTTP_OK);
    }
}
