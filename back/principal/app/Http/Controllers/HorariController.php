<?php

namespace App\Http\Controllers;

use App\Models\Horari;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class HorariController extends Controller
{
    /**
     * Llista de tots els horaris amb les seves relacions.
     */
    public function index()
    {
        return response()->json([
            'success' => true,
            'data' => Horari::with(['assignatura', 'classe', 'aula', 'professor', 'inscrits.alumne'])->get(),
            'message' => 'Horaris obtinguts correctament'
        ], Response::HTTP_OK);
    }

    public function store(Request $peticio)
    {
        $dadesValidades = $peticio->validate([
            'codi_hora' => 'required|string|max:255',
            'id_assig' => 'required|exists:assignatures,id',
            'id_classe' => 'required|exists:classes,id',
            'id_aula' => 'required|exists:aules,id',
            'id_professor' => 'nullable|exists:usuaris,id',
        ]);

        $horari = Horari::create($dadesValidades);

        return response()->json([
            'success' => true,
            'data' => $horari->load(['assignatura', 'classe', 'aula', 'professor']),
            'message' => 'Horari creat correctament'
        ], Response::HTTP_CREATED);
    }

    public function show($id)
    {
        $horari = Horari::with(['assignatura', 'classe', 'aula', 'professor'])->find($id);

        if (!$horari) {
            return response()->json([
                'success' => false,
                'message' => 'Horari no trobat'
            ], Response::HTTP_NOT_FOUND);
        }

        return response()->json([
            'success' => true,
            'data' => $horari,
            'message' => 'Horari obtingut correctament'
        ], Response::HTTP_OK);
    }

    public function update(Request $peticio, $id)
    {
        $horari = Horari::find($id);

        if (!$horari) {
            return response()->json([
                'success' => false,
                'message' => 'Horari no trobat'
            ], Response::HTTP_NOT_FOUND);
        }

        $dadesValidades = $peticio->validate([
            'codi_hora' => 'sometimes|required|string|max:255',
            'id_assig' => 'sometimes|required|exists:assignatures,id',
            'id_classe' => 'sometimes|required|exists:classes,id',
            'id_aula' => 'sometimes|required|exists:aules,id',
            'id_professor' => 'nullable|exists:usuaris,id',
        ]);

        $horari->update($dadesValidades);

        return response()->json([
            'success' => true,
            'data' => $horari->load(['assignatura', 'classe', 'aula', 'professor']),
            'message' => 'Horari actualitzat correctament'
        ], Response::HTTP_OK);
    }

    /**
     * Mètode especial per a la Tasca 3: Desa tota la configuració d'una franja
     * (Assignatura, Aula, Professor i llista d'Alumnes específica).
     */
    public function actualitzarHorariGranular(Request $peticio)
    {
        $dadesValidades = $peticio->validate([
            'codi_hora' => 'required|string',
            'id_classe' => 'required|exists:classes,id',
            'id_assig' => 'required|exists:assignatures,id',
            'id_aula' => 'required|exists:aules,id',
            'id_profe' => 'required|exists:usuaris,id',
            'alumnes_ids' => 'required|array', // IDs dels alumnes seleccionats per aquesta hora
        ]);

        // 1. Busquem si ja existeix l'horari per aquesta classe i hora, o el creem
        $horari = Horari::where('id_classe', $dadesValidades['id_classe'])
            ->where('codi_hora', $dadesValidades['codi_hora'])
            ->first();

        if (!$horari) {
            $horari = new Horari();
            $horari->id_classe = $dadesValidades['id_classe'];
            $horari->codi_hora = $dadesValidades['codi_hora'];
        }

        $horari->id_assig = $dadesValidades['id_assig'];
        $horari->id_aula = $dadesValidades['id_aula'];
        $horari->id_professor = $dadesValidades['id_profe'];
        $horari->save();

        // 2. Gestionem els inscrits (alumnes per franja)
        $idAlumnesNous = $dadesValidades['alumnes_ids'];

        // Eliminem els que ja no hi són (opcionalment, depèn de si volem mantenir historial)
        // Per simplicitat "primitiva", eliminem els que NO estiguin a la nova llista
        \App\Models\Inscrit::where('id_horari', $horari->id)
            ->whereNotIn('id_alumne', $idAlumnesNous)
            ->delete();

        // Afegim els que falten
        foreach ($idAlumnesNous as $idAlumne) {
            \App\Models\Inscrit::updateOrCreate(
                ['id_horari' => $horari->id, 'id_alumne' => $idAlumne],
                ['id_assignatura' => $dadesValidades['id_assig']]
            );
        }

        return response()->json([
            'success' => true,
            'data' => $horari->load(['assignatura', 'aula', 'professor']),
            'message' => 'Configuració de la franja desada correctament'
        ]);
    }

    public function destroy($id)
    {
        $horari = Horari::find($id);

        if (!$horari) {
            return response()->json([
                'success' => false,
                'message' => 'Horari no trobat'
            ], Response::HTTP_NOT_FOUND);
        }

        $horari->delete();

        return response()->json([
            'success' => true,
            'message' => 'Horari eliminat correctament'
        ], Response::HTTP_OK);
    }
}
