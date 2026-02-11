import { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import { Layout } from '../components/Layout';
import { ItemCard } from '../components/ItemCard';
import { Modal } from '../components/Modal';
import { Lightbox } from '../components/Lightbox';
import { useAdminCheck } from '../hooks/useAdminCheck';
import styles from './Foods.module.css';
import { FiPlus } from 'react-icons/fi';

interface ApiError {
    response?: {
        data?: {
            message?: string;
        };
    };
}

interface Food {
    id: number;
    name: string;
    link: string;
}

type SortOrder = 'asc' | 'desc';

export const Foods = () => {
    const [foods, setFoods] = useState<Food[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
    const { isAdmin } = useAdminCheck();
    const [showModal, setShowModal] = useState(false);
    const [editingFood, setEditingFood] = useState<Food | null>(null);
    const [formData, setFormData] = useState({ name: '', link: '' });
    const [formError, setFormError] = useState('');
    const [saving, setSaving] = useState(false);
    const [previewImage, setPreviewImage] = useState<Food | null>(null);

    const fetchFoods = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await apiClient.get('/foods');
            setFoods(response.data.data || response.data);
        } catch (err: unknown) {
            setError((err as ApiError).response?.data?.message || 'Erro ao carregar comidas');
        } finally {
            setLoading(false);
        }
    };

    const toggleSort = () => {
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };

    const sortedFoods = [...foods].sort((a, b) => {
        if (sortOrder === 'asc') {
            return a.name.localeCompare(b.name);
        }
        return b.name.localeCompare(a.name);
    });

    useEffect(() => {
        fetchFoods();
    }, []);

    const openCreateModal = () => {
        setEditingFood(null);
        setFormData({ name: '', link: '' });
        setFormError('');
        setShowModal(true);
    };

    const openEditModal = (food: Food) => {
        setEditingFood(food);
        setFormData({ name: food.name, link: food.link || '' });
        setFormError('');
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingFood(null);
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
            if (editingFood) {
                await apiClient.put(`/foods/${editingFood.id}`, formData);
            } else {
                await apiClient.post('/foods', formData);
            }
            closeModal();
            fetchFoods();
        } catch (err: unknown) {
            setFormError((err as ApiError).response?.data?.message || 'Erro ao salvar');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (food: Food) => {
        if (!confirm(`Deseja excluir "${food.name}"?`)) return;

        try {
            await apiClient.delete(`/foods/${food.id}`);
            fetchFoods();
        } catch (err: unknown) {
            alert((err as ApiError).response?.data?.message || 'Erro ao excluir');
        }
    };

    return (
        <Layout isAdmin={isAdmin} containerClassName={styles.container} mainClassName={styles.main}>
            <div className={styles.titleSection}>
                <h2 className={styles.title}>LIST OF FOODS</h2>
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

            {loading && <div className={styles.loading}>Carregando...</div>}

            {error && (
                <div className={styles.errorContainer}>
                    <p className={styles.errorMessage}>{error}</p>
                    <button onClick={fetchFoods} className={styles.retryButton}>
                        Tentar novamente
                    </button>
                </div>
            )}

            {!loading && !error && foods.length === 0 && (
                <div className={styles.empty}>Nenhuma comida encontrada</div>
            )}

            {!loading && !error && sortedFoods.length > 0 && (
                <div className={styles.grid}>
                    {sortedFoods.map((food) => (
                        <ItemCard
                            key={food.id}
                            id={food.id}
                            name={food.name}
                            imageUrl={food.link}
                            onClick={() => food.link && setPreviewImage(food)}
                            onEdit={isAdmin ? () => openEditModal(food) : undefined}
                            onDelete={isAdmin ? () => handleDelete(food) : undefined}
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
                title={editingFood ? 'Editar Comida' : 'Nova Comida'}
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
                        placeholder="Nome da comida"
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
