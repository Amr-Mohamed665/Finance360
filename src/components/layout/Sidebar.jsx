import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import './Sidebar.css';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: 'fa-solid fa-chart-pie', color: '#6366f1' },
  { path: '/transactions', label: 'Transactions', icon: 'fa-solid fa-money-bill-transfer', color: '#10b981' },
  { path: '/budgets', label: 'Budgets', icon: 'fa-solid fa-bullseye', color: '#f43f5e' },
  { path: '/savings-goals', label: 'Savings Goals', icon: 'fa-solid fa-piggy-bank', color: '#06b6d4' },
  { path: '/analytics', label: 'Analytics', icon: 'fa-solid fa-chart-line', color: '#a855f7' },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <>
      <button
        className="sidebar-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        <span className={`hamburger ${isOpen ? 'hamburger--active' : ''}`}>
          <span></span>
          <span></span>
          <span></span>
        </span>
      </button>

      {isOpen && <div className="sidebar-overlay" onClick={() => setIsOpen(false)} />}

      <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
        <div className="sidebar__brand">
          <span className="sidebar__logo"><i className="fa-solid fa-coins" style={{ color: '#ffd700' }}></i></span>
          <div className="sidebar__brand-text">
            <h1 className="sidebar__title">Finance 360</h1>
            <span className="sidebar__subtitle">Personal Dashboard</span>
          </div>
        </div>

        <nav className="sidebar__nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
              }
              onClick={() => setIsOpen(false)}
            >
              <span className="sidebar__link-icon"><i className={item.icon} style={{ color: item.color }}></i></span>
              <span className="sidebar__link-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar__footer">
          <div className="sidebar__user">
            <div className="sidebar__avatar">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="sidebar__user-info">
              <span className="sidebar__user-name">{user?.name || 'User'}</span>
              <span className="sidebar__user-email">{user?.email || ''}</span>
            </div>
          </div>
          <button className="sidebar__logout" onClick={handleLogout}>
            <i className="fa-solid fa-right-from-bracket" style={{ color: 'var(--danger)' }}></i> Logout
          </button>
        </div>
      </aside>
    </>
  );
}
