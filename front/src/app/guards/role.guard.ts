import { inject } from "@angular/core";
import { Router, CanActivateFn } from "@angular/router";
import { AuthService } from "../services/auth.service";

export const roleGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const user = authService.usuarioInfo;

    const expectedRoles = route.data['roles'] as Array<string>;

    if (!user || !user.rol) {
        router.navigate(['/']);
        return false;
    }

    let hasRole = false;
    for (let i = 0; i < expectedRoles.length; i++) {
        if (expectedRoles[i].toLowerCase() === user.rol.toLowerCase()) {
            hasRole = true;
            break;
        }
    }

    if (hasRole) {
        return true;
    }

    router.navigate(['/']);
    return false;
};
