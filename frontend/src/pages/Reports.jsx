import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';

const Reports = () => {
    const [reports, setReports] = useState(null);
    const [loading, setLoading] = useState(false);

    const today = new Date();
    const currentMonthStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;

    const [selectedMonth, setSelectedMonth] = useState(currentMonthStr);

    const fetchReports = async (month) => {
        setLoading(true);
        try {
            const { data } = await api.get(`/dashboard/reports?month=${month}`);
            setReports(data);
        } catch (error) {
            console.error('Error fetching reports:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports(selectedMonth);
    }, [selectedMonth]);

    const COLORS = ['#3b82f6', '#f97316', '#10b981', '#ef4444', '#8b5cf6'];

    // Generate options for last 12 months
    const monthOptions = [];
    for (let i = 0; i < 12; i++) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        const val = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        const label = d.toLocaleString('default', { month: 'long', year: 'numeric' });
        monthOptions.push({ value: val, label });
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800 uppercase tracking-wide mr-6">REPORTS</h2>
                <div className="flex items-center pl-6 border-l w-1/2">
                    <span className="text-gray-600 mr-4 font-medium whitespace-nowrap">Select Month:</span>
                    <select
                        className="input-field"
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                    >
                        {monthOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-10">Loading Reports...</div>
            ) : reports ? (
                <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
                    <div className="space-y-6 border-b pb-8">
                        <div className="flex justify-between items-center text-lg">
                            <span className="font-bold text-gray-700">Total Sales:</span>
                            <span className="font-bold text-gray-800 text-xl tracking-wide">₹ {reports.totalSales.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center text-lg">
                            <span className="font-bold text-gray-700">Total Profit:</span>
                            <span className="font-bold text-gray-800 text-xl tracking-wide">₹ {reports.totalProfit.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center text-lg">
                            <span className="font-bold text-gray-700">Total Items Sold:</span>
                            <span className="font-bold text-gray-800 text-xl tracking-wide">{reports.totalItemsSold}</span>
                        </div>
                    </div>

                    <div className="pt-8">
                        <h3 className="text-lg font-bold text-gray-700 mb-6 font-sans">Category Wise Sales</h3>
                        {reports.categoryData && reports.categoryData.length > 0 ? (
                            <div className="h-64 flex mt-2">
                                <div className="w-1/2">
                                    <ul className="space-y-4 pt-4">
                                        {reports.categoryData.map((entry, index) => (
                                            <li key={`cat-${index}`} className="flex items-center text-sm font-medium">
                                                <span className="w-3 h-3 rounded-full mr-3" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                                                <div className="w-full pl-1">
                                                    <div className="text-gray-600 mb-1">{entry.name}:</div>
                                                    <div className="text-gray-500 font-normal">₹{entry.value.toLocaleString()}</div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="w-1/2">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={reports.categoryData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={90}
                                                paddingAngle={2}
                                                dataKey="value"
                                            >
                                                {reports.categoryData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <RechartsTooltip formatter={(value) => `₹ ${value.toLocaleString()}`} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-10 italic">No sales data for {monthOptions.find(o => o.value === selectedMonth)?.label}</p>
                        )}
                    </div>
                </div>
            ) : (
                <div className="text-center py-10 text-red-500">Failed to load reports.</div>
            )}

        </div>
    );
};

export default Reports;
