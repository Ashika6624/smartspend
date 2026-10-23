import React from 'react';

const SummaryCard = ({ title, amount, subtitle, icon, variant = 'balance' }) => {
  const formatCurrency = (val) => {
    const num = Number(val) || 0;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(num);
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'income':
        return { text: 'income-color', bg: 'income-bg' };
      case 'expense':
        return { text: 'expense-color', bg: 'expense-bg' };
      case 'budget':
        return { text: 'budget-color', bg: 'budget-bg' };
      default:
        return { text: 'balance-color', bg: 'balance-bg' };
    }
  };

  const colors = getVariantClasses();

  return (
    <div className="summary-card">
      <div className="summary-card-info">
        <h4>{title}</h4>
        <div className={`summary-card-amount ${colors.text}`}>
          {formatCurrency(amount)}
        </div>
        {subtitle && (
          <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '4px' }}>
            {subtitle}
          </p>
        )}
      </div>
      <div className={`summary-card-icon ${colors.bg} ${colors.text}`}>
        {icon}
      </div>
    </div>
  );
};

export default SummaryCard;
