import { useLocation } from "react-router-dom";

const pageInfo = {
  "/dashboard": {
    title: "Dashboard",
    subtitle: "Overview of your financial activity",
  },

  "/transactions": {
    title: "Transactions",
    subtitle: "Track and manage your income and expenses",
  },

  "/categories": {
    title: "Categories",
    subtitle: "Organize your financial transactions",
  },

  "/budgets": {
    title: "Budgets",
    subtitle: "Plan and control your monthly spending",
  },

  "/savings-goals": {
    title: "Savings Goals",
    subtitle: "Track your progress towards your goals",
  },

  "/analytics": {
    title: "Analytics",
    subtitle: "Understand your financial patterns",
  },

  "/profile": {
    title: "User Profile",
    subtitle: "Manage your personal account and preferences",
  },

  "/profile/edit": {
    title: "Edit Profile",
    subtitle: "Update your personal details and password",
  },
};

export default function Header({ onMenuClick }) {
  const location = useLocation();

  const currentPage = pageInfo[location.pathname] || {
    title: "Finance 360",
    subtitle: "Personal Finance Dashboard",
  };

  return (
    <header className="sticky top-0 z-30 h-20 flex-shrink-0 bg-bg-primary/90 backdrop-blur-card border-b border-border">
      <div className="relative h-full flex items-center justify-center px-4 md:px-8">
        {/* Mobile Menu */}
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open menu"
          className="
            md:hidden
            absolute left-4
            w-9 h-9
            flex items-center justify-center
            rounded-lg
            bg-bg-secondary
            border border-border
            text-text-secondary
            hover:text-text-primary
            hover:border-border-hover
            transition-all
          "
        >
          <i className="fa-solid fa-bars" />
        </button>

        {/* Centered Page Info */}
        <div className="text-center min-w-0 max-w-[80%] sm:max-w-[70%]">
          <h2 className="text-lg md:text-xl font-bold text-text-primary truncate">
            {currentPage.title}
          </h2>

          <p className="hidden sm:block text-xs md:text-sm text-text-muted truncate mt-0.5">
            {currentPage.subtitle}
          </p>
        </div>
      </div>
    </header>
  );
}
