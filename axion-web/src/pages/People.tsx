import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../api/client';
import { authService } from '../auth/authService';
import { authStore } from '../auth/authStore';
import styles from './People.module.css';
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';

interface Person {
    id: number;
    name: string;
    link: string;
}

type SortOrder = 'asc' | 'desc';

export const People = () => {
    const [people, setPeople] = useState<Person[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
    const [isAdmin, setIsAdmin] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingPerson, setEditingPerson] = useState<Person | null>(null);
    const [formData, setFormData] = useState({ name: '', link: '' });
    const [formError, setFormError] = useState('');
    const [saving, setSaving] = useState(false);
    const [previewImage, setPreviewImage] = useState<{ name: string, link: string } | null>(null);
    const navigate = useNavigate();

    const fetchPeople = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await apiClient.get('/people');
            setPeople(response.data.data || response.data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao carregar pessoas');
        } finally {
            setLoading(false);
        }
    };

    const toggleSort = () => {
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };

    const sortedPeople = [...people].sort((a, b) => {
        if (sortOrder === 'asc') {
            return a.name.localeCompare(b.name);
        }
        return b.name.localeCompare(a.name);
    });

    useEffect(() => {
        fetchPeople();
        checkAdminRole();
    }, []);

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

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    const openCreateModal = () => {
        setEditingPerson(null);
        setFormData({ name: '', link: '' });
        setFormError('');
        setShowModal(true);
    };

    const openEditModal = (person: Person) => {
        setEditingPerson(person);
        setFormData({ name: person.name, link: person.link || '' });
        setFormError('');
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingPerson(null);
        setFormData({ name: '', link: '' });
        setFormError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError('');

        if (!formData.name.trim()) {
            setFormError('Nome é obrigatório');
            return;
        }

        setSaving(true);
        try {
            if (editingPerson) {
                await apiClient.put(`/people/${editingPerson.id}`, formData);
            } else {
                await apiClient.post('/people', formData);
            }
            closeModal();
            fetchPeople();
        } catch (err: any) {
            setFormError(err.response?.data?.message || 'Erro ao salvar');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (person: Person) => {
        if (!confirm(`Deseja excluir "${person.name}"?`)) return;

        try {
            await apiClient.delete(`/people/${person.id}`);
            fetchPeople();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Erro ao excluir');
        }
    };

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
                <div className={styles.titleRow}>
                    <h2 className={styles.title}>Pessoas</h2>
                    <div className={styles.actions}>
                        {isAdmin && (
                            <button onClick={openCreateModal} className={styles.addButton}>
                                <FiPlus size={18} /> Novo
                            </button>
                        )}
                        <button onClick={toggleSort} className={styles.sortButton}>
                            {sortOrder === 'asc' ? '↑ A-Z' : '↓ Z-A'}
                        </button>
                    </div>
                </div>

                {loading && (
                    <div className={styles.loading}>Carregando...</div>
                )}

                {error && (
                    <div className={styles.errorContainer}>
                        <p className={styles.errorMessage}>{error}</p>
                        <button onClick={fetchPeople} className={styles.retryButton}>
                            Tentar novamente
                        </button>
                    </div>
                )}

                {!loading && !error && people.length === 0 && (
                    <div className={styles.empty}>Nenhuma pessoa encontrada</div>
                )}

                {!loading && !error && sortedPeople.length > 0 && (
                    <div className={styles.grid}>
                        {sortedPeople.map((person) => (
                            <div
                                key={person.id}
                                className={styles.card}
                                onClick={() => person.link && setPreviewImage(person)}
                                style={{
                                    backgroundImage: person.link ? `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${person.link})` : 'none',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center'
                                }}
                            >
                                {isAdmin && (
                                    <div className={styles.cardActions} onClick={(e) => e.stopPropagation()}>
                                        <button onClick={() => openEditModal(person)} className={styles.cardAction}>
                                            <FiEdit2 size={14} />
                                        </button>
                                        <button onClick={() => handleDelete(person)} className={styles.cardActionDelete}>
                                            <FiTrash2 size={14} />
                                        </button>
                                    </div>
                                )}
                                <h3 className={styles.cardTitle}>{person.name}</h3>
                            </div>
                        ))}
                    </div>
                )}

                {previewImage && (
                    <div className={styles.lightboxOverlay} onClick={() => setPreviewImage(null)}>
                        <button className={styles.lightboxClose} onClick={() => setPreviewImage(null)}>
                            <FiX size={24} />
                        </button>
                        <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
                            <img src={previewImage.link} alt={previewImage.name} className={styles.lightboxImage} />
                            <p className={styles.lightboxCaption}>{previewImage.name}</p>
                        </div>
                    </div>
                )}

                {showModal && (
                    <div className={styles.modalOverlay} onClick={closeModal}>
                        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                            <div className={styles.modalHeader}>
                                <h3>{editingPerson ? 'Editar Pessoa' : 'Nova Pessoa'}</h3>
                                <button onClick={closeModal} className={styles.closeButton}>
                                    <FiX size={20} />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className={styles.modalForm}>
                                <div className={styles.inputGroup}>
                                    <label>Nome *</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className={styles.input}
                                        placeholder="Nome da pessoa"
                                        required
                                    />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label>URL da Imagem</label>
                                    <input
                                        type="url"
                                        value={formData.link}
                                        onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                                        className={styles.input}
                                        placeholder="https://exemplo.com/imagem.jpg"
                                    />
                                </div>
                                {formError && <div className={styles.formError}>{formError}</div>}
                                <div className={styles.modalActions}>
                                    <button type="button" onClick={closeModal} className={styles.cancelButton}>
                                        Cancelar
                                    </button>
                                    <button type="submit" disabled={saving} className={styles.submitButton}>
                                        {saving ? 'Salvando...' : 'Salvar'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};
