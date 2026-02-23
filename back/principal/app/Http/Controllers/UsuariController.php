<?php

namespace App\Http\Controllers;

use App\Models\Usuari;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class UsuariController extends Controller
{
    /**
     * Display a listing of all users.
     */
    public function index()
    {
        return response()->json([
            'success' => true,
            'data' => Usuari::all(),
            'message' => 'Usuaris obtenits correctament'
        ], Response::HTTP_OK);
    }

    /**
     * Store a newly created user.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'cognom' => 'required|string|max:255',
            'email' => 'required|email|unique:usuaris,email',
            'email_pares' => 'nullable|email',
            'rol' => 'required|string|in:admin,professor,alumne,pare',
            'password' => 'required|string|min:8',
            'nfc_id' => 'nullable|string|unique:usuaris,nfc_id',
        ]);

        $validated['password'] = bcrypt($validated['password']);

        $usuari = Usuari::create($validated);

        return response()->json([
            'success' => true,
            'data' => $usuari,
            'message' => 'Usuari creat correctament'
        ], Response::HTTP_CREATED);
    }

    /**
     * Display the specified user.
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
     * Update the specified user.
     */
    public function update(Request $request, $id)
    {
        $usuari = Usuari::find($id);

        if (!$usuari) {
            return response()->json([
                'success' => false,
                'message' => 'Usuari no trobat'
            ], Response::HTTP_NOT_FOUND);
        }

        $validated = $request->validate([
            'nom' => 'sometimes|required|string|max:255',
            'cognom' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|unique:usuaris,email,' . $id,
            'email_pares' => 'nullable|email',
            'rol' => 'sometimes|required|string|in:admin,professor,alumne,pare',
            'password' => 'sometimes|required|string|min:8',
            'nfc_id' => 'nullable|string|unique:usuaris,nfc_id,' . $id,
        ]);

        if (isset($validated['password'])) {
            $validated['password'] = bcrypt($validated['password']);
        }

        $usuari->update($validated);

        return response()->json([
            'success' => true,
            'data' => $usuari,
            'message' => 'Usuari actualitzat correctament'
        ], Response::HTTP_OK);
    }

    /**
     * Remove the specified user.
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
