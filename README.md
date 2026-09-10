# Personal Finance 360

Personal Finance 360 is a comprehensive wealth management and tracking React web application. It enables users to monitor their income, categorize expenses, plan monthly budgets, set milestones for savings goals, and visualizes financial data through interactive analytics and automated spending insights.

---

## Features

1. **User Authentication**: Simple login and registration with input validator rules, keeping data isolated between different accounts.
2. **Financial Overview Dashboard**: Summary cards for net balance, total income, total expenses, recent transactions, monthly budgets progress, savings goals trackers, and a micro charts visualizer.
3. **Transactions Management**: Full CRUD operations for income and expenses. Search transactions by description or category, filter by month/category/type, and sort dynamically by amount or date.
4. **Expense Categories**: Standardized categories mapped to custom icons and colors for styling dashboards.
5. **Budgets Tracking**: Monthly limit constraints mapped per expense category, showing visual progression indicators that alert users when limits are near or exceeded.
6. **Savings Goals**: Milestone tracking with target dates, visual completion percentage bars, and increment progress updates.
7. **Interactive Analytics Pages**: Real-time charts showing financial trends:
   - **Income vs Expenses** (Bar Chart)
   - **Spending by Category** (Pie/Donut Chart)
   - **Monthly Spending Trend** (Area Chart)
8. **Period Comparison**: Side-by-side comparative table analyzing income, expenses, and savings metrics between two selected months.
9. **Derived Spending Insights**:
   - Automated highest spending category indicator.
   - Month-over-month expenses variation percentage tracker.
   - Overall budget allocation limit warnings.
   - Total savings objectives milestone percentage.

---

## Tech Stack

- **Frontend**: React (Vite, JavaScript/JSX)
- **State Management**: Redux Toolkit
- **Routing**: React Router (v6)
- **HTTP client**: Axios
- **Charts**: Recharts
- **Simulated DB/API**: JSON Server
- **Styling**: Pure CSS with Custom Design System Variables

---

## Project Structure

```text
finance-360/
├── public/
├── src/
│   ├── app/
│   ├── assets/
│   ├── components/
│   │   ├── common/         # Button, Card, EmptyState, Input, Select, Modal, etc.
│   │   ├── layout/         # Sidebar, AppLayout
│   │   ├── dashboard/      # BudgetOverview, RecentTransactions, SummaryCards, etc.
│   │   ├── transactions/   # TransactionFilters, TransactionForm, TransactionTable, etc.
│   │   ├── budgets/        # BudgetCard, BudgetForm
│   │   ├── savings/        # SavingsGoalCard, SavingsGoalForm
│   │   └── charts/         # IncomeExpenseChart, SpendingCategoryChart, MonthlySpendingChart
│   ├── pages/              # AuthPages, DashboardPage, TransactionsPage, BudgetsPage, etc.
│   ├── routes/             # ProtectedRoute wrapper
│   ├── services/           # api.js Axios endpoints
│   ├── store/              # store.js configuring Redux slices
│   │   └── slices/         # authSlice, transactionsSlice, budgetsSlice, categoriesSlice, etc.
│   ├── utils/              # helpers.js (date manipulation, currency converters)
│   ├── App.jsx             # Main Router structure
│   └── main.jsx            # React root mounting
├── db.json                 # Mock DB (pre-seeded)
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## Installation & Setup

### Prerequisites
Make sure you have Node.js installed on your machine.

1. Navigate to the project root directory:
   ```bash
   cd "Finance App"
   ```

2. Install all dependencies:
   ```bash
   npm install
   ```

---

## Running the Application

This project runs both a Vite React development server and a JSON Server for API simulation.

### Option A: Run concurrently (Recommended)
This will launch both React and the backend database server with a single command:
```bash
npm start
```

### Option B: Run in separate terminals

1. **Start the API Server**:
   ```bash
   npm run server
   ```
   *Runs on port 3001:* `http://localhost:3001`

2. **Start the React Frontend**:
   ```bash
   npm run dev
   ```
   *Runs on port 5173:* `http://localhost:5173`

---

## Simulated API Details

The frontend communicates with a simulated JSON Server database stored in `db.json`.

### Endpoints

| Method | Endpoint | Description |
|---|---|---|
| **POST** | `/users` | Registers a new account |
| **GET** | `/users?email=val` | Resolves accounts for authentication verification |
| **GET** | `/transactions?userId=val` | Fetches transactions for a specific user |
| **POST** | `/transactions` | Creates a transaction |
| **PATCH** | `/transactions/:id` | Modifies transaction |
| **DELETE** | `/transactions/:id` | Deletes transaction |
| **GET** | `/budgets?userId=val` | Fetches monthly category budgets |
| **POST** | `/budgets` | Configures category budget limit |
| **PATCH** | `/budgets/:id` | Updates budget limit amount |
| **DELETE** | `/budgets/:id` | Deletes category budget limit |
| **GET** | `/savingsGoals?userId=val` | Fetches savings goals |
| **POST** | `/savingsGoals` | Creates savings goal target |
| **PATCH** | `/savingsGoals/:id` | Modifies current/target savings |
| **DELETE** | `/savingsGoals/:id` | Deletes savings goal |
| **GET** | `/categories` | Fetches base system icons and colors metadata |

*All transaction, budget, and savings records include a `userId` field to isolate user data. Registered accounts will only be able to view and manage their own financial assets.*

---

## Authentication Flow

1. **Registration**: User fills Name, Email, Password. Form validates email syntax and matching passwords. Calls simulated API to check if the email already exists; if unique, writes a new user object.
2. **Login**: Checks credentials against the simulated `/users` collection.
3. **Session State**: On successful login, user payload is saved in Redux and persisted in `localStorage`.
4. **Route Protection**: If the user is unauthenticated, they are redirected to `/login` if attempting to browse private dashboards. If authenticated, pages render via `AppLayout`.

---

## Production Build & Deployment

To build a production compile of the React frontend, run:
```bash
npm run build
```

### Deploying the App
For real deployments (e.g. Vercel, Netlify):
1. Deploy the compiled React build folder `dist/` to your frontend host.
2. Since JSON Server runs locally, you can deploy the `db.json` database server to a free hosted REST mock service like **Render** or **JSONBin.io**, then update the `baseURL` inside `src/services/api.js` to point to the live server URL.
