import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '../auth/authService';
import styles from './Login.module.css';
import programmingImage from '../assets/undraw_programming.svg';

interface ApiError {
    response?: {
        data?: {
            error?: {
                message?: string;
            };
            message?: string | { messages: { message: string }[] }[];
        };
    };
}

export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const sessionExpired = searchParams.get('session') === 'expired';

    useEffect(() => {
        if (authService.isAuthenticated()) {
            navigate('/people');
        }
    }, [navigate]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Preencha email e senha');
            return;
        }

        setLoading(true);

        try {
            await authService.login(email, password);
            navigate('/people');
        } catch (err: unknown) {
            const apiError = err as ApiError;
            const message = apiError.response?.data?.error?.message || 'Erro ao fazer login';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.leftPanel}>
                <div className={styles.card}>
                    <h1 className={styles.logo}>AXION</h1>

                    {sessionExpired && (
                        <div className={styles.warning}>
                            Sua sessão expirou. Faça login novamente.
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.field}>
                            <label htmlFor="email">Email</label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="seunome@email.com"
                                disabled={loading}
                            />
                        </div>

                        <div className={styles.field}>
                            <label htmlFor="password">Password</label>
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                disabled={loading}
                            />
                        </div>

                        <div className={styles.checkboxField}>
                            <label className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    checked={showPassword}
                                    onChange={(e) => setShowPassword(e.target.checked)}
                                    disabled={loading}
                                />
                                <span>Mostrar a senha.</span>
                            </label>
                        </div>

                        <div className={styles.link}>
                            Problemas para acessar sua conta?
                        </div>

                        {error && <div className={styles.error}>{error}</div>}

                        <button type="submit" disabled={loading} className={styles.button}>
                            {loading ? 'Entrando...' : 'Acessar'}
                        </button>

                        <div className={styles.divider}>OU</div>

                        <button type="button" className={styles.registerButton} disabled={loading}>
                            Cadastrar
                        </button>

                        <div className={styles.footer}>
                            <a href="#">Termos de uso</a> • <a href="#">Política de privacidade</a>
                        </div>
                    </form>
                </div>
            </div>
            <div className={styles.rightPanel}>
                <img src={programmingImage} alt="Programming illustration" className={styles.illustration} />
            </div>
        </div>
    );
};
