import { useState } from 'react';
import { Layout } from '../components/Layout';
import { Modal } from '../components/Modal';
import { ItemCard } from '../components/ItemCard';
import { Lightbox } from '../components/Lightbox';
import { useAdminCheck } from '../hooks/useAdminCheck';
import { useCRUD } from '../hooks/useCRUD';
import { useSortable } from '../hooks/useSortable';
import { FiPlus } from 'react-icons/fi';
import styles from './People.module.css';

interface Person {
    id: number;
    name: string;
    link: string;
}

export const People = () => {
    const { isAdmin } = useAdminCheck();
    const { items: people, loading, error, createItem, updateItem, deleteItem, fetchItems } = useCRUD<Person>({
        endpoint: '/people'
    });
    const { sortedItems: sortedPeople, sortOrder, toggleSort } = useSortable(people);

    const [showModal, setShowModal] = useState(false);
    const [editingPerson, setEditingPerson] = useState<Person | null>(null);
    const [formData, setFormData] = useState({ name: '', link: '' });
    const [formError, setFormError] = useState('');
    const [saving, setSaving] = useState(false);
    const [previewImage, setPreviewImage] = useState<Person | null>(null);

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
        const success = editingPerson
            ? await updateItem(editingPerson.id, formData)
            : await createItem(formData);

        setSaving(false);
        if (success) {
            closeModal();
        } else {
            setFormError('Erro ao salvar');
        }
    };

    const handleDelete = (person: Person) => {
        deleteItem(person.id, `Deseja excluir "${person.name}"?`);
    };

    return (
        <Layout isAdmin={isAdmin}>
            <div className={styles.titleSection}>
                <h2 className={styles.title}>LIST OF PEOPLE</h2>
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
                    <button onClick={fetchItems} className={styles.retryButton}>
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
                        <ItemCard
                            key={person.id}
                            id={person.id}
                            name={person.name}
                            imageUrl={person.link}
                            onClick={() => person.link && setPreviewImage(person)}
                            onEdit={isAdmin ? () => openEditModal(person) : undefined}
                            onDelete={isAdmin ? () => handleDelete(person) : undefined}
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
                title={editingPerson ? 'Editar Pessoa' : 'Nova Pessoa'}
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
            </Modal>
        </Layout>
    );
};
