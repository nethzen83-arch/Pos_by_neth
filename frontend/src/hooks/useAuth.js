import { useMemo } from 'react';
import { useAppSelector } from '../store/hooks.js';
export const useAuth = () => {
    const auth = useAppSelector((state) => state.auth);
    return useMemo(() => ({
        user: auth.user,
        token: auth.token,
        isAuthenticated: !!auth.token,
        isLoading: auth.isLoading,
        error: auth.error,
        isAdmin: auth.user?.role === 'SUPER_ADMIN' || auth.user?.role === 'ADMIN',
        isManager: auth.user?.role === 'MANAGER',
        isCashier: auth.user?.role === 'CASHIER',
        isAccountant: auth.user?.role === 'ACCOUNTANT',
        isWarehouseStaff: auth.user?.role === 'WAREHOUSE_STAFF',
    }), [auth]);
};
export const useCanAccess = (requiredRoles) => {
    const { user } = useAuth();
    return user && requiredRoles.includes(user.role);
};
//# sourceMappingURL=useAuth.js.map