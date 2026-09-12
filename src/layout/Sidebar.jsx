import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/slices/authSlice";

const navItems = [
  {
    path: "/dashboard",
    label: "Dashboard",
    icon: "fa-solid fa-chart-pie",
    badgeColor:
      "text-indigo-400 bg-indigo-500/10 border-indigo-500/20 group-hover:bg-indigo-500/20",
    activeBadge: "text-white bg-indigo-500 shadow-glow-indigo",
  },
  {
    path: "/transactions",
    label: "Transactions",
    icon: "fa-solid fa-arrow-right-arrow-left",
    badgeColor:
      "text-emerald-400 bg-emerald-500/10 border-emerald-500/20 group-hover:bg-emerald-500/20",
    activeBadge: "text-white bg-emerald-500 shadow-glow-income",
  },
  {
    path: "/categories",
    label: "Categories",
    icon: "fa-solid fa-layer-group",
    badgeColor:
      "text-amber-400 bg-amber-500/10 border-amber-500/20 group-hover:bg-amber-500/20",
    activeBadge: "text-white bg-amber-500 shadow-glow",
  },
  {
    path: "/budgets",
    label: "Budgets",
    icon: "fa-solid fa-bullseye",
    badgeColor:
      "text-rose-400 bg-rose-500/10 border-rose-500/20 group-hover:bg-rose-500/20",
    activeBadge: "text-white bg-rose-500 shadow-glow-expense",
  },
  {
    path: "/savings-goals",
    label: "Savings Goals",
    icon: "fa-solid fa-piggy-bank",
    badgeColor:
      "text-cyan-400 bg-cyan-500/10 border-cyan-500/20 group-hover:bg-cyan-500/20",
    activeBadge: "text-white bg-cyan-500 shadow-glow-cyan",
  },
  {
    path: "/analytics",
    label: "Analytics",
    icon: "fa-solid fa-chart-line",
    badgeColor:
      "text-purple-400 bg-purple-500/10 border-purple-500/20 group-hover:bg-purple-500/20",
    activeBadge: "text-white bg-purple-500 shadow-glow",
  },
];

export default function Sidebar({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
    onClose();
  };

  const displayName = user?.username || user?.name || "User";
  const firstLetter = displayName.charAt(0).toUpperCase();

  return (
    <>
      {/* Mobile overlay with blur */}
      {isOpen && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-md md:hidden cursor-default transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={[
          "fixed top-0 left-0 h-screen z-50 w-64 flex flex-col justify-between",
          "bg-bg-sidebar/95 backdrop-blur-xl border-r border-border/80 shadow-2xl",
          "transition-transform duration-300 ease-smooth",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0",
        ].join(" ")}
      >
        {/* Top Header / Brand + Nav (scrollable) */}
        <div className="flex-1 min-h-0 flex flex-col overflow-y-auto">
          <div className="flex items-center justify-between px-5 h-20 border-b border-border/60">
            <div className="flex items-center gap-3.5">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center shadow-lg flex-shrink-0 ring-1 ring-inset ring-white/5">
                  <i className="fa-solid fa-chart-simple text-cyan-400 text-base" />
                </div>
                <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-cyan-400 border-2 border-bg-sidebar" />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h1 className="text-base font-extrabold text-text-primary tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                    Finance360
                  </h1>
                </div>
                <span className="text-[11px] font-medium text-text-muted tracking-wide">
                  Financial Control Hub
                </span>
              </div>
            </div>

            {/* Mobile close button */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg text-text-muted hover:text-text-primary hover:bg-white/5 transition-all"
            >
              <i className="fa-solid fa-xmark text-sm" />
            </button>
          </div>

          {/* Navigation Section */}
          <div className="px-3 pt-4">
            <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-text-muted/60">
              Overview & Tools
            </p>

            <nav className="flex flex-col gap-1.5">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    [
                      "relative group flex items-center gap-3 px-3 py-2.5 rounded-xl",
                      "text-sm font-medium transition-all duration-200",
                      "hover:translate-x-1",
                      isActive
                        ? "bg-gradient-to-r from-accent-primary/15 via-accent-primary/10 to-transparent text-white border border-accent-primary/25 shadow-glow"
                        : "text-text-secondary hover:text-white hover:bg-white/[0.04] border border-transparent",
                    ].join(" ")
                  }
                >
                  {({ isActive }) => (
                    <>
                      {/* Active indicator bar */}
                      {isActive && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-accent-primary shadow-[0_0_10px_#6366f1]" />
                      )}

                      {/* Icon container */}
                      <span
                        className={[
                          "w-8 h-8 flex items-center justify-center rounded-lg text-xs flex-shrink-0 transition-all duration-200 border",
                          isActive
                            ? `${item.activeBadge} border-transparent`
                            : `${item.badgeColor}`,
                        ].join(" ")}
                      >
                        <i className={item.icon} />
                      </span>

                      <span className="tracking-tight font-medium">
                        {item.label}
                      </span>

                      {/* Hover subtle arrow */}
                      <i
                        className={[
                          "fa-solid fa-chevron-right text-[9px] ml-auto transition-all duration-200",
                          isActive
                            ? "text-accent-primary opacity-100"
                            : "text-text-muted opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5",
                        ].join(" ")}
                      />
                    </>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>

        {/* Bottom Section: User Profile & Logout */}
        <div className="p-3 border-t border-border/60 flex flex-col gap-2 bg-gradient-to-t from-bg-primary/50 to-transparent flex-shrink-0">
          {/* User Profile Card */}
          <NavLink
            to="/profile"
            onClick={onClose}
            className="group flex items-center justify-between gap-3 p-2.5 rounded-xl bg-bg-tertiary/40 hover:bg-bg-tertiary/80 border border-border/50 hover:border-accent-primary/30 transition-all duration-200 cursor-pointer shadow-sm"
          >
            {/* User Avatar + Info */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative flex-shrink-0">
                <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center text-white text-xs font-bold shadow-glow-indigo ring-1 ring-white/20 group-hover:scale-105 transition-transform">
                  {firstLetter}
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-income ring-2 ring-bg-sidebar" />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-bold text-text-primary truncate group-hover:text-accent-primary transition-colors">
                  {displayName}
                </p>
                <p className="text-[10px] font-medium text-text-muted flex items-center gap-1 mt-0.5">
                  <i className="fa-solid fa-shield-halved text-[7px] text-income" />
                  Personal Account
                </p>
              </div>
            </div>

            {/* View Profile Pill */}
            <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-accent-primary/10 group-hover:bg-accent-primary text-accent-primary group-hover:text-white text-[10px] font-semibold transition-all duration-200 flex-shrink-0 border border-accent-primary/20 group-hover:border-transparent">
              <span>View</span>
              <i className="fa-solid fa-arrow-right text-[8px] group-hover:translate-x-0.5 transition-transform" />
            </div>
          </NavLink>

          {/* Logout Button */}
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-text-muted hover:text-expense hover:bg-expense/10 border border-transparent hover:border-expense/20 transition-all duration-200 w-full"
          >
            <i className="fa-solid fa-right-from-bracket text-xs" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
