import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../api/client';
import { Layout } from '../components/Layout';
import { useAdminCheck } from '../hooks/useAdminCheck';
import styles from './Users.module.css';
import { FiEye, FiEyeOff } from 'react-icons/fi';

interface ApiError {
    response?: {
        data?: {
            message?: string | { messages: { message: string }[] }[];
        };
    };
}

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
    const { isAdmin, loading: adminLoading } = useAdminCheck();
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
        fetchUsers();
        fetchRoles();
    }, []);

    useEffect(() => {
        if (!adminLoading && !isAdmin) {
            setError('Voce nao tem permissao para acessar esta pagina');
            const timeout = setTimeout(() => navigate('/people'), 2000);
            return () => clearTimeout(timeout);
        }
    }, [adminLoading, isAdmin, navigate]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get('/users');
            setUsers(response.data);
        } catch (err: unknown) {
            setError((err as ApiError).response?.data?.message as string || 'Erro ao carregar usuarios');
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
        if (!window.confirm('Tem certeza que deseja deletar este usuario?')) {
            return;
        }

        try {
            await apiClient.delete(`/users/${userId}`);
            setUsers(users.filter((user) => user.id !== userId));
        } catch (err: unknown) {
            alert((err as ApiError).response?.data?.message || 'Erro ao deletar usuario');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.username || !formData.email || !formData.role) {
            alert('Preencha todos os campos obrigatorios');
            return;
        }

        if (!editingUser && !formData.password) {
            alert('Senha e obrigatoria para novos usuarios');
            return;
        }

        try {
            const payload: {
                username: string;
                email: string;
                role: number;
                password?: string;
            } = {
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
        } catch (err: unknown) {
            const apiError = err as ApiError;
            const errorMessage = typeof apiError.response?.data?.message === 'string'
                ? apiError.response.data.message
                : apiError.response?.data?.message?.[0]?.messages?.[0]?.message;
            alert(errorMessage || 'Erro ao salvar usuario');
        }
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
        <Layout isAdmin={isAdmin} containerClassName={styles.container} mainClassName={styles.main}>
            <div className={styles.titleRow}>
                <h2 className={styles.title}>Gerenciar Usuarios</h2>
                <button onClick={handleCreate} className={styles.createButton}>
                    + Novo Usuario
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
                                <th>Usuario</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Acoes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.username}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <span className={styles.roleBadge}>{user.role?.name}</span>
                                    </td>
                                    <td>
                                        <div className={styles.actions}>
                                            <button onClick={() => handleEdit(user)} className={styles.editButton}>
                                                Editar
                                            </button>
                                            <button onClick={() => handleDelete(user.id)} className={styles.deleteButton}>
                                                Deletar
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {!loading && isAdmin && users.length === 0 && (
                <div className={styles.empty}>Nenhum usuario encontrado</div>
            )}

            {showModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <div className={styles.modalHeader}>
                            <h3 className={styles.modalTitle}>
                                {editingUser ? 'Editar Usuario' : 'Novo Usuario'}
                            </h3>
                            <button onClick={closeModal} className={styles.closeButton}>x</button>
                        </div>

                        <form onSubmit={handleSubmit} className={styles.form}>
                            <div className={styles.inputGroup}>
                                <label>Nome de usuario *</label>
                                <input
                                    type="text"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    className={styles.input}
                                    placeholder="Nome do usuario"
                                />
                            </div>

                            <div className={styles.inputGroup}>
                                <label>Email *</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className={styles.input}
                                    placeholder="email@exemplo.com"
                                />
                            </div>

                            <div className={styles.inputGroup}>
                                <label>
                                    Senha {!editingUser && '*'}
                                    {editingUser && (
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className={styles.togglePassword}
                                        >
                                            {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                                        </button>
                                    )}
                                </label>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className={styles.input}
                                    placeholder={editingUser ? 'Deixe vazio para manter' : 'Senha'}
                                />
                            </div>

                            <div className={styles.inputGroup}>
                                <label>Role *</label>
                                <select
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    className={styles.select}
                                >
                                    <option value="">Selecione</option>
                                    {roles.map((role) => (
                                        <option key={role.id} value={role.id}>{role.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className={styles.modalActions}>
                                <button type="button" onClick={closeModal} className={styles.cancelButton}>
                                    Cancelar
                                </button>
                                <button type="submit" className={styles.submitButton}>
                                    {editingUser ? 'Atualizar' : 'Criar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </Layout>
    );
};
