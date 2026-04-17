<?php

namespace App\Http\Controllers;

use App\Models\Usuari;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Http;

class AuthController extends Controller
{
    /**
     * Retorna la URL de redirección a Google OAuth
     */
    public function googleRedirectUrl()
    {
        try {
            $redirectUrl = Socialite::driver('google')->stateless()->redirect()->getTargetUrl();
            return response()->json([
                'success' => true,
                'redirect_url' => $redirectUrl,
                'message' => 'URL de redirección generada correctament'
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            Log::error('Error generant URL de Google OAuth: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Error generant URL de Google',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Maneja el callback de Google OAuth
     * Espera que el cliente envíe el 'code' retornat per Google
     */
    public function googleCallback(Request $request)
    {
        try {
            $request->validate([
                'code' => 'required|string'
            ]);

            // Obtenir el usuari de Google
            $googleUser = Socialite::driver('google')
                ->stateless()
                ->user();

            $user_email = $googleUser->getEmail();

            // Validar que el email pertany al domini de l'institut
            if (!str_ends_with($user_email, '@inspedralbes.cat')) {
                return response()->json([
                    'success' => false,
                    'message' => 'No ets part del domini de l\'institut pedralbes.'
                ], Response::HTTP_FORBIDDEN);
            }

            // Assignació de rol basada en el prefix del email
            $user_rol = 'Profe';
            if (preg_match('/^a[0-9]{2}/', $user_email)) {
                $user_rol = 'Alumne';
            }

            // Per a fer proves, fem que el primer usuari sigui admin
            if ($user_email === 'a23cliferand@inspedralbes.cat') {
                $user_rol = 'Admin';
            }
            if ($user_email === 'a25albsanrom@inspedralbes.cat') {
                $user_rol = 'Profe';
            }

            // Verificar si el usuari ja existeix a la base de dades
            $user = Usuari::where('email', $user_email)->first();

            // Si el usuario NO existeix
            if (!$user) {
                // Descarreguem la foto de perfil
                $photoPath = null;
                if ($googleUser->getAvatar()) {
                    try {
                        $contents = Http::get($googleUser->getAvatar())->body();
                        // Guardar la foto amb el nom basat en l'email de l'usuari
                        $filename = 'photos/' . $user_email . '.jpg';
                        Storage::disk('public')->put($filename, $contents);
                        $photoPath = '/storage/' . $filename; // Aquesta es la ruta per accedir a la foto des del frontend
                    } catch (\Exception $e) {
                        Log::error('Error guardando la foto de perfil: ' . $e->getMessage());
                    }
                }

                // Crear el nou usuari
                $user = Usuari::create([
                    'email' => $user_email,
                    'google_id' => $googleUser->getId(),
                    'nom' => $googleUser->getName(),
                    'rol' => $user_rol,
                    'token' => $googleUser->token,
                    'photo' => $photoPath
                ]);
            }
            // Si el usuari YA existe, no modificar res - només autenticar

            // Generem el token de Sanctum per l'usuari
            $token = $user->createToken('google-auth')->plainTextToken;

            return response()->json([
                'success' => true,
                'data' => [
                    'user' => $user,
                    'token' => $token,
                    'rol' => $user_rol
                ],
                'message' => 'Autenticació correcta'
            ], Response::HTTP_OK);

        } catch (\Exception $e) {
            Log::error('Error en callback de Google OAuth: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Error en l\'autenticació',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function loginTemporal(Request $request)
    {
        try {
            $request->validate([
                'email' => 'required|email'
            ]);

            $user = Usuari::where('email', $request->email)->first();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Usuari no trobat a la base de dades'
                ], Response::HTTP_NOT_FOUND);
            }

            // Generem token temporal
            $token = $user->createToken('temporal-auth')->plainTextToken;

            return response()->json([
                'success' => true,
                'data' => [
                    'user' => $user,
                    'token' => $token,
                    'rol' => $user->rol
                ],
                'message' => 'Login temporal correcte'
            ], Response::HTTP_OK);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error en el login temporal',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
