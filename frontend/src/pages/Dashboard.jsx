import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, Calendar, TrendingUp, Package, AlertTriangle, BarChart2 } from 'lucide-react';

const StatCard = ({ title, value, icon, color }) => (
    <div className={`p-6 rounded-lg shadow-md text-white flex items-center justify-between ${color}`}>
        <div className="flex items-center">
            <div className="p-3 bg-white/20 rounded-full mr-4">
                {icon}
            </div>
            <div>
                <p className="text-sm font-medium opacity-90 mb-1">{title}</p>
                <h3 className="text-2xl font-bold">{value}</h3>
            </div>
        </div>
    </div>
);

const LowStockModal = ({ items, onClose }) => {
    if (!items || items.length === 0) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6 animate-pulse">
                <div className="flex flex-col items-center text-center">
                    <AlertTriangle size={48} className="text-yellow-500 mb-4" />
                    <h2 className="text-xl font-bold text-gray-800 uppercase tracking-wide mb-4 flex items-center gap-2">
                        <span className="text-yellow-500">!</span> WARNING!
                    </h2>
                    <p className="text-gray-600 mb-4">
                        {items.length} products are running low on stock.
                    </p>
                    <ul className="text-left w-full mb-6 space-y-2">
                        {items.map(item => (
                            <li key={item._id} className="flex justify-between items-center text-sm">
                                <span className="font-semibold text-gray-700 font-sans">• {item.name}</span>
                                <span className="text-gray-500 font-sans">({item.stock} left)</span>
                            </li>
                        ))}
                    </ul>
                    <button
                        onClick={onClose}
                        className="w-full bg-primary hover:bg-blue-800 text-white font-bold py-2 rounded transition-colors"
                    >
                        OK
                    </button>
                </div>
            </div>
        </div>
    );
};

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await api.get('/dashboard/stats');
                setStats(data);
                if (data.lowStockItems && data.lowStockItems.length > 0) {
                    setShowModal(true);
                }
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div className="text-center py-10">Loading Dashboard...</div>;
    if (!stats) return <div className="text-center py-10 text-red-500">Failed to load stats.</div>;

    return (
        <div className="space-y-6">
            {showModal && (
                <LowStockModal items={stats.lowStockItems} onClose={() => setShowModal(false)} />
            )}

            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Today Sales:"
                    value={`₹${stats.todaySales.toLocaleString()}`}
                    icon={<DollarSign size={24} />}
                    color="bg-green-600"
                />
                <StatCard
                    title="This Month:"
                    value={`₹${stats.thisMonthSales.toLocaleString()}`}
                    icon={<Calendar size={24} />}
                    color="bg-blue-500"
                />
                <StatCard
                    title="Total Profit:"
                    value={`₹${stats.totalProfit.toLocaleString()}`}
                    icon={<TrendingUp size={24} />}
                    color="bg-orange-400"
                />
                <StatCard
                    title="Total Products:"
                    value={stats.totalProducts}
                    icon={<Package size={24} />}
                    color="bg-indigo-500"
                />
            </div>

            {/* Low Stock Alerts Inline */}
            {stats.lowStockItems.length > 0 && (
                <div className="bg-white p-4 justify-between border border-gray-100 rounded">
                    <div className="flex items-center gap-2 mb-4 border-b pb-2">
                        <span className="text-yellow-500 text-2xl">!</span>
                        <span className="font-sans font-bold text-gray-800">Low Stock Items</span>
                        <span className="font-sans text-gray-500 text-sm">({stats.lowStockItems.length} Products)</span>
                    </div>

                    <div className="space-y-2">
                        {stats.lowStockItems.map(item => (
                            <div key={item._id} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                                <p className="font-sans font-bold text-gray-800 text-sm">{item.name}</p>
                                <span className="text-gray-500 font-sans text-xs">(Stock: {item.stock})</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Charts */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-700 mb-6 flex items-center font-sans tracking-wide">
                    <BarChart2 size={20} className="mr-2 text-primary" /> Monthly Sales <span className="text-sm font-normal text-gray-400 ml-2">(Last 6 Months)</span>
                </h3>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={stats.monthlySalesData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={true} stroke="#e5e7eb" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} />
                            <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `${value / 1000}K`} tick={{ fill: '#6b7280' }} />
                            <Tooltip cursor={{ fill: '#f3f4f6' }} />
                            <Bar dataKey="sales" fill="#3b82f6" barSize={50} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

        </div>
    );
};

export default Dashboard;
