/**
 * User model matching backend UserDto
 */
export interface User {
  id: number;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: string;
  isOnline?: boolean; // Real-time online status ke liye (optional)
}

/**
 * Authentication response from login/register
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
 * Admin: Create user payload
 */
export interface CreateUserRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role: string;
}

/**
 * Admin: Update user payload
 */
export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  role: string;
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
