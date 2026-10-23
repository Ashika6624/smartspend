import React, { useState, useEffect } from 'react';
import { PlusCircle, Search, Edit2, Trash2, ArrowDownLeft, Filter } from 'lucide-react';
import { transactionService } from '../services/api';
import TransactionForm from '../components/TransactionForm';

const INCOME_CATEGORIES = ['All Categories', 'Salary', 'Freelance', 'Allowance', 'Scholarship', 'Investment', 'Other'];

const Income = () => {
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchIncomes = async () => {
    try {
      setLoading(true);
      const params = {
        type: 'INCOME',
        search: search.trim() || undefined,
        category: selectedCategory !== 'All Categories' ? selectedCategory : undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined
      };
      const res = await transactionService.getAll(params);
      setIncomes(res);
    } catch (err) {
      console.error('Failed to load income:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncomes();
  }, [selectedCategory, startDate, endDate]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchIncomes();
  };

  const handleOpenAddModal = () => {
    setEditingTransaction(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (t) => {
    setEditingTransaction(t);
    setModalOpen(true);
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingTransaction) {
        await transactionService.update(editingTransaction.id, formData);
      } else {
        await transactionService.create(formData);
      }
      setModalOpen(false);
      setEditingTransaction(null);
      fetchIncomes();
    } catch (err) {
      console.error('Error saving income:', err);
      alert(err.response?.data?.message || 'Error saving income');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this income record?')) return;
    try {
      await transactionService.delete(id);
      fetchIncomes();
    } catch (err) {
      console.error('Error deleting income:', err);
      alert('Error deleting income');
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

  const totalFilteredIncome = incomes.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

  return (
    <div>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 800 }}>Income Management</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            Record, categorize, and track all incoming cash flow and revenues.
          </p>
        </div>
        <button className="btn btn-success" onClick={handleOpenAddModal}>
          <PlusCircle size={18} /> Add New Income
        </button>
      </div>

      {/* Summary Highlight */}
      <div
        className="card"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px',
          background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
          color: '#ffffff'
        }}
      >
        <div>
          <span style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px', opacity: 0.9 }}>
            Total Incomes Recorded
          </span>
          <h1 style={{ fontSize: '32px', fontWeight: 800, margin: '4px 0' }}>
            {formatCurrency(totalFilteredIncome)}
          </h1>
          <span style={{ fontSize: '13px', opacity: 0.9 }}>{incomes.length} records matching criteria</span>
        </div>
        <div style={{ background: 'rgba(255, 255, 255, 0.2)', padding: '16px', borderRadius: '50%' }}>
          <ArrowDownLeft size={36} color="#ffffff" />
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center' }}>
          <div style={{ flex: '1 1 200px', display: 'flex', alignItems: 'center', position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '38px' }}
              placeholder="Search income by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={{ flex: '0 1 180px' }}>
            <select
              className="form-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {INCOME_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div style={{ flex: '0 1 150px' }}>
            <input
              type="date"
              className="form-input"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              title="From date"
            />
          </div>

          <div style={{ flex: '0 1 150px' }}>
            <input
              type="date"
              className="form-input"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              title="To date"
            />
          </div>

          <button type="submit" className="btn btn-primary btn-sm" style={{ height: '42px' }}>
            <Filter size={15} /> Apply
          </button>
          {(search || selectedCategory !== 'All Categories' || startDate || endDate) && (
            <button
              type="button"
              className="btn btn-outline btn-sm"
              style={{ height: '42px' }}
              onClick={() => {
                setSearch('');
                setSelectedCategory('All Categories');
                setStartDate('');
                setEndDate('');
              }}
            >
              Reset
            </button>
          )}
        </form>
      </div>

      {/* Table of Income Records */}
      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Date</th>
                <th>Notes</th>
                <th style={{ textAlign: 'right' }}>Amount</th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                    Loading income records...
                  </td>
                </tr>
              ) : incomes.length > 0 ? (
                incomes.map((inc) => (
                  <tr key={inc.id}>
                    <td style={{ fontWeight: 600 }}>{inc.title}</td>
                    <td>
                      <span className="badge badge-income">{inc.category}</span>
                    </td>
                    <td>{inc.transactionDate}</td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{inc.notes || '—'}</td>
                    <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--success)' }}>
                      +{formatCurrency(inc.amount)}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'inline-flex', gap: '8px' }}>
                        <button
                          className="icon-btn"
                          style={{ width: '30px', height: '30px' }}
                          title="Edit"
                          onClick={() => handleOpenEditModal(inc)}
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          className="icon-btn"
                          style={{ width: '30px', height: '30px', color: 'var(--danger)' }}
                          title="Delete"
                          onClick={() => handleDelete(inc.id)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    No income entries found. Click "Add New Income" above to register one!
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
        defaultType="INCOME"
        initialData={editingTransaction}
        onClose={() => {
          setModalOpen(false);
          setEditingTransaction(null);
        }}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default Income;
