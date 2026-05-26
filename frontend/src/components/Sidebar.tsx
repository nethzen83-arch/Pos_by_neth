import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useAppDispatch } from '@/store/hooks';
import { logout } from '@/store/authSlice';
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Dashboard as DashboardIcon,
  Inventory2 as InventoryIcon,
  ShoppingCart as SalesIcon,
  Store as ProductIcon,
} from '@mui/icons-material';

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

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-blue-600 text-white rounded-lg"
      >
        {isOpen ? <CloseIcon /> : <MenuIcon />}
      </button>

      {/* Sidebar */}
      <aside
        className={`${
          isOpen ? 'w-64' : 'w-20'
        } bg-gray-900 text-white transition-all duration-300 hidden lg:flex flex-col overflow-y-auto`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-gray-700">
          <h2 className={`font-bold text-xl ${isOpen ? '' : 'text-center'}`}>
            {isOpen ? 'Neth ERP' : 'NE'}
          </h2>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
                title={item.label}
              >
                <Icon className="w-5 h-5" />
                {isOpen && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700 space-y-2">
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors"
          >
            {isOpen ? 'Logout' : '←'}
          </button>
          <div className={`text-xs text-gray-400 px-4 ${isOpen ? '' : 'text-center'}`}>
            {isOpen && (
              <>
                <p className="font-semibold">{user?.firstName}</p>
                <p>{user?.role}</p>
              </>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile sidebar */}
      {isOpen && (
        <aside className="lg:hidden fixed inset-0 bg-gray-900 text-white z-40 pt-16 overflow-y-auto">
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>
      )}
    </>
  );
}
