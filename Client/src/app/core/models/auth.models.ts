/**
 * User model matching backend UserDto
 */
export interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  roles: string[];
}

/**
 * Authentication response from login/register/refresh
 */
export interface AuthResponse {
  accessToken: string;
  expiresAt: string;
  user: User;
}

/**
 * Login request payload
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Register request payload
 */
export interface RegisterRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

/**
 * API error response (ProblemDetails format)
 */
export interface ApiError {
  status: number;
  title: string;
  detail?: string;
  instance?: string;
}
