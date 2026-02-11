import { type ReactNode } from 'react';
import { Header } from './Header';
import styles from './Layout.module.css';

interface LayoutProps {
    children: ReactNode;
    isAdmin?: boolean;
    containerClassName?: string;
    mainClassName?: string;
}

export const Layout = ({
    children,
    isAdmin = false,
    containerClassName,
    mainClassName
}: LayoutProps) => {
    return (
        <div className={containerClassName ?? styles.container}>
            <Header isAdmin={isAdmin} />
            <main className={mainClassName ?? styles.main}>
                {children}
            </main>
        </div>
    );
};
