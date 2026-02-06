import { Injectable, signal, computed } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { User, AuthResponse, LoginRequest, RegisterRequest, ApiError } from '../models/auth.models';

/**
 * Authentication service using Angular Signals for state management.
 * Handles login, register, token refresh, and logout operations.
 */
@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly API_URL = 'https://localhost:7146/api/auth';

    // Reactive state using Angular Signals
    private readonly _currentUser = signal<User | null>(null);
    private readonly _accessToken = signal<string | null>(null);
    private readonly _tokenExpiry = signal<Date | null>(null);
    private readonly _isLoading = signal(false);
    private readonly _error = signal<string | null>(null);

    // Public computed signals (readonly)
    public readonly currentUser = this._currentUser.asReadonly();
    public readonly accessToken = this._accessToken.asReadonly();
    public readonly isAuthenticated = computed(() => !!this._currentUser() && !!this._accessToken());
    public readonly isLoading = this._isLoading.asReadonly();
    public readonly error = this._error.asReadonly();

    // Role-based computed signals
    public readonly isAdmin = computed(() =>
        this._currentUser()?.roles.includes('Admin') ?? false
    );

    constructor(
        private readonly http: HttpClient,
        private readonly router: Router
    ) {
        // Attempt to restore session on service initialization
        this.tryRefreshToken();
    }

    /**
     * Login with email and password.
     * On success, stores tokens and navigates to home.
     */
    login(request: LoginRequest): Observable<AuthResponse> {
        this._isLoading.set(true);
        this._error.set(null);

        return this.http.post<AuthResponse>(`${this.API_URL}/login`, request, {
            withCredentials: true // Required for HttpOnly cookie
        }).pipe(
            tap(response => this.handleAuthSuccess(response)),
            catchError(error => this.handleError(error))
        );
    }

    /**
     * Register a new user.
     * On success, automatically logs in the user.
     */
    register(request: RegisterRequest): Observable<AuthResponse> {
        this._isLoading.set(true);
        this._error.set(null);

        return this.http.post<AuthResponse>(`${this.API_URL}/register`, request, {
            withCredentials: true
        }).pipe(
            tap(response => this.handleAuthSuccess(response)),
            catchError(error => this.handleError(error))
        );
    }

    /**
     * Refresh the access token using the HttpOnly refresh token cookie.
     * Called automatically on 401 responses by the interceptor.
     */
    refreshToken(): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.API_URL}/refresh`, {}, {
            withCredentials: true
        }).pipe(
            tap(response => this.handleAuthSuccess(response)),
            catchError(error => {
                this.clearAuth();
                return throwError(() => error);
            })
        );
    }

    /**
     * Logout the current user.
     * Revokes refresh token on server and clears local state.
     */
    logout(): void {
        this.http.post(`${this.API_URL}/logout`, {}, {
            withCredentials: true
        }).subscribe({
            complete: () => {
                this.clearAuth();
                this.router.navigate(['/auth/login']);
            },
            error: () => {
                // Clear local state even if server call fails
                this.clearAuth();
                this.router.navigate(['/auth/login']);
            }
        });
    }

    /**
     * Check if user has a specific role.
     */
    hasRole(role: string): boolean {
        return this._currentUser()?.roles.includes(role) ?? false;
    }

    /**
     * Check if user has any of the specified roles.
     */
    hasAnyRole(roles: string[]): boolean {
        return roles.some(role => this.hasRole(role));
    }

    /**
     * Attempt to refresh token on app initialization.
     * Silent failure - user just won't be logged in.
     */
    private tryRefreshToken(): void {
        this.http.post<AuthResponse>(`${this.API_URL}/refresh`, {}, {
            withCredentials: true
        }).subscribe({
            next: response => this.handleAuthSuccess(response),
            error: () => {
                // Silent failure - no refresh token or expired
                this.clearAuth();
            }
        });
    }

    /**
     * Handle successful authentication response.
     */
    private handleAuthSuccess(response: AuthResponse): void {
        this._accessToken.set(response.accessToken);
        this._tokenExpiry.set(new Date(response.expiresAt));
        this._currentUser.set(response.user);
        this._isLoading.set(false);
        this._error.set(null);
    }

    /**
     * Handle authentication error.
     */
    private handleError(error: HttpErrorResponse): Observable<never> {
        this._isLoading.set(false);

        let message = 'An unexpected error occurred. Please try again.';

        if (error.error && typeof error.error === 'object') {
            const apiError = error.error as ApiError;
            message = apiError.detail || apiError.title || message;
        } else if (error.status === 0) {
            message = 'Unable to connect to server. Please check your connection.';
        } else if (error.status === 401) {
            message = 'Invalid email or password.';
        }

        this._error.set(message);
        return throwError(() => new Error(message));
    }

    /**
     * Clear all authentication state.
     */
    private clearAuth(): void {
        this._currentUser.set(null);
        this._accessToken.set(null);
        this._tokenExpiry.set(null);
        this._isLoading.set(false);
    }
}
