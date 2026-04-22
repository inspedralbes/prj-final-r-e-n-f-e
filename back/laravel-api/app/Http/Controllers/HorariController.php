<?php

namespace App\Http\Controllers;

use App\Models\Horari;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;

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
        $horaris = Horari::with(['assignatura', 'classe', 'aula', 'professor'])
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
            'alumnes_ids' => 'present|array', // IDs dels alumnes seleccionats per aquesta hora (pot ser buit)
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

        // 1. Busco a la base de dades els horaris creuant amb la taula assignatures i classes
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
            $horaris = collect(); // Si sóc Admin o un altre
        }

        // 2. Defineixo l'ordre dels dies de la setmana
        $diesOrdre = [
            ['lletra' => 'L', 'nom' => 'dilluns'],
            ['lletra' => 'M', 'nom' => 'dimarts'],
            ['lletra' => 'X', 'nom' => 'dimecres'],
            ['lletra' => 'J', 'nom' => 'dijous'],
            ['lletra' => 'V', 'nom' => 'divendres'],
        ];

        // 3. Munto un mapa per agrupar les hores de cada dia
        $mapa = ['L' => [], 'M' => [], 'X' => [], 'J' => [], 'V' => []];

        foreach ($horaris as $horari) {
            $codi = $horari->codi_hora;
            if (!$codi)
                continue;

            $lletra = $codi[0];
            $hora = (int) substr($codi, 1); 

            // Si sóc profe, afegeixo també a quina classe dono l'assignatura 
            // (Com a alumne no em fa falta perquè ja sé a quina classe estic)
            $textMostrar = $horari->nom_assig;
            if ($user->rol === 'Profe' && $horari->nom_classe) {
                $textMostrar .= "\n(" . $horari->nom_classe . ")";
            }

            if (array_key_exists($lletra, $mapa)) {
                $mapa[$lletra][] = ['hora' => $hora, 'assignatura' => $textMostrar];
            }
        }

        // 4. Formatejo el resultat final amb 12 espais buits d'entrada (per cobrir matí i tarda)
        $resultat = [];
        foreach ($diesOrdre as $dia) {
            $entrades = $mapa[$dia['lletra']];

            // Creo un array de 12 hores plenes de 'null' per defecte
            $slots = array_fill(0, 12, null);

            foreach ($entrades as $entry) {
                $idx = $entry['hora'] - 1; // L'hora 1 a Laravel serà la posició 0 al Frontend.
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
        // 1. Busco qui sóc a la base de dades
        $user = DB::table('usuaris')->where('id', $id)->first();

        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Usuari no trobat'], 404);
        }

        // 2. Determino quin dia de la setmana és avui
        $diaNumerico = date('N'); 
        $lletraDia = '';
        switch ($diaNumerico) {
            case 1: $lletraDia = 'L'; break;
            case 2: $lletraDia = 'M'; break;
            case 3: $lletraDia = 'X'; break;
            case 4: $lletraDia = 'J'; break;
            case 5: $lletraDia = 'V'; break;
            default: return response()->json(['success' => true, 'data' => null]); // Si sóc en cap de setmana
        }

        // 3. Calculo la franja horària actual basant-me en l'hora del servidor
        $horaActual = (int) date('H'); 
        $minutActual = (int) date('i');
        
        $franja = 0;
        if ($horaActual == 8) $franja = 1;
        else if ($horaActual == 9) $franja = 2;
        else if ($horaActual == 10) $franja = 3;
        // Si són les 11:30 ja compta com a 4a hora després de l'esbarjo
        else if ($horaActual == 11 && $minutActual >= 30) $franja = 4;
        else if ($horaActual == 12) $franja = 5;
        else if ($horaActual == 13) $franja = 6;
        else if ($horaActual == 15) $franja = 7;
        else if ($horaActual == 16) $franja = 8;
        else if ($horaActual == 17) $franja = 9;
        // Si són les 18:30 ja compta com a franja 10 després de l'esbarjo de tarda
        else if ($horaActual == 18 && $minutActual >= 30) $franja = 10;
        else if ($horaActual == 19) $franja = 11;
        else if ($horaActual == 20 || ($horaActual == 21 && $minutActual <= 30)) $franja = 12;

        if ($franja === 0) {
           return response()->json(['success' => true, 'data' => null]);
        }

        // Amb això creem el format que té la BBDD, ex: "L3", "X5"
        $codiHoraActual = $lletraDia . $franja;

        // 4. Busco quin horari tinc en aquesta hora i dia concrets
        if ($user->rol === 'Profe') {
            $horari = DB::table('horaris')
                ->join('assignatures', 'horaris.id_assig', '=', 'assignatures.id')
                ->leftJoin('classes', 'horaris.id_classe', '=', 'classes.id')
                ->leftJoin('aules', 'horaris.id_aula', '=', 'aules.id')
                ->where('horaris.id_professor', $user->id)
                ->where('horaris.codi_hora', $codiHoraActual)
                ->select('assignatures.nom as nom_assig', 'classes.nom as nom_classe', 'aules.nom as nom_aula')
                ->first();
        } else {
            // Per alumne
            $horari = DB::table('horaris')
                ->join('inscrits', 'horaris.id', '=', 'inscrits.id_horari')
                ->join('assignatures', 'horaris.id_assig', '=', 'assignatures.id')
                ->leftJoin('classes', 'horaris.id_classe', '=', 'classes.id')
                ->leftJoin('aules', 'horaris.id_aula', '=', 'aules.id')
                ->where('inscrits.id_alumne', $user->id)
                ->where('horaris.codi_hora', $codiHoraActual)
                ->select('assignatures.nom as nom_assig', 'classes.nom as nom_classe', 'aules.nom as nom_aula')
                ->first();
        }

        // 5. Preparo la resposta perquè el frontend la pugui llegir ben organitzada
        if ($horari) {
             return response()->json(['success' => true, 'data' => [
                 'nom' => $horari->nom_assig,
                 'estat' => 'EN CURS ARA',
                 'classe' => $horari->nom_classe,
                 'aula' => $horari->nom_aula ?? 'TBD',
                 // Format 08:00 segons la franja
                 'horaInici' => str_pad($horaActual, 2, '0', STR_PAD_LEFT) . ':00', 
                 'horaFi' => str_pad($horaActual + 1, 2, '0', STR_PAD_LEFT) . ':00'
             ]]);
        }

        return response()->json(['success' => true, 'data' => null]);
    }


}
