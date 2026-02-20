import { useState, useEffect } from 'react';
import { api } from '../services/api';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await api.get('/dashboard/stats');
        setStats(data);
        if (data.lowStockItems && data.lowStockItems.length > 0) {
          setShowAlert(true);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="loading">Loading dashboard...</div>;
  if (!stats) return <div className="loading">Failed to load stats.</div>;

  return (
    <div className="dashboard-page">
      {showAlert && (
        <div className="modal-overlay">
          <div className="alert-modal">
            <div className="alert-icon">⚠️</div>
            <h3>WARNING!</h3>
            <p>{stats.lowStockItems.length} products are running low on stock.</p>
            <ul className="alert-list">
              {stats.lowStockItems.map((item) => (
                <li key={item._id}>• {item.name} ({item.stock} left)</li>
              ))}
            </ul>
            <button className="btn-ok" onClick={() => setShowAlert(false)}>OK</button>
          </div>
        </div>
      )}

      <div className="stats-grid">
        <div className="stat-card green">
          <div className="stat-icon">💰</div>
          <div>
            <div className="stat-label">Today Sales</div>
            <div className="stat-value">₹{stats.todaySales?.toLocaleString('en-IN')}</div>
          </div>
        </div>
        <div className="stat-card blue">
          <div className="stat-icon">📅</div>
          <div>
            <div className="stat-label">This Month</div>
            <div className="stat-value">₹{stats.thisMonthSales?.toLocaleString('en-IN')}</div>
          </div>
        </div>
        <div className="stat-card orange">
          <div className="stat-icon">📈</div>
          <div>
            <div className="stat-label">Total Profit</div>
            <div className="stat-value">₹{stats.totalProfit?.toLocaleString('en-IN')}</div>
          </div>
        </div>
        <div className="stat-card teal">
          <div className="stat-icon">📦</div>
          <div>
            <div className="stat-label">Total Products</div>
            <div className="stat-value">{stats.totalProducts}</div>
          </div>
        </div>
      </div>

      {stats.lowStockItems && stats.lowStockItems.length > 0 && (
        <div className="section-card low-stock-card">
          <h3 className="section-title warning-title">
            ⚠️ Low Stock Items ({stats.lowStockItems.length} Products)
          </h3>
          <div className="low-stock-list">
            {stats.lowStockItems.map((item) => (
              <div key={item._id} className="low-stock-item">
                <span className="shoe-thumb">👟</span>
                <span className="low-stock-name">{item.name} (Stock: {item.stock})</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="section-card">
        <h3 className="section-title">
          📊 Monthly Sales <span className="subtitle">(Last 6 Months)</span>
        </h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={stats.monthlySalesData} margin={{ top: 10, right: 20, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e8eaec" />
            <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 13 }} />
            <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} tickFormatter={(v) => `${v/1000}K`} />
            <Tooltip formatter={(v) => [`₹${v.toLocaleString('en-IN')}`, 'Sales']} />
            <Bar dataKey="sales" fill="#2563eb" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}