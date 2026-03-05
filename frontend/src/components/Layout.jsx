import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar';
import { Bell, User } from 'lucide-react';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
    if (!user) return <Navigate to="/login" replace />;

    return children;
};

const Layout = () => {
    return (
        <div className="flex bg-secondary min-h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Topbar */}
                <header className="bg-white shadow-sm border-b px-8 py-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-700 tracking-wide uppercase">
                        {/* We can potentially make this dynamic based on route later */}
                        Management System
                    </h2>
                    <div className="flex items-center space-x-4 text-gray-500">
                        <button className="hover:text-primary transition-colors">
                            <Bell size={20} />
                        </button>
                        <button className="hover:text-primary transition-colors">
                            <User size={20} />
                        </button>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-8 bg-gray-50">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export { Layout, ProtectedRoute };
