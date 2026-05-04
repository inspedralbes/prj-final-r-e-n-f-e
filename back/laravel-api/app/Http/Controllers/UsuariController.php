<?php

namespace App\Http\Controllers;

use App\Models\Usuari;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Response;

class UsuariController extends Controller
{
    /**
     * Llista de tots els usuaris.
     */
    public function index()
    {
        return response()->json([
            'success' => true,
            'data' => Usuari::with(['classe'])->get(),
            'message' => 'Usuaris obtinguts correctament'
        ], Response::HTTP_OK);
    }

    /**
     * Desa un nou usuari.
     */
    public function store(Request $peticio)
    {
        $dadesValidades = $peticio->validate([
            'nom' => 'required|string|max:255',
            'cognom' => 'required|string|max:255',
            'email' => 'required|email|unique:usuaris,email',
            'email_pares' => 'nullable|email',
            'rol' => 'required|string|in:admin,professor,alumne,pare',
            'password' => 'required|string|min:8',
            'nfc_id' => 'nullable|string|unique:usuaris,nfc_id',
        ]);

        $dadesValidades['password'] = bcrypt($dadesValidades['password']);

        $usuari = Usuari::create($dadesValidades);

        return response()->json([
            'success' => true,
            'data' => $usuari,
            'message' => 'Usuari creat correctament'
        ], Response::HTTP_CREATED);
    }

    /**
     * Mostra un usuari específic.
     */
    public function show($id)
    {
        $usuari = Usuari::find($id);

        if (!$usuari) {
            return response()->json([
                'success' => false,
                'message' => 'Usuari no trobat'
            ], Response::HTTP_NOT_FOUND);
        }

        return response()->json([
            'success' => true,
            'data' => $usuari,
            'message' => 'Usuari obtingut correctament'
        ], Response::HTTP_OK);
    }

    /**
     * Actualitza un usuari específic.
     */
    public function update(Request $peticio, $id)
    {
        $usuari = Usuari::find($id);

        if (!$usuari) {
            return response()->json([
                'success' => false,
                'message' => 'Usuari no trobat'
            ], Response::HTTP_NOT_FOUND);
        }

$dadesValidades = $peticio->validate([
            'nom' => 'sometimes|required|string|max:255',
            'cognom' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|unique:usuaris,email,' . $id,
            'email_pares' => 'nullable|email',
            'data_naixement' => 'nullable|date',
            'rol' => 'sometimes|required|string|in:admin,professor,alumne,pare',
            'password' => 'sometimes|required|string|min:8',
            'nfc_id' => 'nullable|string|unique:usuaris,nfc_id,' . $id,
            'id_classe' => 'nullable|exists:classes,id',
        ]);

        if (isset($dadesValidades['password'])) {
            $dadesValidades['password'] = bcrypt($dadesValidades['password']);
        }

        $usuari->update($dadesValidades);

        return response()->json([
            'success' => true,
            'data' => $usuari,
            'message' => 'Usuari actualitzat correctament'
        ], Response::HTTP_OK);
    }

    /**
     * Elimina un usuari.
     */
    public function destroy($id)
    {
        $usuari = Usuari::find($id);

        if (!$usuari) {
            return response()->json([
                'success' => false,
                'message' => 'Usuari no trobat'
            ], Response::HTTP_NOT_FOUND);
        }

        $usuari->delete();

        return response()->json([
            'success' => true,
            'message' => 'Usuari eliminat correctament'
        ], Response::HTTP_OK);
    }

    /**
     * Obte el perfil de l'usuari autenticat.
     */
    public function enviarPerfil(Request $request, $id)
    {
        $authUser = $request->user();

        if(!in_array($authUser->rol, ['Admin', 'Profe']) && $authUser->id !== (int) $id){
            return response()->json([
                'message' => 'Acceso denegado. No puedes ver la información de otro usuario.'
            ], 403);
        }

        $user = Usuari::findOrFail($id);

        $classe = DB::table('classes')->where('id', $user->id_classe)->first(['nom', 'id_curs', 'id_tutor']);
        $curs = $classe ? DB::table('cursos')->where('id', $classe->id_curs)->first(['nom']) : null;
        $infoAdicional = [];

        if ($user->rol === 'Alumne' && $classe) {
            $tutor = $classe->id_tutor ? DB::table('usuaris')->where('id', $classe->id_tutor)->first(['nom', 'cognom']) : null;

            $infoAdicional = [
                'classe' => $classe->nom,
                'curs' => $curs ? $curs->nom : null,
                'tutor' => $tutor
            ];

        } elseif ($user->rol === 'Profe' && !empty($user->id_classe)) {
            $infoAdicional = [
                'classe' => $classe ? $classe->nom : null,
                'curs' => $curs ? $curs->nom : null,
            ];   
        }

        return response()->json([
            'success' => true,
            'data' => [
                'user' => $user,    
                'info' => $infoAdicional,
            ], Response::HTTP_OK]);
    }
    public function fullfillUserProfile(Request $request)
    {
        $user = $request->user();

        $dadesValidades = $request->validate([
            'email_pares' => 'nullable|email',
            'data_naixement' => 'required|date',
            'photo' => 'nullable|file'
        ]);
        
        if($request->hasFile('photo'))
            {
                $path = str_replace("/storage/public","",$user->photo);
                Storage::disk('public')->put($path, $request->file('photo'));
            }        

        $user->update([
            'data_naixement' => $request->data_naixement,
            'email_pares' => $request->email_pares
        ]);

        return response()->json([
            'success' => true,
            'data' => $user->fresh(),
            'message' => 'Perfil completat correctament'
        ]);
    }
}  
