<?php

namespace App\Http\Controllers;

use App\Models\Assistencia;
use App\Models\Classe;
use App\Models\Assignatura;
use App\Models\Inscrit;
use App\Models\Usuari;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Illuminate\Support\Facades\DB;

class AssistenciaController extends Controller
{
    public function index()
    {
        return response()->json([
            'success' => true,
            'data' => Assistencia::with(['inscripcio.alumne', 'inscripcio.assignatura', 'professor'])->get(),
            'message' => 'Assistències obtingudes correctament'
        ], Response::HTTP_OK);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'id_inscripcio' => 'required|exists:inscrits,id',
            'data' => 'required|date',
            'estat' => 'required|string|in:Assistit,Falta,Retart',
            'id_profe' => 'nullable|exists:usuaris,id',
        ]);

        $assistencia = Assistencia::create($validated);

        return response()->json([
            'success' => true,
            'data' => $assistencia->load(['inscripcio', 'professor']),
            'message' => 'Assistència creada correctament'
        ], Response::HTTP_CREATED);
    }

    public function show($id)
    {
        $assistencia = Assistencia::with(['inscripcio', 'professor'])->find($id);

        if (!$assistencia) {
            return response()->json([
                'success' => false,
                'message' => 'Assistència no trobada'
            ], Response::HTTP_NOT_FOUND);
        }

        return response()->json([
            'success' => true,
            'data' => $assistencia,
            'message' => 'Assistència obtinguda correctament'
        ], Response::HTTP_OK);
    }

    public function update(Request $request, $id)
    {
        $assistencia = Assistencia::find($id);

        if (!$assistencia) {
            return response()->json([
                'success' => false,
                'message' => 'Assistència no trobada'
            ], Response::HTTP_NOT_FOUND);
        }

        $validated = $request->validate([
            'id_inscripcio' => 'sometimes|required|exists:inscrits,id',
            'data' => 'sometimes|required|date',
            'estat' => 'sometimes|required|string|in:Assistit,Falta,Retart',
            'id_profe' => 'sometimes|required|exists:usuaris,id',
        ]);

        $assistencia->update($validated);

        return response()->json([
            'success' => true,
            'data' => $assistencia->load(['inscripcio', 'professor']),
            'message' => 'Assistència actualitzada correctament'
        ], Response::HTTP_OK);
    }

    public function destroy($id)
    {
        $assistencia = Assistencia::find($id);

        if (!$assistencia) {
            return response()->json([
                'success' => false,
                'message' => 'Assistència no trobada'
            ], Response::HTTP_NOT_FOUND);
        }

        $assistencia->delete();

        return response()->json([
            'success' => true,
            'message' => 'Assistència eliminada correctament'
        ], Response::HTTP_OK);
    }
    /**
     * Endpoint
     * POST /api/admin/generar-assistencies
     * BODY:
     *      {
     *      "data_ini": "2026-02-23",
     *      "data_fi": "2026-02-27"
     *      }
     */

    public function generar(Request $peticio)
    {
        $validated = $peticio->validate([
            'data_ini' => 'required|date',
            'data_fi' => 'required|date',
        ]);

        try {
            $dataIni = Carbon::createFromFormat('Y-m-d', $validated['data_ini']);
            $dataFi = Carbon::createFromFormat('Y-m-d', $validated['data_fi']);

            // Mapatge dia setmana a lletra del codi_hora
            $letraDies = [
                'Monday' => 'L',
                'Tuesday' => 'M',
                'Wednesday' => 'X',
                'Thursday' => 'J',
                'Friday' => 'V',
            ];

            // Per a cada classe
            foreach (Classe::all() as $classe) {
                // Obtenir assignatures de la classe
                $assignaturesClasse = $classe->horaris()
                    ->with('assignatura')
                    ->get()
                    ->pluck('assignatura')
                    ->unique('id');

                // Verificar si hi ha projecte per a aquesta classe
                $projecte = $assignaturesClasse->firstWhere('id_classe_projecte', $classe->id);

                // Obtenir alumnes inscrits
                $alumnes = Usuari::whereHas('inscrits', function ($query) use ($assignaturesClasse) {
                    $query->whereIn('id_assignatura', $assignaturesClasse->pluck('id'));
                })->with('inscrits')->get();

                // Per a cada dia del període
                foreach (CarbonPeriod::create($dataIni, $dataFi) as $data) {
                    $letraDia = $letraDies[$data->format('l')] ?? null;
                    if (!$letraDia) {
                        continue;
                    }

                    // Obtenir horaris del dia (que comencen amb la lletra del dia)
                    $horarisDia = $classe->horaris()
                        ->with('assignatura')
                        ->get()
                        ->filter(function ($h) use ($letraDia) {
                            return str_starts_with($h->codi_hora, $letraDia);
                        });

                    // Per a cada horari
                    foreach ($horarisDia as $horari) {
                        $assignatura = $horari->assignatura;

                        // Si hi ha projecte i l'assignatura no és excepció, usar projecte
                        if ($projecte && $assignatura->esSubstituible()) {
                            $assignatura = $projecte;
                        }

                        // Crear assistències per a cada alumne
                        foreach ($alumnes as $alumne) {
                            // Cercar inscripció directa a la col·lecció carregada
                            $inscripcio = $alumne->inscrits->firstWhere('id_assignatura', $assignatura->id);

                            if ($inscripcio) {
                                Assistencia::create([
                                    'id_inscripcio' => $inscripcio->id,
                                    'data' => $data->format('Y-m-d'),
                                    'estat' => 'Assistit',
                                    'id_profe' => null,
                                ]);
                            }
                        }
                    }
                }
            }

            return response()->json([
                'success' => true,
                'message' => 'Assistències generades correctament',
            ], Response::HTTP_CREATED);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
    public function perAssignatura($id){
        $dades = Assistencia::whereHas('inscripcio', 
        function($query) use ($id){
            $query->where('id_assignatura', $id);
        })->get();

        return response()->json([
            'success' => true,
            'data' => $dades,
            'message' => 'Dades obtingudes correctament'
        ], Response::HTTP_OK);
    }
    public function assistenciaPerAlumne($alumneId){
        $resultat = [];

        // Get all inscripcions for the student, grouped by assignatura
        $inscripcions = DB::table('inscrits')
            ->where('id_alumne', $alumneId)
            ->select('id', 'id_assignatura')
            ->get();

        // Group inscription IDs by id_assignatura
        $perAssignatura = [];
        foreach ($inscripcions as $inscripcio) {
            $perAssignatura[$inscripcio->id_assignatura][] = $inscripcio->id;
        }

        $retard_total = 0;
        $faltes_total = 0;
        $justificades_total = 0;

        foreach ($perAssignatura as $idAssignatura => $inscripcioIds) {
            $retard = 0;
            $faltes = 0;
            $justificades = 0;

            // Get subject name
            $nomAssignatura = DB::table('assignatures')
                ->where('id', $idAssignatura)
                ->select('nom')
                ->get();

            // Get all assistencies for all inscripcions of this subject
            $assistenciesValue = DB::table('assistencies')
                ->whereIn('id_inscripcio', $inscripcioIds)
                ->select('id', 'estat')
                ->get();

            foreach ($assistenciesValue as $valor) {
                switch ($valor->estat) {
                    case 'Retart':
                        $retard++;
                        $retard_total++;
                        break;
                    case 'Falta':
                        $findJustificacio = DB::table('justificants')
                            ->where('id_assistencia_ini', $valor->id)
                            ->select('acceptada')
                            ->first();

                        if ($findJustificacio !== null) {
                            $justificades++;
                            $justificades_total++;
                        } else {
                            $faltes++;
                            $faltes_total++;
                        }
                        break;
                }
            }

            $entry = (object) [
                'nom_assignatura' => $nomAssignatura,
                'retards'         => $retard,
                'faltes'          => $faltes,
                'justificades'    => $justificades,
            ];
            $resultat[] = $entry;
        }

        $entry_total = (object) [
            'nom_assignatura' => [ (object) ['nom' => 'Total'] ],
            'retards'         => $retard_total,
            'faltes'          => $faltes_total,
            'justificades'    => $justificades_total,
        ];
        array_unshift($resultat, $entry_total);
        return $resultat;
    }
}

