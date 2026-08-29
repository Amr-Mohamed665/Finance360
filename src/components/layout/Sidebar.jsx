import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';

const navItems = [
  { path: '/dashboard',     label: 'Dashboard',     icon: 'fa-solid fa-chart-pie',           color: '#6366f1' },
  { path: '/transactions',  label: 'Transactions',  icon: 'fa-solid fa-money-bill-transfer',  color: '#10b981' },
  { path: '/budgets',       label: 'Budgets',       icon: 'fa-solid fa-bullseye',             color: '#f43f5e' },
  { path: '/savings-goals', label: 'Savings Goals', icon: 'fa-solid fa-piggy-bank',           color: '#06b6d4' },
  { path: '/analytics',     label: 'Analytics',     icon: 'fa-solid fa-chart-line',           color: '#a855f7' },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { user }  = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <>
      {/* Mobile hamburger */}
      <button
        className="fixed top-4 left-4 z-50 flex md:hidden w-10 h-10 items-center justify-center rounded-lg bg-bg-secondary border border-border shadow-md transition-all duration-150 hover:border-border-hover"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        <div className="flex flex-col gap-[5px] w-5">
          <span className={`block h-0.5 bg-text-secondary rounded-full transition-all duration-200 origin-center ${isOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
          <span className={`block h-0.5 bg-text-secondary rounded-full transition-all duration-200 ${isOpen ? 'opacity-0 scale-x-0' : ''}`} />
          <span className={`block h-0.5 bg-text-secondary rounded-full transition-all duration-200 origin-center ${isOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
        </div>
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={[
          'fixed top-0 left-0 h-full z-40 w-64 flex flex-col bg-bg-sidebar border-r border-border transition-transform duration-300 ease-smooth',
          'md:translate-x-0 md:static md:h-screen',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
      >
        {/* Brand */}
        <div className="flex items-center gap-3 px-5 py-6 border-b border-border">
          <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow flex-shrink-0">
            <i className="fa-solid fa-coins text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-text-primary leading-none">Finance 360</h1>
            <span className="text-xs text-text-muted">Personal Dashboard</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                [
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group',
                  isActive
                    ? 'bg-accent-primary/15 text-text-primary border border-accent-primary/20 shadow-glow'
                    : 'text-text-muted hover:bg-bg-hover hover:text-text-secondary border border-transparent',
                ].join(' ')
              }
            >
              <span
                className="w-8 h-8 flex items-center justify-center rounded-md text-sm flex-shrink-0"
                style={{ color: item.color, background: `${item.color}18` }}
              >
                <i className={item.icon} />
              </span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User + Logout */}
        <div className="px-3 py-4 border-t border-border flex flex-col gap-2">
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-bg-hover">
            <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-text-primary truncate">{user?.name || 'User'}</p>
              <p className="text-[11px] text-text-muted truncate">{user?.email || ''}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-text-muted hover:text-expense hover:bg-expense/10 transition-all duration-150 w-full"
          >
            <i className="fa-solid fa-right-from-bracket text-sm" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
