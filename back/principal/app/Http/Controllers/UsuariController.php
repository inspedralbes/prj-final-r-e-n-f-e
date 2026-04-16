<?php

namespace App\Http\Controllers;

use App\Models\Usuari;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
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
}
