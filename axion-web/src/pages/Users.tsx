import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../api/client';
import { authStore } from '../auth/authStore';
import { authService } from '../auth/authService';
import styles from './Users.module.css';
import { FiEye, FiEyeOff } from 'react-icons/fi';

interface User {
    id: number;
    username: string;
    email: string;
    role?: {
        id: number;
        name: string;
        type: string;
    };
}

interface Role {
    id: number;
    name: string;
    type: string;
}

export const Users = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const closeModal = () => {
        setShowModal(false);
        setShowPassword(false);
    };

    useEffect(() => {
        checkAdminRole();
        fetchUsers();
        fetchRoles();
    }, []);

    const checkAdminRole = async () => {
        const currentUser = authStore.getUser();
        if (!currentUser) {
            navigate('/login');
            return;
        }

        try {
            const response = await apiClient.get(`/users/${currentUser.id}`);
            const userRole = response.data.role?.type || response.data.role?.name;

            // Verifica se é admin ou super-admin
            const isAdminUser = userRole === 'admin' ||
                userRole === 'super-admin' ||
                userRole === 'administrator';

            setIsAdmin(isAdminUser);

            if (!isAdminUser) {
                setError('Você não tem permissão para acessar esta página');
                setTimeout(() => navigate('/people'), 2000);
            }
        } catch (err) {
            console.error('Error checking role:', err);
            setError('Erro ao verificar permissões');
        }
    };

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get('/users');
            setUsers(response.data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao carregar usuários');
        } finally {
            setLoading(false);
        }
    };

    const fetchRoles = async () => {
        try {
            const response = await apiClient.get('/users-permissions/roles');
            setRoles(response.data.roles || response.data);
        } catch (err) {
            console.error('Error fetching roles:', err);
        }
    };

    const handleCreate = () => {
        setEditingUser(null);
        setFormData({ username: '', email: '', password: '', role: '' });
        setShowPassword(false);
        setShowModal(true);
    };

    const handleEdit = (user: User) => {
        setEditingUser(user);
        setFormData({
            username: user.username,
            email: user.email,
            password: '',
            role: user.role?.id.toString() || ''
        });
        setShowPassword(false);
        setShowModal(true);
    };

    const handleDelete = async (userId: number) => {
        if (!window.confirm('Tem certeza que deseja deletar este usuário?')) {
            return;
        }

        try {
            await apiClient.delete(`/users/${userId}`);
            setUsers(users.filter(u => u.id !== userId));
        } catch (err: any) {
            alert(err.response?.data?.message || 'Erro ao deletar usuário');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.username || !formData.email || !formData.role) {
            alert('Preencha todos os campos obrigatórios');
            return;
        }

        if (!editingUser && !formData.password) {
            alert('Senha é obrigatória para novos usuários');
            return;
        }

        try {
            const payload: any = {
                username: formData.username,
                email: formData.email,
                role: parseInt(formData.role)
            };

            if (formData.password) {
                payload.password = formData.password;
            }

            if (editingUser) {
                await apiClient.put(`/users/${editingUser.id}`, payload);
            } else {
                await apiClient.post('/users', payload);
            }

            closeModal();
            fetchUsers();
        } catch (err: any) {
            alert(err.response?.data?.message?.[0]?.messages?.[0]?.message || 'Erro ao salvar usuário');
        }
    };

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    if (!isAdmin && !loading) {
        return (
            <div className={styles.container}>
                <div className={styles.errorPage}>
                    <h2>Acesso Negado</h2>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.logo}>Axion Test</h1>
                <nav className={styles.nav}>
                    <button onClick={() => navigate('/people')} className={styles.navButton}>Pessoas</button>
                    <button onClick={() => navigate('/foods')} className={styles.navButton}>Comidas</button>
                    <button onClick={() => navigate('/places')} className={styles.navButton}>Locais</button>
                    <button onClick={() => navigate('/users')} className={styles.navButton}>Usuários</button>
                    <button onClick={() => navigate('/profile')} className={styles.navButton}>Perfil</button>
                    <button onClick={handleLogout} className={styles.logoutButton}>Sair</button>
                </nav>
            </header>

            <main className={styles.main}>
                <div className={styles.titleRow}>
                    <h2 className={styles.title}>Gerenciar Usuários</h2>
                    <button onClick={handleCreate} className={styles.createButton}>
                        + Novo Usuário
                    </button>
                </div>

                {loading && <div className={styles.loading}>Carregando...</div>}

                {error && !isAdmin && (
                    <div className={styles.errorContainer}>
                        <p className={styles.errorMessage}>{error}</p>
                    </div>
                )}

                {!loading && isAdmin && users.length > 0 && (
                    <div className={styles.tableContainer}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Username</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>{user.username}</td>
                                        <td>{user.email}</td>
                                        <td>
                                            <span className={styles.roleBadge}>
                                                {user.role?.name || 'N/A'}
                                            </span>
                                        </td>
                                        <td className={styles.actions}>
                                            <button
                                                onClick={() => handleEdit(user)}
                                                className={styles.editButton}
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user.id)}
                                                className={styles.deleteButton}
                                            >
                                                Deletar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>

            {showModal && (
                <div className={styles.modalOverlay} onClick={closeModal}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <h3 className={styles.modalTitle}>
                            {editingUser ? 'Editar Usuário' : 'Novo Usuário'}
                        </h3>

                        <form onSubmit={handleSubmit} className={styles.form}>
                            <div className={styles.inputGroup}>
                                <label>Username *</label>
                                <input
                                    type="text"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    className={styles.input}
                                    required
                                />
                            </div>

                            <div className={styles.inputGroup}>
                                <label>Email *</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className={styles.input}
                                    required
                                />
                            </div>

                            <div className={styles.inputGroup}>
                                <label>
                                    Senha {!editingUser && '*'}
                                </label>
                                <div className={styles.passwordField}>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className={styles.input}
                                        placeholder={editingUser ? 'Deixe em branco para não alterar' : ''}
                                        required={!editingUser}
                                    />
                                    <button
                                        type="button"
                                        className={styles.togglePassword}
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <div className={styles.inputGroup}>
                                <label>Role *</label>
                                <select
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    className={styles.select}
                                    required
                                >
                                    <option value="">Selecione uma role</option>
                                    {roles.map((role) => (
                                        <option key={role.id} value={role.id}>
                                            {role.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className={styles.modalActions}>
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className={styles.cancelButton}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className={styles.submitButton}
                                >
                                    {editingUser ? 'Salvar' : 'Criar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
