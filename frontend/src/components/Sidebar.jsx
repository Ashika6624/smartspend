import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  TrendingUp,
  TrendingDown,
  PieChart,
  BarChart3,
  WalletCards
} from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { to: '/', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { to: '/income', label: 'Income', icon: <TrendingUp size={20} /> },
    { to: '/expenses', label: 'Expenses', icon: <TrendingDown size={20} /> },
    { to: '/budget', label: 'Budget Planner', icon: <PieChart size={20} /> },
    { to: '/reports', label: 'Reports & Export', icon: <BarChart3 size={20} /> }
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo-icon">
          <WalletCards size={22} />
        </div>
        <span className="logo-text">SmartSpend</span>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <p><strong>SmartSpend v1.0</strong></p>
        <p>Spring Boot + React + MySQL</p>
      </div>
    </aside>
  );
};

export default Sidebar;
