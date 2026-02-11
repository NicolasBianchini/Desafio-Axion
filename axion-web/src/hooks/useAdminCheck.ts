import { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import { authStore } from '../auth/authStore';

export const useAdminCheck = () => {
    const initialIsAdmin = authStore.getIsAdmin();
    const [isAdmin, setIsAdmin] = useState<boolean>(initialIsAdmin);
    const [loading, setLoading] = useState<boolean>(!initialIsAdmin);

    useEffect(() => {
        checkAdminRole();
    }, []);

    const checkAdminRole = async () => {
        const currentUser = authStore.getUser();
        if (!currentUser) {
            setIsAdmin(false);
            authStore.setIsAdmin(false);
            setLoading(false);
            return;
        }

        try {
            const response = await apiClient.get('/users/me');
            const userRole = response.data.role?.type || response.data.role?.name;
            const isAdminUser =
                userRole === 'admin' ||
                userRole === 'super-admin' ||
                userRole === 'administrator';
            setIsAdmin(isAdminUser);
            authStore.setIsAdmin(isAdminUser);
        } catch (err) {
            console.error('Error checking role:', err);
            setIsAdmin(false);
            authStore.setIsAdmin(false);
        } finally {
            setLoading(false);
        }
    };

    return { isAdmin, loading };
};