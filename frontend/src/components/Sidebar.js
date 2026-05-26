import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useAppDispatch } from '@/store/hooks';
import { logout } from '@/store/authSlice';
import { Menu as MenuIcon, Close as CloseIcon, Dashboard as DashboardIcon, Inventory2 as InventoryIcon, ShoppingCart as SalesIcon, Store as ProductIcon, } from '@mui/icons-material';
const menuItems = [
    { label: 'Dashboard', path: '/dashboard', icon: DashboardIcon },
    { label: 'Products', path: '/products', icon: ProductIcon },
    { label: 'Sales', path: '/sales', icon: SalesIcon },
    { label: 'Inventory', path: '/inventory', icon: InventoryIcon },
];
export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    const dispatch = useAppDispatch();
    const handleLogout = async () => {
        await dispatch(logout());
        navigate('/login');
    };
    const isActive = (path) => location.pathname === path;
    return (_jsxs(_Fragment, { children: [_jsx("button", { onClick: () => setIsOpen(!isOpen), className: "lg:hidden fixed top-4 left-4 z-50 p-2 bg-blue-600 text-white rounded-lg", children: isOpen ? _jsx(CloseIcon, {}) : _jsx(MenuIcon, {}) }), _jsxs("aside", { className: `${isOpen ? 'w-64' : 'w-20'} bg-gray-900 text-white transition-all duration-300 hidden lg:flex flex-col overflow-y-auto`, children: [_jsx("div", { className: "p-4 border-b border-gray-700", children: _jsx("h2", { className: `font-bold text-xl ${isOpen ? '' : 'text-center'}`, children: isOpen ? 'Neth ERP' : 'NE' }) }), _jsx("nav", { className: "flex-1 p-4 space-y-2", children: menuItems.map((item) => {
                            const Icon = item.icon;
                            return (_jsxs("button", { onClick: () => navigate(item.path), className: `w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive(item.path)
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-300 hover:bg-gray-800'}`, title: item.label, children: [_jsx(Icon, { className: "w-5 h-5" }), isOpen && _jsx("span", { children: item.label })] }, item.path));
                        }) }), _jsxs("div", { className: "p-4 border-t border-gray-700 space-y-2", children: [_jsx("button", { onClick: handleLogout, className: "w-full text-left px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors", children: isOpen ? 'Logout' : '←' }), _jsx("div", { className: `text-xs text-gray-400 px-4 ${isOpen ? '' : 'text-center'}`, children: isOpen && (_jsxs(_Fragment, { children: [_jsx("p", { className: "font-semibold", children: user?.firstName }), _jsx("p", { children: user?.role })] })) })] })] }), isOpen && (_jsx("aside", { className: "lg:hidden fixed inset-0 bg-gray-900 text-white z-40 pt-16 overflow-y-auto", children: _jsx("nav", { className: "p-4 space-y-2", children: menuItems.map((item) => {
                        const Icon = item.icon;
                        return (_jsxs("button", { onClick: () => {
                                navigate(item.path);
                                setIsOpen(false);
                            }, className: `w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive(item.path)
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-300 hover:bg-gray-800'}`, children: [_jsx(Icon, { className: "w-5 h-5" }), _jsx("span", { children: item.label })] }, item.path));
                    }) }) }))] }));
}
//# sourceMappingURL=Sidebar.js.map