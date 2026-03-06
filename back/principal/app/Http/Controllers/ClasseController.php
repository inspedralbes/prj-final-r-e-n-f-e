<?php

namespace App\Http\Controllers;

use App\Models\Classe;
use App\Models\Usuari;
use App\Models\Inscrit;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ClasseController extends Controller
{
    /**
     * Display a listing of all classes.
     */
    public function index()
    {
        return response()->json([
            'success' => true,
            'data' => Classe::with(['curs', 'aula'])->get(),
            'message' => 'Classes obtingudes correctament'
        ], Response::HTTP_OK);
    }

    /**
     * Store a newly created class.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'curs_id' => 'required|exists:cursos,id',
            'aula_id' => 'nullable|exists:aules,id',
        ]);

        $classe = Classe::create($validated);

        return response()->json([
            'success' => true,
            'data' => $classe->load(['curs', 'aula']),
            'message' => 'Classe creada correctament'
        ], Response::HTTP_CREATED);
    }

    /**
     * Display the specified class.
     */
    public function show($id)
    {
        $classe = Classe::with(['curs', 'aula'])->find($id);

        if (!$classe) {
            return response()->json([
                'success' => false,
                'message' => 'Classe no trobada'
            ], Response::HTTP_NOT_FOUND);
        }

        return response()->json([
            'success' => true,
            'data' => $classe,
            'message' => 'Classe obtinguda correctament'
        ], Response::HTTP_OK);
    }

    /**
     * Update the specified class.
     */
    public function update(Request $request, $id)
    {
        $classe = Classe::find($id);

        if (!$classe) {
            return response()->json([
                'success' => false,
                'message' => 'Classe no trobada'
            ], Response::HTTP_NOT_FOUND);
        }

        $validated = $request->validate([
            'nom' => 'sometimes|required|string|max:255',
            'curs_id' => 'sometimes|required|exists:cursos,id',
            'aula_id' => 'nullable|exists:aules,id',
        ]);

        $classe->update($validated);

        return response()->json([
            'success' => true,
            'data' => $classe->load(['curs', 'aula']),
            'message' => 'Classe actualitzada correctament'
        ], Response::HTTP_OK);
    }

    /**
     * Remove the specified class.
     */
    public function destroy($id)
    {
        $classe = Classe::find($id);

        if (!$classe) {
            return response()->json([
                'success' => false,
                'message' => 'Classe no trobada'
            ], Response::HTTP_NOT_FOUND);
        }

        $classe->delete();

        return response()->json([
            'success' => true,
            'message' => 'Classe eliminada correctament'
        ], Response::HTTP_OK);
    }

    /**
     * Obte la classe on l'usuari es tutor.
     */
    public function obtenirClasseTutor($idTutor)
    {
        $classe = Classe::with(['curs', 'aula'])->where('id_tutor', $idTutor)->first();

        if (!$classe) {
            return response()->json([
                'success' => false,
                'message' => 'Aquest usuari no és tutor de cap classe.'
            ], Response::HTTP_NOT_FOUND);
        }

        return response()->json([
            'success' => true,
            'data' => $classe,
            'message' => 'Classe del tutor obtinguda correctament.'
        ], Response::HTTP_OK);
    }

    /**
     * Assigna alumnes a una classe i els inscriu a totes les assignatures d'aquesta classe.
     */
    public function assignarAlumnes(Request $peticio)
    {
        $dadesValidades = $peticio->validate([
            'classe_id' => 'required|exists:classes,id',
            'emails' => 'required|array|min:1',
        ]);

        // Obtenir la classe amb els seus horaris associats
        $classe = Classe::with('horaris')->find($dadesValidades['classe_id']);

        if (!$classe) {
            return response()->json([
                'success' => false,
                'message' => 'Classe no trobada'
            ], Response::HTTP_NOT_FOUND);
        }

        // Obtenir totes les assignatures úniques a partir dels horaris de la classe
        $idsAssignatures = $classe->horaris()
            ->pluck('id_assig')
            ->unique()
            ->toArray();

        if (empty($idsAssignatures)) {
            return response()->json([
                'success' => false,
                'message' => 'La classe no té assignatures associades al seu horari'
            ], Response::HTTP_BAD_REQUEST);
        }

        // Cercar alumnes pels correus electrònics proporcionats
        $alumnes = Usuari::whereIn('email', $dadesValidades['emails'])
            ->where('rol', 'Alumne')
            ->get();

        if ($alumnes->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'Cap alumne trobat amb els correus proporcionats'
            ], Response::HTTP_NOT_FOUND);
        }

        $comptadorAssignats = 0;
        $comptadorInscripcions = 0;
        $errors = [];

        foreach ($alumnes as $alumne) {
            // Assignar l'alumne a la classe (actualitzar id_classe)
            if ($alumne->id_classe !== $classe->id) {
                $alumne->update(['id_classe' => $classe->id]);
                $comptadorAssignats++;
            }

            // Inscriure l'alumne a totes les assignatures de la classe
            foreach ($idsAssignatures as $idAssignatura) {
                // Comprovar si ja està inscrit a l'assignatura
                $jaExisteix = Inscrit::where('id_alumne', $alumne->id)
                    ->where('id_assignatura', $idAssignatura)
                    ->exists();

                if (!$jaExisteix) {
                    try {
                        Inscrit::create([
                            'id_alumne' => $alumne->id,
                            'id_assignatura' => $idAssignatura,
                        ]);
                        $comptadorInscripcions++;
                    } catch (\Exception $e) {
                        $errors[] = "Error en inscriure {$alumne->email} a l'assignatura {$idAssignatura}: " . $e->getMessage();
                    }
                }
            }
        }

        return response()->json([
            'success' => true,
            'data' => [
                'alumnes_assignats' => $comptadorAssignats,
                'inscripcions_creades' => $comptadorInscripcions,
                'alumnes_processats' => $alumnes->count(),
                'assignatures_totals' => count($idsAssignatures),
            ],
            'errors' => $errors,
            'message' => 'Alumnes assignats i inscrits correctament'
        ], Response::HTTP_OK);
    }
}
