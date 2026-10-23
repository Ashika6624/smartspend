import React, { useState, useEffect } from 'react';
import { Download, FileText, TrendingDown, TrendingUp, Calendar, Award } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { dashboardService, transactionService } from '../services/api';

const COLORS = ['#ef4444', '#f59e0b', '#3b82f6', '#10b981', '#8b5cf6', '#ec4899', '#06b6d4', '#64748b'];

const Reports = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await dashboardService.getSummary();
        setSummary(res);
      } catch (err) {
        console.error('Failed to load reports:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleExportCsv = async () => {
    try {
      setDownloading(true);
      await transactionService.downloadCsv();
    } catch (err) {
      console.error('CSV download error:', err);
      alert('Failed to download CSV export');
    } finally {
      setDownloading(false);
    }
  };

  const formatCurrency = (val) => {
    const num = Number(val) || 0;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(num);
  };

  if (loading && !summary) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
        <p>Generating financial analytics and reports...</p>
      </div>
    );
  }

  const {
    totalIncome = 0,
    totalExpenses = 0,
    availableBalance = 0,
    categoryBreakdown = [],
    monthlyComparisons = []
  } = summary || {};

  // Find category with highest expense
  let highestCategory = null;
  if (categoryBreakdown.length > 0) {
    highestCategory = [...categoryBreakdown].sort((a, b) => b.amount - a.amount)[0];
  }

  // Net savings rate
  const savingsRate =
    totalIncome > 0
      ? Math.round(((totalIncome - totalExpenses) / totalIncome) * 100)
      : 0;

  return (
    <div>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 800 }}>Reports & Financial Analytics</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            Comprehensive analytics, monthly comparisons, spending habits, and CSV data export.
          </p>
        </div>

        <button className="btn btn-primary" onClick={handleExportCsv} disabled={downloading}>
          <Download size={18} /> {downloading ? 'Exporting...' : 'Export CSV Report'}
        </button>
      </div>

      {/* Analytics Highlights */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Award size={24} />
          </div>
          <div>
            <span style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
              Highest Expense Category
            </span>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--danger)', marginTop: '2px' }}>
              {highestCategory ? `${highestCategory.category} (${formatCurrency(highestCategory.amount)})` : 'None'}
            </h3>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              {highestCategory ? `${highestCategory.percentage}% of overall expenses` : 'No data'}
            </span>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--success-bg)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TrendingUp size={24} />
          </div>
          <div>
            <span style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
              Net Savings Rate
            </span>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: savingsRate >= 0 ? 'var(--success)' : 'var(--danger)', marginTop: '2px' }}>
              {savingsRate}%
            </h3>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              {savingsRate >= 20 ? 'Target achieved (≥20%)' : 'Needs attention'}
            </span>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--warning-bg)', color: 'var(--warning)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileText size={24} />
          </div>
          <div>
            <span style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
              Total Flow Evaluated
            </span>
            <h3 style={{ fontSize: '20px', fontWeight: 800, marginTop: '2px' }}>
              {formatCurrency(Number(totalIncome) + Number(totalExpenses))}
            </h3>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Total turnover across all transactions
            </span>
          </div>
        </div>
      </div>

      {/* Visual Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '24px', marginBottom: '24px' }}>
        {/* Monthly Trend Bar Chart */}
        <div className="card">
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>6-Month Revenue & Spending Trend</h3>
          <div style={{ height: '320px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyComparisons} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={12} />
                <YAxis stroke="var(--text-muted)" fontSize={12} tickFormatter={(val) => `₹${val}`} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Bar dataKey="income" name="Income" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" name="Expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expense Category Distribution */}
        <div className="card">
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>Category Distribution</h3>
          {categoryBreakdown.length > 0 ? (
            <div style={{ height: '320px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryBreakdown}
                    dataKey="amount"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={110}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div style={{ height: '320px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
              No expense categories available.
            </div>
          )}
        </div>
      </div>

      {/* Category Wise Breakdown Table */}
      <div className="card">
        <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px' }}>Category Breakdown Summary</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th style={{ textAlign: 'right' }}>Total Spent</th>
                <th style={{ textAlign: 'right' }}>Percentage of Total</th>
                <th>Share Visual</th>
              </tr>
            </thead>
            <tbody>
              {categoryBreakdown.length > 0 ? (
                categoryBreakdown.map((cat, idx) => (
                  <tr key={cat.category}>
                    <td style={{ fontWeight: 600 }}>{cat.category}</td>
                    <td style={{ textAlign: 'right', fontWeight: 700 }}>{formatCurrency(cat.amount)}</td>
                    <td style={{ textAlign: 'right' }}>{cat.percentage}%</td>
                    <td style={{ width: '220px' }}>
                      <div className="progress-bar-bg" style={{ height: '8px' }}>
                        <div
                          className="progress-bar-fill"
                          style={{
                            width: `${Math.min(cat.percentage, 100)}%`,
                            backgroundColor: COLORS[idx % COLORS.length]
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                    No expense data found to calculate category distribution.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
