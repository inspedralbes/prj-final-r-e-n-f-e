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
            'data' => Justificant::with(['alumne'])->get(),
            'message' => 'Justificants obtinguts correctament'
        ], Response::HTTP_OK);
    }

    // Acceptar un justificant i marcar assistències com a Justificada
    public function acceptar(Request $request, $id)
    {
        $justificant = Justificant::find($id);
        if (!$justificant) {
            return response()->json([
                'success' => false,
                'message' => 'Justificant no trobat'
            ], Response::HTTP_NOT_FOUND);
        }

        if($request->acceptat){
            $justificant->estat = 'Acceptada';
        }

        if($request->acceptat == false) {
            $justificant->estat = 'Rebutjada';
        }

        $justificant->save();

        // Cerca l'id_inscripcio de l'alumne
        $inscripcions = \DB::table('inscrits')
            ->where('id_alumne', $justificant->id_alum)
            ->pluck('id');

        // Actualitzar assistències del període a 'Justificada' si eren 'Falta'
        \DB::table('assistencies')
            ->whereIn('id_inscripcio', $inscripcions)
            ->whereDate('data', '>=', $justificant->data_inici)
            ->whereDate('data', '<=', $justificant->data_fi)
            ->where('estat', 'Falta')
            ->update(['estat' => 'Justificada']);

        return response()->json([
            'success' => true,
            'message' => 'Justificant acceptat i assistències justificades correctament',
            'data' => $justificant->load(['alumne'])
        ], Response::HTTP_OK);
    }
    public function store(Request $request)
    {
        $validated = $request->validate([
            'id_alum' => 'required|exists:usuaris,id',
            'data_inici' => 'required|date',
            'data_fi' => 'required|date|after_or_equal:data_inici',
            'comentari' => 'nullable|string',
            'document' => 'nullable|file',
            'estat' => 'nullable|string|in:Pendent,Acceptada,Rebutjada',
        ]);

        // Cerca l'id_inscripcio de l'alumne
        $inscripcions = \DB::table('inscrits')
            ->where('id_alumne', $validated['id_alum'])
            ->pluck('id');

        // Cerca la primera i última assistència del període
        $assistencies = \DB::table('assistencies')
            ->whereIn('id_inscripcio', $inscripcions)
            ->whereDate('data', '>=', $validated['data_inici'])
            ->whereDate('data', '<=', $validated['data_fi'])
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
            'data_inici' => $validated['data_inici'],
            'data_fi' => $validated['data_fi'],
            'comentari' => $validated['comentari'] ?? null,
            'document' => $validated['document'],
            'estat' => $validated['estat'] ?? 'Pendent',
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
            'data_inici' => 'sometimes|required|date',
            'data_fi' => 'sometimes|required|date|after_or_equal:data_inici',
            'comentari' => 'nullable|string',
            'document' => 'nullable|file',
            'estat' => 'sometimes|required|string|in:Pendent,Acceptada,Rebutjada',
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

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'No hi ha un usuari'
            ], Response::HTTP_BAD_REQUEST);
        }

        if ($user->rol !== 'Profe' || $user->id_classe == null){
            return response()->json([
                'success' => false,
                'message' => 'No tens una classe assignada com a tutor'
            ], Response::HTTP_FORBIDDEN);
        }

        $user_tutor_class = $user->id_classe;
        $alumnes = DB::table('usuaris')->where('id_classe', $user_tutor_class)->where('rol', 'Alumne')->get(['id', 'email', 'nom', 'cognom','photo']);
        $llistaJustificants = [];

        foreach($alumnes as $alumne) {
            $justificants = DB::table('justificants')->where('id_alum', $alumne->id)->get(['id', 'data_inici', 'data_fi', 'comentari', 'document', 'estat']);
            
            foreach($justificants as $j) {
                if ($j->document) {
                    $filepath = storage_path('app/' . $j->document);
                    if (file_exists($filepath)) {
                        $content = file_get_contents($filepath);
                        $mime = mime_content_type($filepath);
                        $j->document = 'data:' . $mime . ';base64,' . base64_encode($content);
                    } else {
                        $j->document = null;
                    }
                }
            }
            
            if ($justificants->isNotEmpty()) {
                $llistaJustificants[] = (object) [
                    'alumne' => (object) [
                        'id' => $alumne->id,
                        'email' => $alumne->email,
                        'nom' => $alumne->nom, 
                        'cognom' => $alumne->cognom,
                        'photo' => $alumne->photo
                    ],
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
            'message' => 'No hi ha resposta'
        ], Response::HTTP_OK);
    }
    
    public function getByAlumne($alumneId)
    {
        $justificants = Justificant::where('id_alum', $alumneId)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($justificants, Response::HTTP_OK);
    }
}
