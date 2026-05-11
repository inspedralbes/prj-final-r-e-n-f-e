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
use Illuminate\Support\Facades\Schema;

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

    /**
     * Fase 2: Mètode segur per descarregar NOMÉS les assistències d'una setmana d'un horari concret.
     */
    public function assistenciaSetmanalHorari(Request $peticio, $idHorari)
    {
        $dataIni = $peticio->query('data_ini');
        $dataFi = $peticio->query('data_fi');

        // Buscar inscripcions per a aquest horari
        $inscrits = Inscrit::where('id_horari', $idHorari)
            ->with(['alumne', 'assistencies' => function ($query) use ($dataIni, $dataFi) {
                if ($dataIni && $dataFi) {
                    $query->whereBetween('data', [$dataIni, $dataFi]);
                }
            }])
            ->get();

        return response()->json([
            'success' => true,
            'data' => $inscrits
        ], Response::HTTP_OK);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'id_inscripcio' => 'required|exists:inscrits,id',
            'data' => 'required|date',
            'estat' => 'required|string|in:Assistit,Falta,Retard,Retart,Justificada',
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
            'estat' => 'sometimes|required|string|in:Assistit,Falta,Retard,Retart,Justificada',
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

    public function generar(Request $peticio)
    {
        $validated = $peticio->validate([
            'data_ini' => 'required|date',
            'data_fi' => 'required|date',
        ]);

        try {
            $dataIni = Carbon::createFromFormat('Y-m-d', $validated['data_ini']);
            $dataFi = Carbon::createFromFormat('Y-m-d', $validated['data_fi']);

            $letraDies = [
                'Monday' => 'L',
                'Tuesday' => 'M',
                'Wednesday' => 'X',
                'Thursday' => 'J',
                'Friday' => 'V',
            ];

            foreach (Classe::all() as $classe) {
                $assignaturesClasse = $classe->horaris()
                    ->with('assignatura')
                    ->get()
                    ->pluck('assignatura')
                    ->unique('id');

                $projecte = $assignaturesClasse->firstWhere('id_classe_projecte', $classe->id);

                $alumnes = Usuari::whereHas('inscrits', function ($query) use ($assignaturesClasse) {
                    $query->whereIn('id_assignatura', $assignaturesClasse->pluck('id'));
                })->with('inscrits')->get();

                foreach (CarbonPeriod::create($dataIni, $dataFi) as $data) {
                    $letraDia = $letraDies[$data->format('l')] ?? null;
                    if (!$letraDia) {
                        continue;
                    }

                    $horarisDia = $classe->horaris()
                        ->with('assignatura')
                        ->get()
                        ->filter(function ($h) use ($letraDia) {
                            return str_starts_with($h->codi_hora, $letraDia);
                        });

                    foreach ($horarisDia as $horari) {
                        $assignatura = $horari->assignatura;

                        if ($projecte && $assignatura->esSubstituible()) {
                            $assignatura = $projecte;
                        }

                        foreach ($alumnes as $alumne) {
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

    public function perAssignatura($id)
    {
        $dades = Assistencia::whereHas('inscripcio', function($query) use ($id) {
            $query->where('id_assignatura', $id);
        })->get();

        return response()->json([
            'success' => true,
            'data' => $dades,
            'message' => 'Dades obtingudes correctament'
        ], Response::HTTP_OK);
    }

    public function assistenciaPerAlumne($alumneId)
    {
        try {
            $resultat = [];
            $dataIni = null;
            $dataFi = null;
            $trimestreActual = 1;

            // 1. Detecció del període i trimestre actual
            if (Schema::hasTable('periodes')) {
                $periodeActiu = null;
                if (Schema::hasColumn('periodes', 'actiu')) {
                    $periodeActiu = DB::table('periodes')->where('actiu', true)->first();
                }
                if (!$periodeActiu) {
                    $periodeActiu = DB::table('periodes')->first();
                }

                if ($periodeActiu) {
                    $ara = Carbon::now();
                    $t1_ini = !empty($periodeActiu->trimestre_1_ini) ? Carbon::parse($periodeActiu->trimestre_1_ini) : null;
                    $t1_fi = !empty($periodeActiu->trimestre_1_fi) ? Carbon::parse($periodeActiu->trimestre_1_fi) : null;
                    $t2_ini = !empty($periodeActiu->trimestre_2_ini) ? Carbon::parse($periodeActiu->trimestre_2_ini) : null;
                    $t2_fi = !empty($periodeActiu->trimestre_2_fi) ? Carbon::parse($periodeActiu->trimestre_2_fi) : null;
                    $t3_ini = !empty($periodeActiu->trimestre_3_ini) ? Carbon::parse($periodeActiu->trimestre_3_ini) : null;
                    $t3_fi = !empty($periodeActiu->trimestre_3_fi) ? Carbon::parse($periodeActiu->trimestre_3_fi) : null;

                    if ($t1_ini && $t1_fi && $ara->between($t1_ini, $t1_fi)) {
                        $dataIni = $t1_ini; $dataFi = $t1_fi; $trimestreActual = 1;
                    } elseif ($t2_ini && $t2_fi && $ara->between($t2_ini, $t2_fi)) {
                        $dataIni = $t2_ini; $dataFi = $t2_fi; $trimestreActual = 2;
                    } elseif ($t3_ini && $t3_fi && $ara->between($t3_ini, $t3_fi)) {
                        $dataIni = $t3_ini; $dataFi = $t3_fi; $trimestreActual = 3;
                    } else {
                        $dataIni = $t1_ini; $dataFi = $t3_fi; $trimestreActual = 1;
                    }
                }
            }

            // Columna d'hores segons el trimestre
            $columnaHores = "hores_{$trimestreActual}r_trimestre";

            // 2. Inscripcions de l'alumne
            $inscripcions = DB::table('inscrits')
                ->where('id_alumne', $alumneId)
                ->select('id', 'id_assignatura')
                ->get();

            $perAssignatura = [];
            foreach ($inscripcions as $insc) {
                $perAssignatura[$insc->id_assignatura][] = $insc->id;
            }

            $retard_total = 0;
            $faltes_total = 0;
            $justificades_total = 0;
            $hores_totals_curs = 0;

            // 3. Processar cada assignatura
            foreach ($perAssignatura as $idAssignatura => $inscripcioIds) {
                $retard = 0;
                $faltes = 0;
                $justificades = 0;

                // Obtenir dades d'hores de l'assignatura per aquest trimestre
                $assignatura = DB::table('assignatures')
                    ->where('id', $idAssignatura)
                    ->first(['nom', $columnaHores]);

                $nom = $assignatura ? $assignatura->nom : 'Assignatura';
                $horesTrimestre = ($assignatura && isset($assignatura->$columnaHores)) ? (int)$assignatura->$columnaHores : 0;
                $hores_totals_curs += $horesTrimestre;

                $queryAssis = DB::table('assistencies')
                    ->whereIn('id_inscripcio', $inscripcioIds);

                if ($dataIni && $dataFi) {
                    $queryAssis->whereBetween('data', [$dataIni->format('Y-m-d'), $dataFi->format('Y-m-d')]);
                }

                $assistenciesValue = $queryAssis->select('id', 'estat', 'data')->get();

                foreach ($assistenciesValue as $valor) {
                    switch ($valor->estat) {
                        case 'Retard':
                        case 'Retart':
                            $retard++;
                            $retard_total++;
                            break;
                        case 'Falta':
                        case 'Justificada':
                            if ($valor->estat === 'Justificada') {
                                $justificades++;
                                $justificades_total++;
                                break;
                            }
                            $findJustificacio = DB::table('justificants')
                                ->where('id_alum', $alumneId)
                                ->whereDate('data_inici', '<=', $valor->data)
                                ->whereDate('data_fi', '>=', $valor->data)
                                ->where('estat', 'Acceptada')
                                ->exists();

                            if ($findJustificacio) {
                                $justificades++;
                                $justificades_total++;
                            } else {
                                $faltes++;
                                $faltes_total++;
                            }
                            break;
                    }
                }

                // Percentatge de faltes = Faltes No Justificades / Hores * 100
                $percentatge = ($horesTrimestre > 0)
                    ? round(($faltes / $horesTrimestre) * 100, 2)
                    : 0;

                $resultat[] = (object) [
                    'nom_assignatura' => [ (object)['nom' => $nom] ],
                    'retards'         => $retard,
                    'faltes'          => $faltes,
                    'justificades'    => $justificades,
                    'percentatge'     => $percentatge,
                ];
            }

            // Mitjana global basada en la suma de totes les hores del trimestre
            $percentatge_global = ($hores_totals_curs > 0)
                ? round(($faltes_total / $hores_totals_curs) * 100, 2)
                : 0;

            $entry_total = (object) [
                'nom_assignatura' => [ (object) ['nom' => 'Total'] ],
                'retards'         => $retard_total,
                'faltes'          => $faltes_total,
                'justificades'    => $justificades_total,
                'percentatge'     => $percentatge_global,
            ];
            array_unshift($resultat, $entry_total);

            return response()->json($resultat);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
                'line' => $e->getLine()
            ], 500);
        }
    }

    public function rankingFaltesClasse($idClasse)
    {
        $ranking = DB::table('usuaris')
            ->where('id_classe', $idClasse)
            ->where('rol', 'Alumne')
            ->leftJoin('inscrits', 'usuaris.id', '=', 'inscrits.id_alumne')
            ->leftJoin('assistencies', function($join) {
                $join->on('inscrits.id', '=', 'assistencies.id_inscripcio')
                     ->where('assistencies.estat', '=', 'Falta');
            })
            ->select('usuaris.id', 'usuaris.nom', 'usuaris.cognom', DB::raw('count(assistencies.id) as total_faltes'))
            ->groupBy('usuaris.id', 'usuaris.nom', 'usuaris.cognom')
            ->orderBy('total_faltes', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $ranking,
            'message' => 'Ranking de faltes de la classe obtingut correctament'
        ], Response::HTTP_OK);
    }
}
