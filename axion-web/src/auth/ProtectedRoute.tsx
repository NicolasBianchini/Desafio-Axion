import { Navigate } from 'react-router-dom';
import { authService } from './authService';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    if (!authService.isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};
