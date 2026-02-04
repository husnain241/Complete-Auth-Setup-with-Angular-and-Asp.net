import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

/**
 * Functional HTTP interceptor for authentication.
 * - Attaches Bearer token to requests
 * - Handles 401 responses by attempting token refresh
 * - Retries failed request after successful refresh
 */
export const authInterceptor: HttpInterceptorFn = (
    req: HttpRequest<unknown>,
    next: HttpHandlerFn
) => {
    const authService = inject(AuthService);

    // Skip auth header for refresh endpoint to avoid loops
    const isRefreshRequest = req.url.includes('/auth/refresh');
    const isAuthRequest = req.url.includes('/auth/login') || req.url.includes('/auth/register');

    // Clone request with auth header if we have a token
    let authReq = req;
    const token = authService.accessToken();

    if (token && !isRefreshRequest && !isAuthRequest) {
        authReq = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
    }

    return next(authReq).pipe(
        catchError((error: HttpErrorResponse) => {
            // Only attempt refresh for 401 errors on protected endpoints
            if (error.status === 401 && !isRefreshRequest && !isAuthRequest) {
                return authService.refreshToken().pipe(
                    switchMap(() => {
                        // Retry original request with new token
                        const newToken = authService.accessToken();
                        const retryReq = req.clone({
                            setHeaders: {
                                Authorization: `Bearer ${newToken}`
                            }
                        });
                        return next(retryReq);
                    }),
                    catchError(refreshError => {
                        // Refresh failed - let the auth service handle logout
                        return throwError(() => refreshError);
                    })
                );
            }

            return throwError(() => error);
        })
    );
};
