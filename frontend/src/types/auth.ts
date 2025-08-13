export interface LoginRequest {
    email: string;
    password?: string;
}

export interface RegisterRequest extends LoginRequest {
    firstName: string;
    lastName: string;
}

export interface AuthResponse {
    access_token: string;
    refresh_token: string;
}

export interface RefreshTokenResponse {
    access_token: string;
    refresh_token: string;
}

export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: 'USER' | 'ADMIN';
}

export interface UpdateUserRequest {
    firstName: string;
    lastName: string;
}

export interface ChangePasswordRequest {
    currentPassword?: string;
    newPassword?: string;
    confirmationPassword?: string;
}