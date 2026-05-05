<?php

namespace App\Http\Controllers;

use App\Models\Justificant;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;

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

    // Acceptar un justificant i marcar assistències com a Justificada
    public function acceptar($id)
    {
        $justificant = Justificant::find($id);
        if (!$justificant) {
            return response()->json([
                'success' => false,
                'message' => 'Justificant no trobat'
            ], Response::HTTP_NOT_FOUND);
        }

        // Marcar justificante com acceptat
        $justificant->acceptada = true;
        $justificant->save();

        // Buscar los id_inscripcio del alumno
        $inscripcions = \DB::table('inscrits')
            ->where('id_alumne', $justificant->id_alum)
            ->pluck('id');

        // Actualitzar assistències del període a 'Justificada' si eren 'Falta'
        \DB::table('assistencies')
            ->whereIn('id_inscripcio', $inscripcions)
            ->whereDate('data', '>=', $justificant->fecha_inici)
            ->whereDate('data', '<=', $justificant->fecha_fi)
            ->where('tipus', 'Falta')
            ->update(['tipus' => 'Justificada']);

        return response()->json([
            'success' => true,
            'message' => 'Justificant acceptat i assistències justificades correctament',
            'data' => $justificant->load(['alumne', 'assignaturaInici', 'assignaturaFi'])
        ], Response::HTTP_OK);
    }
    public function store(Request $request)
    {
        $validated = $request->validate([
            'id_alum' => 'required|exists:usuaris,id',
            'fecha_inici' => 'required|date',
            'fecha_fi' => 'required|date|after_or_equal:fecha_inici',
            'comentari' => 'nullable|string',
            'document' => 'nullable|file',
            'acceptada' => 'required|boolean',
        ]);

        // Buscar los id_inscripcio del alumno
        $inscripcions = \DB::table('inscrits')
            ->where('id_alumne', $validated['id_alum'])
            ->pluck('id');

        // Buscar la primera i última assistència de l'alumne en el període
        $assistencies = \DB::table('assistencies')
            ->whereIn('id_inscripcio', $inscripcions)
            ->whereDate('data', '>=', $validated['fecha_inici'])
            ->whereDate('data', '<=', $validated['fecha_fi'])
            ->orderBy('data')
            ->get();

        if ($assistencies->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'No s\'han trobat assistències per a aquest període',
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        // Gestionar la pujada del fitxer
        if ($request->hasFile('document')) {
            $file = $request->file('document');
            $id_alum = $validated['id_alum'];
            $folder = storage_path('app/private/justificants/' . $id_alum);
            if (!file_exists($folder)) {
                if (!mkdir($folder, 0777, true)) {
                    error_log('No s\'ha pogut crear la carpeta: ' . $folder);
                }
            }
            $filename = $file->getClientOriginalName();
            $filepath = $folder . DIRECTORY_SEPARATOR . $filename;
            if (!$file->move($folder, $filename)) {
                error_log('No s\'ha pogut moure el fitxer a: ' . $filepath);
            }
            // Guardar la ruta relativa a storage/private/justificants/id_alumne/filename
            $validated['document'] = 'storage/private/justificants/' . $id_alum . '/' . $filename;
        } else {
            error_log('No s\'ha trobat cap fitxer adjuntat per al camp document.');
            $validated['document'] = null;
        }

        $justificant = Justificant::create([
            'id_alum' => $validated['id_alum'],
            'fecha_inici' => $validated['fecha_inici'],
            'fecha_fi' => $validated['fecha_fi'],
            'comentari' => $validated['comentari'] ?? null,
            'document' => $validated['document'],
            'acceptada' => $validated['acceptada'],
        ]);

        return response()->json([
            'success' => true,
            'data' => $justificant->load(['alumne']),
            'message' => 'Justificant creat correctament'
        ], Response::HTTP_CREATED);
    }

    public function show($id)
    {
        $justificant = Justificant::with(['alumne'])->find($id);

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
            'fecha_inici' => 'sometimes|required|date',
            'fecha_fi' => 'sometimes|required|date|after_or_equal:fecha_inici',
            'comentari' => 'nullable|string',
            'document' => 'nullable|file',
            'acceptada' => 'sometimes|required|boolean',
        ]);

        // Gestionar la pujada del fitxer
        if ($request->hasFile('document')) {
            $file = $request->file('document');
            $id_alum = $validated['id_alum'] ?? $justificant->id_alum;
            $usuari = \App\Models\Usuari::find($id_alum);
            $classe = $usuari && isset($usuari->classe) ? $usuari->classe : 'altres';
            $folder = storage_path('app/public/justificants/' . $classe);
            if (!file_exists($folder)) {
                mkdir($folder, 0777, true);
            }
            $path = $file->storeAs(
                'public/justificants/' . $classe,
                $file->getClientOriginalName()
            );
            $validated['document'] = str_replace('public/', 'storage/', $path);
        }

        $justificant->update($validated);

        return response()->json([
            'success' => true,
            'data' => $justificant->load(['alumne']),
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

    public function justificacioPerTutoria(Request $request) {
        $user = $request->user();

        if ($user->rol !== 'Professor' && $user->id_classe == null){
            return response()->json([
                'success' => false,
                'message' => 'No tens una classe assignada com a tutor'
            ], Response::HTTP_FORBIDDEN);
        }

        $user_tutor_class = $user->id_classe;
        $alumnes = DB::table('usuaris')->where('id_classe', $user_tutor_class)->where('rol', 'Alumne')->get(['id', 'email']);
        $llistaJustificants = [];

        foreach($alumnes as $alumne) {
            $justificants = DB::table('justificant')->where('id_alum', $alumne->id)->get(['id', 'fecha_inici', 'fecha_fi', 'comentari', 'document', 'acceptada']);
            if ($justificants) {
                $llistaJustificants[] = (object) [
                    'email_alumne' => $alumne->email,
                    'justificants' => $justificants
                ];
            } 
        }

        if (count($llistaJustificants) > 0) {
            return response()->json([
                'success' => true,
                'data' => $llistaJustificants
            ], Response::HTTP_OK);
        }
        return response()->json([
            'success' => false,
            'message' => 'Ha hagut un error'
        ], Response::HTTP_INTERNAL_SERVER_ERROR);
    }
}
