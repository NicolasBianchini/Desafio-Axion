import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authStore } from '../auth/authStore';
import type { User } from '../auth/authStore';
import { apiClient } from '../api/client';
import { authService } from '../auth/authService';
import styles from './Profile.module.css';
import { FiEye, FiEyeOff } from 'react-icons/fi';

export const Profile = () => {
    const [user, setUser] = useState<User | null>(null);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const currentUser = authStore.getUser();
        if (!currentUser) {
            navigate('/login');
            return;
        }
        setUser(currentUser);
        checkAdminRole();
    }, [navigate]);

    const checkAdminRole = async () => {
        const currentUser = authStore.getUser();
        if (!currentUser) return;

        try {
            const response = await apiClient.get(`/users/${currentUser.id}`);
            const userRole = response.data.role?.type || response.data.role?.name;
            const isAdminUser = userRole === 'admin' || userRole === 'super-admin' || userRole === 'administrator';
            setIsAdmin(isAdminUser);
        } catch (err) {
            console.error('Error checking role:', err);
        }
    };

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
            // Atualiza a senha diretamente
            await apiClient.put(`/users/${user?.id}`, {
                password: newPassword,
            });

            setMessage('Senha alterada com sucesso!');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err: any) {
            setError(err.response?.data?.message?.[0]?.messages?.[0]?.message || 'Erro ao alterar senha.');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    if (!user) {
        return null;
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.logo}>Axion Test</h1>
                <nav className={styles.nav}>
                    <button onClick={() => navigate('/people')} className={styles.navButton}>Pessoas</button>
                    <button onClick={() => navigate('/foods')} className={styles.navButton}>Comidas</button>
                    <button onClick={() => navigate('/places')} className={styles.navButton}>Locais</button>
                    {isAdmin && <button onClick={() => navigate('/users')} className={styles.navButton}>Usuários</button>}
                    <button onClick={() => navigate('/profile')} className={styles.navButton}>Perfil</button>
                    <button onClick={handleLogout} className={styles.logoutButton}>Sair</button>
                </nav>
            </header>

            <main className={styles.main}>
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
                        <div className={styles.infoRow}>
                            <span className={styles.label}>ID:</span>
                            <span className={styles.value}>{user.id}</span>
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

                        <button
                            type="submit"
                            className={styles.submitButton}
                            disabled={loading}
                        >
                            {loading ? 'Alterando...' : 'Alterar Senha'}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
};
