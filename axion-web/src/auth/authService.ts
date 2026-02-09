import { apiClient } from '../api/client';
import { authStore, User } from './authStore';

interface LoginResponse {
    jwt: string;
    user: User;
}

interface LoginCredentials {
    identifier: string;
    password: string;
}

class AuthService {
    async login(email: string, password: string): Promise<void> {
        const credentials: LoginCredentials = {
            identifier: email,
            password,
        };

        const response = await apiClient.post<LoginResponse>('/api/auth/local', credentials);

        const { jwt, user } = response.data;
        authStore.setAuth(jwt, user);
    }

    logout(): void {
        authStore.logout();
    }

    isAuthenticated(): boolean {
        return authStore.isAuthenticated();
    }

    getUser(): User | null {
        return authStore.getUser();
    }
}

export const authService = new AuthService();
