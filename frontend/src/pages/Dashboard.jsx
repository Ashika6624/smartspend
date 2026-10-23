import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  AlertTriangle,
  PlusCircle,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  PiggyBank
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import { dashboardService, transactionService } from '../services/api';
import SummaryCard from '../components/SummaryCard';
import TransactionForm from '../components/TransactionForm';

const PIE_COLORS = ['#ef4444', '#f59e0b', '#3b82f6', '#10b981', '#8b5cf6', '#ec4899', '#06b6d4', '#64748b'];

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [defaultType, setDefaultType] = useState('EXPENSE');

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const res = await dashboardService.getSummary();
      setData(res);
    } catch (err) {
      console.error('Failed to load dashboard summary:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  const handleOpenModal = (type) => {
    setDefaultType(type);
    setModalOpen(true);
  };

  const handleCreateTransaction = async (formData) => {
    try {
      await transactionService.create(formData);
      setModalOpen(false);
      fetchSummary();
    } catch (err) {
      console.error('Failed to create transaction:', err);
      alert(err.response?.data?.message || 'Failed to save transaction');
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

  if (loading && !data) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
        <p>Loading dashboard overview...</p>
      </div>
    );
  }

  const {
    totalIncome = 0,
    totalExpenses = 0,
    availableBalance = 0,
    currentMonthIncome = 0,
    currentMonthExpenses = 0,
    categoryBreakdown = [],
    monthlyComparisons = [],
    recentTransactions = [],
    budgetStatus = {}
  } = data || {};

  return (
    <div>
      {/* Top action bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 800 }}>Financial Overview</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            Monitor your cash flow, analyze monthly spending, and stay within your budget.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-success" onClick={() => handleOpenModal('INCOME')}>
            <PlusCircle size={17} /> Add Income
          </button>
          <button className="btn btn-danger" onClick={() => handleOpenModal('EXPENSE')}>
            <PlusCircle size={17} /> Add Expense
          </button>
        </div>
      </div>

      {/* Budget Warning Alert (if applicable) */}
      {budgetStatus && budgetStatus.monthlyBudget > 0 && budgetStatus.status !== 'NORMAL' && (
        <div className={`alert-box ${budgetStatus.status === 'EXCEEDED' ? 'alert-danger' : 'alert-warning'}`}>
          <AlertTriangle size={20} />
          <div style={{ flex: 1 }}>
            <strong>{budgetStatus.status === 'EXCEEDED' ? 'Budget Exceeded!' : 'Budget Warning!'}</strong>{' '}
            {budgetStatus.alertMessage} (Spent {formatCurrency(budgetStatus.totalExpense)} of {formatCurrency(budgetStatus.monthlyBudget)} budget)
          </div>
        </div>
      )}

      {/* Metric Cards Grid */}
      <div className="stat-grid">
        <SummaryCard
          title="Total Income"
          amount={totalIncome}
          subtitle={`This Month: ${formatCurrency(currentMonthIncome)}`}
          icon={<TrendingUp size={24} />}
          variant="income"
        />
        <SummaryCard
          title="Total Expenses"
          amount={totalExpenses}
          subtitle={`This Month: ${formatCurrency(currentMonthExpenses)}`}
          icon={<TrendingDown size={24} />}
          variant="expense"
        />
        <SummaryCard
          title="Available Balance"
          amount={availableBalance}
          subtitle={availableBalance >= 0 ? 'Healthy Net Savings' : 'Deficit Warning'}
          icon={<Wallet size={24} />}
          variant={availableBalance >= 0 ? 'balance' : 'expense'}
        />
        <SummaryCard
          title="Monthly Budget Limit"
          amount={budgetStatus?.monthlyBudget || 0}
          subtitle={
            budgetStatus?.monthlyBudget > 0
              ? `${budgetStatus.percentageUsed}% used | Remaining: ${formatCurrency(budgetStatus.remainingBudget)}`
              : 'No monthly limit set'
          }
          icon={<PiggyBank size={24} />}
          variant="budget"
        />
      </div>

      {/* Charts Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '24px', marginBottom: '24px' }}>
        {/* Expenses by Category Donut Chart */}
        <div className="card">
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>Expenses by Category</h3>
          {categoryBreakdown.length > 0 ? (
            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryBreakdown}
                    dataKey="amount"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={105}
                    paddingAngle={3}
                  >
                    {categoryBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
              No expenses recorded yet.
            </div>
          )}
        </div>

        {/* Monthly Income vs Expense Bar Chart */}
        <div className="card">
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>Income vs Expenses (Last 6 Months)</h3>
          {monthlyComparisons.length > 0 ? (
            <div style={{ height: '300px' }}>
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
          ) : (
            <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
              No history available.
            </div>
          )}
        </div>
      </div>

      {/* Recent Transactions Table */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Recent Transactions</h3>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Showing last {recentTransactions.length} items</span>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Title</th>
                <th>Category</th>
                <th>Date</th>
                <th>Notes</th>
                <th style={{ textAlign: 'right' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.length > 0 ? (
                recentTransactions.map((t) => (
                  <tr key={t.id}>
                    <td>
                      <span className={`badge ${t.type === 'INCOME' ? 'badge-income' : 'badge-expense'}`}>
                        {t.type === 'INCOME' ? <ArrowDownLeft size={13} /> : <ArrowUpRight size={13} />}
                        {t.type}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600 }}>{t.title}</td>
                    <td>{t.category}</td>
                    <td>{t.transactionDate}</td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{t.notes || '—'}</td>
                    <td
                      style={{
                        textAlign: 'right',
                        fontWeight: 700,
                        color: t.type === 'INCOME' ? 'var(--success)' : 'var(--danger)'
                      }}
                    >
                      {t.type === 'INCOME' ? '+' : '-'}{formatCurrency(t.amount)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                    No recent transactions found. Click "Add Income" or "Add Expense" above to start!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Modal */}
      <TransactionForm
        isOpen={modalOpen}
        defaultType={defaultType}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreateTransaction}
      />
    </div>
  );
};

export default Dashboard;
