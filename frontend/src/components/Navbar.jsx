import React from 'react';
import { Sun, Moon, LogOut, User as UserIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ title, theme, toggleTheme, user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('smartspend_token');
    localStorage.removeItem('smartspend_user');
    if (onLogout) onLogout();
    navigate('/login');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="navbar">
      <h1 className="navbar-title">{title}</h1>

      <div className="navbar-actions">
        {/* Theme Toggle */}
        <button
          className="icon-btn"
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
        </button>

        {/* User Pill */}
        {user && (
          <div className="user-pill">
            <div className="user-avatar">{getInitials(user.name)}</div>
            <div className="user-info">
              <span className="user-name">{user.name}</span>
            </div>
          </div>
        )}

        {/* Logout Button */}
        <button className="icon-btn" onClick={handleLogout} title="Log out">
          <LogOut size={19} />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
