import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Functional guard for role-based route protection.
 * Checks if user is authenticated and has required roles.
 * 
 * Usage in routes:
 * { path: 'admin', canActivate: [roleGuard], data: { roles: ['Admin'] } }
 */
export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    // Check authentication first
    if (!authService.isAuthenticated()) {
        router.navigate(['/auth/login'], {
            queryParams: { returnUrl: route.url.join('/') }
        });
        return false;
    }

    // Get required roles from route data
    const requiredRoles = route.data['roles'] as string[] | undefined;

    // If no roles specified, just require authentication
    if (!requiredRoles || requiredRoles.length === 0) {
        return true;
    }

    // Check if user has any of the required roles
    if (authService.hasAnyRole(requiredRoles)) {
        return true;
    }

    // User doesn't have required role - redirect to unauthorized or home
    router.navigate(['/']);
    return false;
};

/**
 * Guard that only allows unauthenticated users.
 * Useful for login/register pages.
 */
export const guestGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.isAuthenticated()) {
        router.navigate(['/']);
        return false;
    }

    return true;
};
