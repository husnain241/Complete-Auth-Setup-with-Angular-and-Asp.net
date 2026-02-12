import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

/**
 * Functional HTTP interceptor for authentication.
 * - Attaches Bearer token from signal (backed by localStorage) to requests
 * - On 401, clears auth and redirects to login
 */
export const authInterceptor: HttpInterceptorFn = (
    req: HttpRequest<unknown>,
    next: HttpHandlerFn
) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const isAuthRequest = req.url.includes('/auth/login') || req.url.includes('/auth/register');

    // Clone request with auth header if we have a token
    let authReq = req;
    const token = authService.accessToken();

    if (token && !isAuthRequest) {
        authReq = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
    }

    return next(authReq).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status === 401 && !isAuthRequest) {
                // Token expired or invalid — clear auth and redirect to login
                authService.clearAuth();
                router.navigate(['/auth/login']);
            }

            return throwError(() => error);
        })
    );
};
