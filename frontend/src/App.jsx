import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Income from './pages/Income';
import Expenses from './pages/Expenses';
import Budget from './pages/Budget';
import Reports from './pages/Reports';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  const location = useLocation();

  // Dark/Light Theme State
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('smartspend_theme') || 'light';
  });

  // User Authentication State
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('smartspend_user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('smartspend_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleLogout = () => {
    setUser(null);
  };

  // Determine current page title
  const getPageTitle = (pathname) => {
    switch (pathname) {
      case '/':
        return 'Dashboard';
      case '/income':
        return 'Income Management';
      case '/expenses':
        return 'Expense Management';
      case '/budget':
        return 'Budget Planner';
      case '/reports':
        return 'Reports & Analytics';
      default:
        return 'SmartSpend';
    }
  };

  const isAuthenticated = !!localStorage.getItem('smartspend_token');

  return (
    <div className="app-root">
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/" replace /> : <Login onLoginSuccess={setUser} />
          }
        />
        <Route
          path="/register"
          element={
            isAuthenticated ? <Navigate to="/" replace /> : <Register onLoginSuccess={setUser} />
          }
        />

        {/* Protected Dashboard Layout */}
        <Route
          path="/*"
          element={
            isAuthenticated ? (
              <div className="app-container">
                <Sidebar />
                <div className="main-content">
                  <Navbar
                    title={getPageTitle(location.pathname)}
                    theme={theme}
                    toggleTheme={toggleTheme}
                    user={user}
                    onLogout={handleLogout}
                  />
                  <main className="page-body">
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/income" element={<Income />} />
                      <Route path="/expenses" element={<Expenses />} />
                      <Route path="/budget" element={<Budget />} />
                      <Route path="/reports" element={<Reports />} />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </main>
                </div>
              </div>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </div>
  );
}

export default App;
