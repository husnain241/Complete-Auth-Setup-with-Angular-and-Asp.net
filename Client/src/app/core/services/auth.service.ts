import { Injectable, signal, computed } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { User, AuthResponse, LoginRequest, RegisterRequest, ApiError } from '../models/auth.models';
import { environment } from '../../../environments/environment';

/**
 * Authentication service using Angular Signals for state management.
 * Stores token and user in localStorage for persistence.
 */
@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly API_URL = `${environment.apiUrl}/auth`;
    private readonly TOKEN_KEY = 'access_token';
    private readonly USER_KEY = 'current_user';

    // Reactive state using Angular Signals
    private readonly _currentUser = signal<User | null>(null);
    private readonly _accessToken = signal<string | null>(null);
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
        this._currentUser()?.role === 'Admin'
    );

    constructor(
        private readonly http: HttpClient,
        private readonly router: Router
    ) {
        // Restore session from localStorage on initialization
        this.restoreSession();
    }

    /**
     * Login with email and password.
     * On success, stores token + user in localStorage.
     */
    login(request: LoginRequest): Observable<AuthResponse> {
        this._isLoading.set(true);
        this._error.set(null);

        return this.http.post<AuthResponse>(`${this.API_URL}/login`, request).pipe(
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

        return this.http.post<AuthResponse>(`${this.API_URL}/register`, request).pipe(
            tap(response => this.handleAuthSuccess(response)),
            catchError(error => this.handleError(error))
        );
    }

    /**
     * Logout the current user.
     * Clears localStorage and redirects to login.
     */
    logout(): void {
        this.http.post(`${this.API_URL}/logout`, {}).subscribe({
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
        return this._currentUser()?.role === role;
    }

    /**
     * Check if user has any of the specified roles.
     */
    hasAnyRole(roles: string[]): boolean {
        const userRole = this._currentUser()?.role;
        return userRole ? roles.includes(userRole) : false;
    }

    /**
     * Restore session from localStorage on app initialization.
     */
    private restoreSession(): void {
        try {
            const token = localStorage.getItem(this.TOKEN_KEY);
            const userJson = localStorage.getItem(this.USER_KEY);

            if (token && userJson) {
                const user: User = JSON.parse(userJson);
                this._accessToken.set(token);
                this._currentUser.set(user);
            }
        } catch {
            // Corrupted data — clear everything
            this.clearAuth();
        }
    }

    /**
     * Handle successful authentication response.
     * Saves token and user to both signals and localStorage.
     */
    private handleAuthSuccess(response: AuthResponse): void {
        this._accessToken.set(response.accessToken);
        this._currentUser.set(response.user);
        this._isLoading.set(false);
        this._error.set(null);

        // Persist to localStorage
        localStorage.setItem(this.TOKEN_KEY, response.accessToken);
        localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
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
     * Clear all authentication state and localStorage.
     */
    clearAuth(): void {
        this._currentUser.set(null);
        this._accessToken.set(null);
        this._isLoading.set(false);
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.USER_KEY);
    }
}
