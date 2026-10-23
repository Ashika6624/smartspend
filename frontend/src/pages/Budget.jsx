import React, { useState, useEffect } from 'react';
import { PiggyBank, PlusCircle, AlertTriangle, CheckCircle, Trash2, Sliders } from 'lucide-react';
import { budgetService } from '../services/api';

const CATEGORIES = ['OVERALL', 'Food', 'Travel', 'Shopping', 'Education', 'Bills', 'Entertainment', 'Healthcare', 'Other'];

const Budget = () => {
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [budgetStatus, setBudgetStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modal / Form state
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    category: 'OVERALL',
    budgetAmount: '',
    month: currentDate.getMonth() + 1,
    year: currentDate.getFullYear()
  });

  const fetchStatus = async () => {
    try {
      setLoading(true);
      const res = await budgetService.getStatus({ month: selectedMonth, year: selectedYear });
      setBudgetStatus(res);
    } catch (err) {
      console.error('Failed to load budget status:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, [selectedMonth, selectedYear]);

  const handleSaveBudget = async (e) => {
    e.preventDefault();
    if (!formData.budgetAmount || Number(formData.budgetAmount) <= 0) {
      alert('Please enter a valid budget amount');
      return;
    }

    try {
      await budgetService.saveOrUpdate({
        ...formData,
        budgetAmount: parseFloat(formData.budgetAmount),
        month: selectedMonth,
        year: selectedYear
      });
      setShowAddModal(false);
      setFormData({
        category: 'OVERALL',
        budgetAmount: '',
        month: selectedMonth,
        year: selectedYear
      });
      fetchStatus();
    } catch (err) {
      console.error('Failed to save budget:', err);
      alert(err.response?.data?.message || 'Error saving budget');
    }
  };

  const handleDeleteBudget = async (id) => {
    if (!window.confirm('Are you sure you want to remove this budget target?')) return;
    try {
      await budgetService.delete(id);
      fetchStatus();
    } catch (err) {
      console.error('Failed to delete budget:', err);
      alert('Error deleting budget');
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

  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' }
  ];

  const getStatusColor = (status) => {
    if (status === 'EXCEEDED') return 'var(--danger)';
    if (status === 'WARNING') return 'var(--warning)';
    return 'var(--success)';
  };

  return (
    <div>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 800 }}>Budget Management</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            Set monthly spending caps, monitor category budgets, and prevent overspending with automated alerts.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <select
            className="form-select"
            style={{ width: '150px' }}
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
          >
            {months.map((m) => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>

          <select
            className="form-select"
            style={{ width: '110px' }}
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
          >
            {[2024, 2025, 2026, 2027].map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>

          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            <PlusCircle size={18} /> Set Budget
          </button>
        </div>
      </div>

      {/* Main Monthly Budget Overview Card */}
      {budgetStatus && (
        <div className="card" style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px' }}>
            <div>
              <span style={{ fontSize: '13px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
                Monthly Overall Budget
              </span>
              <h1 style={{ fontSize: '28px', fontWeight: 800, marginTop: '4px' }}>
                {budgetStatus.monthlyBudget > 0 ? formatCurrency(budgetStatus.monthlyBudget) : 'No Budget Set'}
              </h1>
            </div>

            {budgetStatus.monthlyBudget > 0 && (
              <div
                className="badge"
                style={{
                  backgroundColor: getStatusColor(budgetStatus.status) + '22',
                  color: getStatusColor(budgetStatus.status),
                  padding: '6px 14px',
                  fontSize: '13px'
                }}
              >
                {budgetStatus.status === 'EXCEEDED' && <AlertTriangle size={15} />}
                {budgetStatus.status === 'WARNING' && <AlertTriangle size={15} />}
                {budgetStatus.status === 'NORMAL' && <CheckCircle size={15} />}
                {budgetStatus.status === 'EXCEEDED' ? 'Budget Exceeded' : budgetStatus.status === 'WARNING' ? 'Approaching Limit' : 'On Track'}
              </div>
            )}
          </div>

          {budgetStatus.monthlyBudget > 0 ? (
            <div>
              {/* Progress Bar */}
              <div className="progress-bar-bg" style={{ height: '14px', marginBottom: '12px' }}>
                <div
                  className="progress-bar-fill"
                  style={{
                    width: `${Math.min(budgetStatus.percentageUsed, 100)}%`,
                    backgroundColor: getStatusColor(budgetStatus.status)
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: 'var(--text-muted)' }}>
                <span>
                  <strong>Spent:</strong> {formatCurrency(budgetStatus.totalExpense)} ({budgetStatus.percentageUsed}%)
                </span>
                <span>
                  <strong>Remaining:</strong>{' '}
                  <span style={{ color: budgetStatus.remainingBudget < 0 ? 'var(--danger)' : 'var(--success)', fontWeight: 700 }}>
                    {formatCurrency(budgetStatus.remainingBudget)}
                  </span>
                </span>
              </div>

              {budgetStatus.alertMessage && (
                <div
                  style={{
                    marginTop: '16px',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '13.5px',
                    backgroundColor: getStatusColor(budgetStatus.status) + '15',
                    color: getStatusColor(budgetStatus.status),
                    fontWeight: 600
                  }}
                >
                  {budgetStatus.alertMessage}
                </div>
              )}
            </div>
          ) : (
            <div style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
              You haven't defined an overall budget cap for this month yet. Click "Set Budget" to define one!
            </div>
          )}
        </div>
      )}

      {/* Category Budgets Grid */}
      <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>Category Budgets</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
        {budgetStatus?.categoryStatuses && budgetStatus.categoryStatuses.length > 0 ? (
          budgetStatus.categoryStatuses.map((cat) => (
            <div key={cat.budgetId} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h4 style={{ fontSize: '16px', fontWeight: 700 }}>{cat.category}</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    className="badge"
                    style={{
                      backgroundColor: getStatusColor(cat.status) + '22',
                      color: getStatusColor(cat.status)
                    }}
                  >
                    {cat.percentageUsed}%
                  </span>
                  <button
                    className="icon-btn"
                    style={{ width: '28px', height: '28px', color: 'var(--danger)' }}
                    title="Delete Category Budget"
                    onClick={() => handleDeleteBudget(cat.budgetId)}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              <div style={{ marginBottom: '10px' }}>
                <div className="progress-bar-bg" style={{ height: '8px', marginBottom: '8px' }}>
                  <div
                    className="progress-bar-fill"
                    style={{
                      width: `${Math.min(cat.percentageUsed, 100)}%`,
                      backgroundColor: getStatusColor(cat.status)
                    }}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-muted)' }}>
                  <span>Spent: {formatCurrency(cat.spentAmount)}</span>
                  <span>Limit: {formatCurrency(cat.budgetAmount)}</span>
                </div>
              </div>

              <div style={{ fontSize: '13px', color: cat.remainingAmount < 0 ? 'var(--danger)' : 'var(--text-muted)' }}>
                <strong>{cat.remainingAmount < 0 ? 'Over budget by:' : 'Remaining:'}</strong>{' '}
                {formatCurrency(Math.abs(cat.remainingAmount))}
              </div>
            </div>
          ))
        ) : (
          <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            No category-specific budgets set for this month. Set budgets for Food, Shopping, Bills, etc. to monitor specific categories!
          </div>
        )}
      </div>

      {/* Set Budget Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Set Monthly Budget</h3>
              <button className="icon-btn" onClick={() => setShowAddModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSaveBudget}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="form-select"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c === 'OVERALL' ? 'Overall Monthly Budget' : c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Budget Amount (₹) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    className="form-input"
                    placeholder="e.g. 10000"
                    value={formData.budgetAmount}
                    onChange={(e) => setFormData({ ...formData, budgetAmount: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Budget
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Budget;
