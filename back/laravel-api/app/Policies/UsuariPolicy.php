<?php

namespace App\Policies;

use App\Models\Usuari;

class UsuariPolicy
{
    /**
     * Permite la acción solo si el perfil está completo.
     */
    public function canPerformAction(Usuari $user)
    {
        return $user->isProfileCompleted();
    }
}
