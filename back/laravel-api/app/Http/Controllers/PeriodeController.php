<?php

namespace App\Http\Controllers;

use App\Models\Periode;
use Illuminate\Http\Request;

class PeriodeController extends Controller
{
    /**
     * Mostra una llista del recurs.
     */
    public function index()
    {
        $periodes = Periode::all();
        return response()->json($periodes);
    }

    /**
     * Emmagatzema un recurs acabat de crear.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'actiu' => 'boolean',
            'trimestre_1_ini' => 'nullable|date',
            'trimestre_1_fi' => 'nullable|date|after_or_equal:trimestre_1_ini',
            'trimestre_2_ini' => 'nullable|date',
            'trimestre_2_fi' => 'nullable|date|after_or_equal:trimestre_2_ini',
            'trimestre_3_ini' => 'nullable|date',
            'trimestre_3_fi' => 'nullable|date|after_or_equal:trimestre_3_ini',
        ]);

        $periode = Periode::create($validated);

        return response()->json($periode, 201);
    }

    /**
     * Actualitza el recurs especificat a l'emmagatzematge.
     */
    public function update(Request $request, string $id)
    {
        $periode = Periode::findOrFail($id);

        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'actiu' => 'boolean',
            'trimestre_1_ini' => 'nullable|date',
            'trimestre_1_fi' => 'nullable|date|after_or_equal:trimestre_1_ini',
            'trimestre_2_ini' => 'nullable|date',
            'trimestre_2_fi' => 'nullable|date|after_or_equal:trimestre_2_ini',
            'trimestre_3_ini' => 'nullable|date',
            'trimestre_3_fi' => 'nullable|date|after_or_equal:trimestre_3_ini',
        ]);

        $periode->update($validated);

        return response()->json($periode);
    }

    /**
     * Elimina el recurs especificat.
     */
    public function destroy(string $id)
    {
        $periode = Periode::findOrFail($id);
        $periode->delete();

        return response()->json(null, 204);
    }

    /**
     * Estableix un període com a actiu.
     */
    public function setActiu(string $id)
    {
        // Primer posem tots els periodes a false
        Periode::query()->update(['actiu' => false]);

        // Després posem el seleccionat a true
        $periode = Periode::findOrFail($id);
        $periode->actiu = true;
        $periode->save();

        return response()->json($periode);
    }
}
