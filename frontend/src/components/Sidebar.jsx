import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, Package, ShoppingCart, Users, BarChart2, Settings, LogOut } from 'lucide-react';

const Sidebar = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { name: 'Dashboard', path: '/', icon: <Home size={20} /> },
        { name: 'Orders', path: '/orders', icon: <ShoppingCart size={20} /> },
        { name: 'Products', path: '/products', icon: <Package size={20} /> },
        { name: 'Customers', path: '/customers', icon: <Users size={20} /> },
        { name: 'Reports', path: '/reports', icon: <BarChart2 size={20} /> },
        { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
    ];

    return (
        <div className="w-64 bg-sidebar text-white shadow-lg flex flex-col h-screen font-sans">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <h1 className="text-xl font-bold italic tracking-wider">ShoeShop</h1>
            </div>

            <nav className="flex-1 mt-6">
                <ul className="space-y-1">
                    {navItems.map((item) => (
                        <li key={item.name}>
                            <NavLink
                                to={item.path}
                                className={({ isActive }) =>
                                    `nav-item ${isActive ? 'nav-item-active' : ''}`
                                }
                            >
                                <span className="mr-3">{item.icon}</span>
                                {item.name}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="p-4 border-t border-white/10">
                <button
                    onClick={handleLogout}
                    className="flex items-center text-gray-300 hover:text-white w-full px-4 py-2 hover:bg-white/10 rounded transition-colors"
                >
                    <LogOut size={20} className="mr-3" />
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
