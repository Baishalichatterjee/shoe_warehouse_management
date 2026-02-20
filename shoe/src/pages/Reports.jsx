import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#2563eb', '#f97316', '#10b981', '#6366f1'];

export default function Reports() {
  const today = new Date();
  const defaultMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;

  const [month, setMonth] = useState(defaultMonth);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchReport = async (m) => {
    setLoading(true);
    setError('');
    try {
      const data = await api.get(`/dashboard/reports?month=${m}`);
      setReport(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReport(month); }, []);

  const handleMonthChange = (e) => {
    setMonth(e.target.value);
    fetchReport(e.target.value);
  };

  return (
    <div className="page-section">
      <div className="page-header">
        <h2 className="page-title">REPORTS</h2>
        <div className="page-header-actions">
          <label className="payment-label">Select Month:</label>
          <input
            type="month"
            value={month}
            onChange={handleMonthChange}
            className="form-input month-input"
          />
        </div>
      </div>

      {loading && <div className="loading">Loading report...</div>}
      {error && <div className="error-msg">{error}</div>}

      {report && !loading && (
        <div className="reports-grid">
          <div className="section-card report-stats">
            <div className="report-stat-row">
              <span className="report-label">Total Sales:</span>
              <span className="report-value">₹{report.totalSales?.toLocaleString('en-IN')}</span>
            </div>
            <div className="report-stat-row">
              <span className="report-label">Total Profit:</span>
              <span className="report-value profit">₹{report.totalProfit?.toLocaleString('en-IN')}</span>
            </div>
            <div className="report-stat-row">
              <span className="report-label">Total Items Sold:</span>
              <span className="report-value">{report.totalItemsSold}</span>
            </div>

            <h3 className="sub-heading" style={{ marginTop: '1.5rem' }}>Category Wise Sales</h3>
            <div className="category-legend">
              {report.categoryData?.map((cat, i) => (
                <div key={cat.name} className="legend-item">
                  <span className="legend-dot" style={{ background: COLORS[i % COLORS.length] }}></span>
                  <span>{cat.name}: ₹{cat.value.toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="section-card">
            {report.categoryData && report.categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={report.categoryData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ name, percent }) => `${(percent * 100).toFixed(1)}%`}
                  >
                    {report.categoryData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => `₹${v.toLocaleString('en-IN')}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-msg">No sales data for this month.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}