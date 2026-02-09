const TOKEN_KEY = 'axion_token';
const USER_KEY = 'axion_user';

export interface User {
    id: number;
    username: string;
    email: string;
}

class AuthStore {
    getToken(): string | null {
        return localStorage.getItem(TOKEN_KEY);
    }

    getUser(): User | null {
        const userStr = localStorage.getItem(USER_KEY);
        return userStr ? JSON.parse(userStr) : null;
    }

    setAuth(token: string, user: User): void {
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    }

    logout(): void {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
    }

    isAuthenticated(): boolean {
        return !!this.getToken();
    }
}

export const authStore = new AuthStore();
