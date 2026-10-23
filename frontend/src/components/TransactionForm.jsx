import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Allowance', 'Scholarship', 'Investment', 'Other'];
const EXPENSE_CATEGORIES = ['Food', 'Travel', 'Shopping', 'Education', 'Bills', 'Entertainment', 'Healthcare', 'Other'];

const TransactionForm = ({ isOpen, onClose, onSubmit, initialData = null, defaultType = 'EXPENSE' }) => {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    type: defaultType,
    category: defaultType === 'INCOME' ? 'Salary' : 'Food',
    transactionDate: new Date().toISOString().slice(0, 10),
    notes: ''
  });

  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        amount: initialData.amount || '',
        type: initialData.type || defaultType,
        category: initialData.category || (defaultType === 'INCOME' ? 'Salary' : 'Food'),
        transactionDate: initialData.transactionDate || new Date().toISOString().slice(0, 10),
        notes: initialData.notes || ''
      });
    } else {
      setFormData({
        title: '',
        amount: '',
        type: defaultType,
        category: defaultType === 'INCOME' ? 'Salary' : 'Food',
        transactionDate: new Date().toISOString().slice(0, 10),
        notes: ''
      });
    }
    setError('');
  }, [initialData, defaultType, isOpen]);

  if (!isOpen) return null;

  const handleTypeChange = (e) => {
    const newType = e.target.value;
    setFormData({
      ...formData,
      type: newType,
      category: newType === 'INCOME' ? 'Salary' : 'Food'
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Please provide a transaction title');
      return;
    }
    if (!formData.amount || Number(formData.amount) <= 0) {
      setError('Amount must be greater than zero');
      return;
    }
    if (!formData.transactionDate) {
      setError('Please choose a valid date');
      return;
    }

    onSubmit({
      ...formData,
      amount: parseFloat(formData.amount)
    });
  };

  const categories = formData.type === 'INCOME' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3 className="modal-title">
            {initialData ? 'Edit Transaction' : `Add ${formData.type === 'INCOME' ? 'Income' : 'Expense'}`}
          </h3>
          <button className="icon-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && (
              <div className="alert-box alert-danger">
                <span>{error}</span>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Transaction Type</label>
              <select
                className="form-select"
                value={formData.type}
                onChange={handleTypeChange}
              >
                <option value="INCOME">Income</option>
                <option value="EXPENSE">Expense</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Title / Description *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Monthly Salary, Grocery Shopping"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Amount (₹) *</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                className="form-input"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category *</label>
              <select
                className="form-select"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Transaction Date *</label>
              <input
                type="date"
                className="form-input"
                value={formData.transactionDate}
                onChange={(e) => setFormData({ ...formData, transactionDate: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Notes (Optional)</label>
              <textarea
                rows="2"
                className="form-textarea"
                placeholder="Additional remarks or receipt details..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className={`btn ${formData.type === 'INCOME' ? 'btn-success' : 'btn-danger'}`}
            >
              {initialData ? 'Update Transaction' : 'Save Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;
