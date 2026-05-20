<?php

namespace App\Http\Controllers;

use App\Models\Horari;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;

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

    /**
     * Retorna exclusivament els horaris d'una sola classe per evitar enviar tot l'institut (Fase 2)
     */
    public function getHorarisClasse($id)
    {
        $horaris = Horari::with(['assignatura', 'classe', 'aula', 'professor', 'inscrits'])
            ->where('id_classe', $id)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $horaris
        ], Response::HTTP_OK);
    }

    /**
     * Retorna exclusivament les sessions d'un professor
     */
    public function getSessionsProfessor($id)
    {
        $horaris = Horari::with(['assignatura', 'classe', 'aula'])
            ->where('id_professor', $id)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $horaris
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

        try {
            Http::timeout(2)->post(env('NODE_URL', 'http://pfg1-back-node:3000') . '/api/broadcast', [
                'event' => 'horari_updated',
                'data' => $horari
            ]);
        } catch (\Exception $e) {
            \Log::error('Error broadcasting horari_updated: ' . $e->getMessage());
        }

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

        try {
            Http::timeout(2)->post(env('NODE_URL', 'http://pfg1-back-node:3000') . '/api/broadcast', [
                'event' => 'horari_updated',
                'data' => $horari
            ]);
        } catch (\Exception $e) {
            \Log::error('Error broadcasting horari_updated: ' . $e->getMessage());
        }

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
            'alumnes_ids' => 'present|array', // IDs dels alumnes seleccionats per aquesta hora (pot ser buit)
        ]);

        // 1. Busquem si l'horari existeix, o el creem
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

        // Eliminem els que ja no hi són
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

        try {
            Http::timeout(2)->post(env('NODE_URL', 'http://pfg1-back-node:3000') . '/api/broadcast', [
                'event' => 'horari_updated',
                'data' => $horari
            ]);
        } catch (\Exception $e) {
            \Log::error('Error broadcasting horari_updated: ' . $e->getMessage());
        }

        return response()->json([
            'success' => true,
            'data' => $horari->load(['assignatura', 'aula', 'professor', 'inscrits']),
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

        try {
            Http::timeout(2)->post(env('NODE_URL', 'http://pfg1-back-node:3000') . '/api/broadcast', [
                'event' => 'horari_updated',
                'data' => ['id' => $id, 'deleted' => true]
            ]);
        } catch (\Exception $e) {
            \Log::error('Error broadcasting horari_updated: ' . $e->getMessage());
        }

        return response()->json([
            'success' => true,
            'message' => 'Horari eliminat correctament'
        ], Response::HTTP_OK);
    }

    public function getHorari($id)
    {
        $user = DB::table('usuaris')
            ->where('id', $id)
            ->select('id', 'rol')
            ->first();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Usuari no trobat'
            ], Response::HTTP_NOT_FOUND);
        }

        if ($user->rol === 'Alumne') {
            $horaris = DB::table('horaris')
                ->join('inscrits', 'horaris.id', '=', 'inscrits.id_horari')
                ->join('assignatures', 'horaris.id_assig', '=', 'assignatures.id')
                ->leftJoin('classes', 'horaris.id_classe', '=', 'classes.id')
                ->where('inscrits.id_alumne', $user->id)
                ->select('horaris.codi_hora', 'assignatures.nom as nom_assig', 'classes.nom as nom_classe')
                ->get();
        } else if ($user->rol === 'Profe') {
            $horaris = DB::table('horaris')
                ->join('assignatures', 'horaris.id_assig', '=', 'assignatures.id')
                ->leftJoin('classes', 'horaris.id_classe', '=', 'classes.id')
                ->where('horaris.id_professor', $user->id)
                ->select('horaris.codi_hora', 'assignatures.nom as nom_assig', 'classes.nom as nom_classe')
                ->get();
        } else {
            $horaris = collect();
        }

        $diesOrdre = [
            ['lletra' => 'L', 'nom' => 'dilluns'],
            ['lletra' => 'M', 'nom' => 'dimarts'],
            ['lletra' => 'X', 'nom' => 'dimecres'],
            ['lletra' => 'J', 'nom' => 'dijous'],
            ['lletra' => 'V', 'nom' => 'divendres'],
        ];

        $mapa = ['L' => [], 'M' => [], 'X' => [], 'J' => [], 'V' => []];

        foreach ($horaris as $horari) {
            $codi = $horari->codi_hora;
            if (!$codi) continue;

            $lletra = $codi[0];
            $hora = (int) substr($codi, 1); 

            $textMostrar = $horari->nom_assig;
            if ($user->rol === 'Profe' && $horari->nom_classe) {
                $textMostrar .= "\n(" . $horari->nom_classe . ")";
            }

            if (array_key_exists($lletra, $mapa)) {
                $mapa[$lletra][] = ['hora' => $hora, 'assignatura' => $textMostrar];
            }
        }

        $resultat = [];
        foreach ($diesOrdre as $dia) {
            $entrades = $mapa[$dia['lletra']];
            $slots = array_fill(0, 12, null);

            foreach ($entrades as $entry) {
                $idx = $entry['hora'] - 1;
                if ($idx >= 0 && $idx < 12) {
                    $slots[$idx] = $entry['assignatura'];
                }
            }

            $resultat[] = [
                'dia' => $dia['nom'],
                'assignatures' => $slots,
            ];
        }

        return response()->json($resultat, Response::HTTP_OK);
    }

    public function getClasseActual($id)
    {
        $user = DB::table('usuaris')->where('id', $id)->first();

        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Usuari no trobat'], 404);
        }

        $now = \Carbon\Carbon::now('Europe/Madrid');
        $diaNumerico = $now->dayOfWeekIso; 
        $lletraDia = '';
        switch ($diaNumerico) {
            case 1: $lletraDia = 'L'; break;
            case 2: $lletraDia = 'M'; break;
            case 3: $lletraDia = 'X'; break;
            case 4: $lletraDia = 'J'; break;
            case 5: $lletraDia = 'V'; break;
            default: return response()->json(['success' => true, 'data' => null]);
        }

        $horaActual = $now->hour; 
        $minutActual = $now->minute;
        
        $franja = 0;
        if ($horaActual == 8) $franja = 1;
        else if ($horaActual == 9) $franja = 2;
        else if ($horaActual == 10) $franja = 3;
        else if ($horaActual == 11 && $minutActual >= 30) $franja = 4;
        else if ($horaActual == 12) $franja = 5;
        else if ($horaActual == 13) $franja = 6;
        else if ($horaActual == 15) $franja = 7;
        else if ($horaActual == 16) $franja = 8;
        else if ($horaActual == 17) $franja = 9;
        else if ($horaActual == 18 && $minutActual >= 30) $franja = 10;
        else if ($horaActual == 19) $franja = 11;
        else if ($horaActual == 20 || ($horaActual == 21 && $minutActual <= 30)) $franja = 12;

        if ($franja === 0) {
           return response()->json(['success' => true, 'data' => null]);
        }

        $codiHoraActual = $lletraDia . $franja;

        if ($user->rol === 'Profe') {
            $horari = DB::table('horaris')
                ->join('assignatures', 'horaris.id_assig', '=', 'assignatures.id')
                ->leftJoin('classes', 'horaris.id_classe', '=', 'classes.id')
                ->leftJoin('aules', 'horaris.id_aula', '=', 'aules.id')
                ->where('horaris.id_professor', $user->id)
                ->where('horaris.codi_hora', $codiHoraActual)
                ->select('horaris.id', 'assignatures.nom as nom_assig', 'classes.nom as nom_classe', 'aules.nom as nom_aula')
                ->first();
        } else {
            $horari = DB::table('horaris')
                ->join('inscrits', 'horaris.id', '=', 'inscrits.id_horari')
                ->join('assignatures', 'horaris.id_assig', '=', 'assignatures.id')
                ->leftJoin('classes', 'horaris.id_classe', '=', 'classes.id')
                ->leftJoin('aules', 'horaris.id_aula', '=', 'aules.id')
                ->where('inscrits.id_alumne', $user->id)
                ->where('horaris.codi_hora', $codiHoraActual)
                ->select('horaris.id', 'assignatures.nom as nom_assig', 'classes.nom as nom_classe', 'aules.nom as nom_aula')
                ->first();
        }

        if ($horari) {
             return response()->json(['success' => true, 'data' => [
                 'id' => $horari->id,
                 'nom' => $horari->nom_assig,
                 'estat' => 'EN CURS ARA',
                 'classe' => $horari->nom_classe,
                 'aula' => $horari->nom_aula ?? 'TBD',
                 'horaInici' => str_pad($horaActual, 2, '0', STR_PAD_LEFT) . ':00', 
                 'horaFi' => str_pad($horaActual + 1, 2, '0', STR_PAD_LEFT) . ':00'
             ]]);
        }

        return response()->json(['success' => true, 'data' => null]);
    }

    /**
     * Retorna el context complet per a la pantalla de passar llista.
     * Inclou les sessions i quina és la sessió 'recomanada' (actual o propera).
     */
    public function getContextAssistencia($idProfessor)
    {
        $horaris = Horari::with(['assignatura', 'classe', 'aula'])
            ->where('id_professor', $idProfessor)
            ->get();

        $ordreDies = ['L' => 1, 'M' => 2, 'X' => 3, 'J' => 4, 'V' => 5];
        $sessions = $horaris->sort(function ($a, $b) use ($ordreDies) {
            $diaA = substr($a->codi_hora, 0, 1);
            $diaB = substr($b->codi_hora, 0, 1);
            $horaA = (int)substr($a->codi_hora, 1);
            $horaB = (int)substr($b->codi_hora, 1);
            if ($diaA !== $diaB) return ($ordreDies[$diaA] ?? 99) <=> ($ordreDies[$diaB] ?? 99);
            return $horaA <=> $horaB;
        })->values();

        $now = \Carbon\Carbon::now('Europe/Madrid');
        $diaNumerico = $now->dayOfWeekIso;
        $lletres = [1 => 'L', 2 => 'M', 3 => 'X', 4 => 'J', 5 => 'V'];
        $lletraDia = $lletres[$diaNumerico] ?? null;
        
        $horaActual = $now->hour;
        $minutActual = $now->minute;
        $franja = 0;
        if ($horaActual == 8) $franja = 1;
        else if ($horaActual == 9) $franja = 2;
        else if ($horaActual == 10) $franja = 3;
        else if ($horaActual == 11 && $minutActual >= 30) $franja = 4;
        else if ($horaActual == 12) $franja = 5;
        else if ($horaActual == 13) $franja = 6;
        else if ($horaActual == 15) $franja = 7;
        else if ($horaActual == 16) $franja = 8;
        else if ($horaActual == 17) $franja = 9;
        else if ($horaActual == 18 && $minutActual >= 30) $franja = 10;
        else if ($horaActual == 19) $franja = 11;
        else if ($horaActual == 20 || ($horaActual == 21 && $minutActual <= 30)) $franja = 12;

        $codiBuscat = $lletraDia . $franja;
        $sessioActual = $sessions->firstWhere('codi_hora', $codiBuscat);

        return response()->json([
            'success' => true,
            'data' => [
                'sessions' => $sessions,
                'default_id' => $sessioActual ? $sessioActual->id : ($sessions->first()->id ?? null)
            ]
        ]);
    }
}
