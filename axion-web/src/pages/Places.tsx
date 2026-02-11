import { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import { Layout } from '../components/Layout';
import { ItemCard } from '../components/ItemCard';
import { Modal } from '../components/Modal';
import { Lightbox } from '../components/Lightbox';
import { useAdminCheck } from '../hooks/useAdminCheck';
import styles from './Places.module.css';
import { FiPlus } from 'react-icons/fi';

interface ApiError {
    response?: {
        data?: {
            message?: string;
        };
    };
}

interface Place {
    id: number;
    name: string;
    link: string;
}

type SortOrder = 'asc' | 'desc';

export const Places = () => {
    const [places, setPlaces] = useState<Place[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
    const { isAdmin } = useAdminCheck();
    const [showModal, setShowModal] = useState(false);
    const [editingPlace, setEditingPlace] = useState<Place | null>(null);
    const [formData, setFormData] = useState({ name: '', link: '' });
    const [formError, setFormError] = useState('');
    const [saving, setSaving] = useState(false);
    const [previewImage, setPreviewImage] = useState<Place | null>(null);

    const fetchPlaces = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await apiClient.get('/places');
            setPlaces(response.data.data || response.data);
        } catch (err: unknown) {
            setError((err as ApiError).response?.data?.message || 'Erro ao carregar locais');
        } finally {
            setLoading(false);
        }
    };

    const toggleSort = () => {
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };

    const sortedPlaces = [...places].sort((a, b) => {
        if (sortOrder === 'asc') {
            return a.name.localeCompare(b.name);
        }
        return b.name.localeCompare(a.name);
    });

    useEffect(() => {
        fetchPlaces();
    }, []);

    const openCreateModal = () => {
        setEditingPlace(null);
        setFormData({ name: '', link: '' });
        setFormError('');
        setShowModal(true);
    };

    const openEditModal = (place: Place) => {
        setEditingPlace(place);
        setFormData({ name: place.name, link: place.link || '' });
        setFormError('');
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingPlace(null);
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
            if (editingPlace) {
                await apiClient.put(`/places/${editingPlace.id}`, formData);
            } else {
                await apiClient.post('/places', formData);
            }
            closeModal();
            fetchPlaces();
        } catch (err: unknown) {
            setFormError((err as ApiError).response?.data?.message || 'Erro ao salvar');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (place: Place) => {
        if (!confirm(`Deseja excluir "${place.name}"?`)) return;

        try {
            await apiClient.delete(`/places/${place.id}`);
            fetchPlaces();
        } catch (err: unknown) {
            alert((err as ApiError).response?.data?.message || 'Erro ao excluir');
        }
    };

    return (
        <Layout isAdmin={isAdmin} containerClassName={styles.container} mainClassName={styles.main}>
            <div className={styles.titleSection}>
                <h2 className={styles.title}>LIST OF PLACES</h2>
                <div className={styles.titleUnderline}></div>
            </div>

            <div className={styles.actionsRow}>
                {isAdmin && (
                    <button onClick={openCreateModal} className={styles.addButton}>
                        <FiPlus size={18} /> Novo
                    </button>
                )}
                <button onClick={toggleSort} className={styles.sortButton}>
                    {sortOrder === 'asc' ? '↑ A-Z' : '↓ Z-A'}
                </button>
            </div>

            {loading && (
                <div className={styles.loading}>Carregando...</div>
            )}

            {error && (
                <div className={styles.errorContainer}>
                    <p className={styles.errorMessage}>{error}</p>
                    <button onClick={fetchPlaces} className={styles.retryButton}>
                        Tentar novamente
                    </button>
                </div>
            )}

            {!loading && !error && places.length === 0 && (
                <div className={styles.empty}>Nenhum local encontrado</div>
            )}

            {!loading && !error && sortedPlaces.length > 0 && (
                <div className={styles.grid}>
                    {sortedPlaces.map((place) => (
                        <ItemCard
                            key={place.id}
                            id={place.id}
                            name={place.name}
                            imageUrl={place.link}
                            onClick={() => place.link && setPreviewImage(place)}
                            onEdit={isAdmin ? () => openEditModal(place) : undefined}
                            onDelete={isAdmin ? () => handleDelete(place) : undefined}
                            showActions={isAdmin}
                        />
                    ))}
                </div>
            )}

            <Lightbox
                isOpen={!!previewImage}
                imageUrl={previewImage?.link || ''}
                caption={previewImage?.name}
                onClose={() => setPreviewImage(null)}
            />

            <Modal
                isOpen={showModal}
                onClose={closeModal}
                title={editingPlace ? 'Editar Local' : 'Novo Local'}
                onSubmit={handleSubmit}
                isSubmitting={saving}
                error={formError}
            >
                <div className={styles.inputGroup}>
                    <label>Nome *</label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className={styles.input}
                        placeholder="Nome do local"
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
            </Modal>
        </Layout>
    );
};
