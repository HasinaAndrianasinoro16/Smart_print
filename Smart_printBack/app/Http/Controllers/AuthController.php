<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();
            return response()->json(['message' => 'Connexion réussie']);
        }

        return response()->json(['message' => 'Identifiants invalides'], 401);
    }

    public function logout(Request $request)
    {
        // Solution 1: Check if user is authenticated via session or token
        if (Auth::guard('web')->check()) {
            // Session-based logout
            Auth::guard('web')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();
        } else {
            // Token-based logout - revoke current access token
            $request->user()->currentAccessToken()->delete();
        }

        return response()->json(['message' => 'Déconnecté avec succès']);
    }

    // Alternative logout method - Solution 2
    public function logoutAlternative(Request $request)
    {
        try {
            // First try session-based logout
            if ($request->hasSession()) {
                Auth::guard('web')->logout();
                $request->session()->invalidate();
                $request->session()->regenerateToken();
            }

            // Then handle token-based logout if user exists
            $user = $request->user();
            if ($user && method_exists($user, 'currentAccessToken')) {
                $user->currentAccessToken()->delete();
            }

            return response()->json(['message' => 'Déconnecté avec succès']);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Erreur lors de la déconnexion'], 500);
        }
    }

    // Solution 3: Simple token revocation only
    public function logoutTokenOnly(Request $request)
    {
        // Just revoke the current access token
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Déconnecté avec succès']);
    }

    // Solution 4: Revoke all tokens for the user
    public function logoutAllTokens(Request $request)
    {
        // Revoke all tokens for the authenticated user
        $request->user()->tokens()->delete();

        return response()->json(['message' => 'Déconnecté de tous les appareils']);
    }

}
