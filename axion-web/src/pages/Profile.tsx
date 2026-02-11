import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { authStore } from '../auth/authStore';
import { authService } from '../auth/authService';
import type { User } from '../auth/authStore';
import { apiClient } from '../api/client';
import { Layout } from '../components/Layout';
import { useAdminCheck } from '../hooks/useAdminCheck';
import styles from './Profile.module.css';
import { FiEye, FiEyeOff } from 'react-icons/fi';

interface ApiError {
    response?: {
        status?: number;
        data?: {
            message?: string | { messages: { message: string }[] }[];
        };
    };
}

export const Profile = () => {
    const [user, setUser] = useState<User | null>(null);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { isAdmin } = useAdminCheck();
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();
    const logoutTimeoutRef = useRef<number | null>(null);

    useEffect(() => {
        const currentUser = authStore.getUser();
        if (!currentUser) {
            navigate('/login');
            return;
        }
        setUser(currentUser);
    }, [navigate]);

    useEffect(() => {
        return () => {
            if (logoutTimeoutRef.current) {
                clearTimeout(logoutTimeoutRef.current);
            }
        };
    }, []);

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (!newPassword || !confirmPassword) {
            setError('Preencha todos os campos');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('As senhas não coincidem');
            return;
        }

        if (newPassword.length < 6) {
            setError('A nova senha deve ter no mínimo 6 caracteres');
            return;
        }

        setLoading(true);
        try {
            const token = authStore.getToken();
            console.log('Token atual:', token ? 'presente' : 'ausente');
            console.log('Usuário atual:', user);
            console.log('Tentando alterar senha para usuário:', user?.id);

            // Usa o apiClient com autenticação para mudança real de senha
            console.log('Mudando senha com autenticação...');

            const response = await apiClient.post('/change-password', {
                password: newPassword,
            });

            console.log('Sucesso! Resposta:', response);

            setMessage('Senha alterada com sucesso! Redirecionando para login...');
            setNewPassword('');
            setConfirmPassword('');

            // Faz logout após 2 segundos
            logoutTimeoutRef.current = window.setTimeout(() => {
                authService.logout();
                navigate('/login');
            }, 2000);
        } catch (err: unknown) {
            const apiError = err as ApiError;
            console.error('Erro completo:', err);
            console.error('Status:', apiError.response?.status);
            console.error('Data:', apiError.response?.data);

            // Verifica se é erro 403 (Forbidden)
            if (apiError.response?.status === 403) {
                setError('Erro 403: Permissão negada. Verifique se o token está válido.');
            } else if (apiError.response?.status === 401) {
                setError('Erro 401: Token expirado. Faça login novamente.');
                authService.logout();
                navigate('/login');
            } else {
                const errorMessage = typeof apiError.response?.data?.message === 'string'
                    ? apiError.response.data.message
                    : 'Erro ao alterar senha. Tente novamente.';
                setError(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return null;
    }

    return (
        <Layout isAdmin={isAdmin} containerClassName={styles.container} mainClassName={styles.main}>
            <div className={styles.profileCard}>
                <h2 className={styles.title}>Meu Perfil</h2>

                <div className={styles.infoSection}>
                    <div className={styles.infoRow}>
                        <span className={styles.label}>Nome:</span>
                        <span className={styles.value}>{user.username}</span>
                    </div>
                    <div className={styles.infoRow}>
                        <span className={styles.label}>Email:</span>
                        <span className={styles.value}>{user.email}</span>
                    </div>
                </div>

                <div className={styles.divider}></div>

                <h3 className={styles.subtitle}>Alterar Senha</h3>

                <form onSubmit={handleChangePassword} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="newPassword">
                            Nova Senha
                        </label>
                        <div className={styles.passwordField}>
                            <input
                                id="newPassword"
                                type={showNewPassword ? "text" : "password"}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className={styles.input}
                                disabled={loading}
                            />
                            <button
                                type="button"
                                className={styles.togglePassword}
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                disabled={loading}
                            >
                                {showNewPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="confirmPassword">
                            Confirmar Nova Senha
                        </label>
                        <div className={styles.passwordField}>
                            <input
                                id="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className={styles.input}
                                disabled={loading}
                            />
                            <button
                                type="button"
                                className={styles.togglePassword}
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                disabled={loading}
                            >
                                {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                            </button>
                        </div>
                    </div>

                    {message && (
                        <div className={styles.successMessage}>{message}</div>
                    )}

                    {error && (
                        <div className={styles.errorMessage}>{error}</div>
                    )}

                    <button type="submit" className={styles.submitButton} disabled={loading}>
                        {loading ? 'Salvando...' : 'Salvar'}
                    </button>
                </form>
            </div>
        </Layout>
    );
};
