import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../api/client';
import { authService } from '../auth/authService';
import styles from './People.module.css';

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
    const navigate = useNavigate();

    const fetchFoods = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await apiClient.get('/foods');
            setFoods(response.data.data || response.data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao carregar comidas');
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

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.logo}>Axion Test</h1>
                <nav className={styles.nav}>
                    <button onClick={() => navigate('/people')} className={styles.navButton}>Pessoas</button>
                    <button onClick={() => navigate('/foods')} className={styles.navButton}>Comidas</button>
                    <button onClick={() => navigate('/places')} className={styles.navButton}>Locais</button>
                    <button onClick={() => navigate('/profile')} className={styles.navButton}>Perfil</button>
                    <button onClick={handleLogout} className={styles.logoutButton}>Sair</button>
                </nav>
            </header>

            <main className={styles.main}>
                <div className={styles.titleRow}>
                    <h2 className={styles.title}>Comidas</h2>
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
                            <div
                                key={food.id}
                                className={styles.card}
                                style={{
                                    backgroundImage: food.link ? `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${food.link})` : 'none',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center'
                                }}
                            >
                                <h3 className={styles.cardTitle}>{food.name}</h3>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};
