import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../auth/authService';
import styles from './Header.module.css';

interface HeaderProps {
    isAdmin: boolean;
}

export const Header = ({ isAdmin }: HeaderProps) => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const goTo = (path: string) => {
        navigate(path);
        setIsMenuOpen(false);
    };

    const handleLogout = () => {
        authService.logout();
        setIsMenuOpen(false);
        navigate('/login');
    };

    return (
        <header className={styles.header}>
            <h1 className={styles.logo}>AXION</h1>
            <button
                type="button"
                className={`${styles.menuToggle} ${isMenuOpen ? styles.menuOpen : ''}`}
                aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
                aria-expanded={isMenuOpen}
                aria-controls="main-navigation"
                onClick={() => setIsMenuOpen((open) => !open)}
            >
                {isMenuOpen ? (
                    <svg
                        className={styles.menuIcon}
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >
                        <path
                            d="M6 6l12 12M18 6l-12 12"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            fill="none"
                        />
                    </svg>
                ) : (
                    <svg
                        className={styles.menuIcon}
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >
                        <path
                            d="M4 7h16M4 12h16M4 17h16"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            fill="none"
                        />
                    </svg>
                )}
            </button>
            <nav
                id="main-navigation"
                className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ''}`}
            >
                <button onClick={() => goTo('/foods')} className={styles.navButton}>FOODS</button>
                <button onClick={() => goTo('/people')} className={styles.navButton}>PEOPLE</button>
                <button onClick={() => goTo('/places')} className={styles.navButton}>PLACES</button>
                {isAdmin && <button onClick={() => goTo('/users')} className={styles.navButton}>USERS</button>}
                <button onClick={() => goTo('/profile')} className={styles.profileButton}>Perfil</button>
                <button onClick={handleLogout} className={styles.logoutButton}>Sair</button>
            </nav>
        </header>
    );
};
