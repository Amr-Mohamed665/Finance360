# Personal Finance 360

This is a modern, responsive personal finance management web application built with React. Personal Finance 360 helps users track income and expenses, manage monthly budgets, set savings goals, and understand their spending through interactive analytics and financial insights.

This project was developed as a graduation project for a **React Front-End Development Training Program**.

---

## Project Overview

Personal Finance 360 provides users with a centralized dashboard for managing their personal finances.

The application allows users to:

* Track income and expenses
* Manage financial transactions
* Create and manage expense categories
* Set monthly budgets
* Track savings goals
* Search, filter, and sort transactions
* Analyze financial activity using interactive charts
* Compare financial performance between different months
* Receive automated spending insights
* Manage their finances through a responsive desktop, tablet, and mobile interface

The project focuses on demonstrating practical React front-end development skills through a complete, data-driven web application.

---

## Features

### Authentication

* User registration
* User login
* Logout
* Authentication state management
* Protected routes
* User-specific financial data

### Financial Dashboard

The dashboard provides an overview of the user's financial activity, including:

* Total balance
* Monthly income
* Monthly expenses
* Savings information
* Recent transactions
* Budget overview
* Savings goal progress
* Financial charts
* Spending insights

### Transaction Management

Users can manage both income and expense transactions.

Features include:

* Add transactions
* Edit transactions
* Delete transactions
* View transaction history
* Search transactions
* Filter transactions
* Sort transactions
* Filter by transaction type
* Filter by category
* Filter by month
* Sort by amount
* Sort by date

### Expense Categories

Users can organize expenses using categories such as:

* Food
* Housing
* Transportation
* Bills
* Shopping
* Education
* Entertainment
* Health & Fitness

Category management includes:

* Create category
* View categories
* Edit category
* Delete category

### Monthly Budgets

Users can create budgets for individual expense categories.

Features include:

* Select expense category
* Set monthly spending limit
* Select budget month
* View budget progress
* Track amount spent
* Track remaining budget
* Calculate budget usage percentage
* Edit budgets
* Delete budgets

### Savings Goals

Users can create and manage savings goals.

Features include:

* Create savings goal
* Set target amount
* Track current savings
* Set target date
* Update savings progress
* View completion percentage
* Edit savings goals
* Delete savings goals

### Analytics

The Analytics section provides visual representations of financial data.

Charts include:

* Income vs. Expenses
* Spending by Category
* Monthly Spending Trends
* Savings analysis
* Budget usage

### Spending Insights

The application generates useful insights from financial data, including:

* Highest spending category
* Month-over-month spending changes
* Budget usage percentage
* Savings progress
* Comparison between financial periods

These insights use derived financial data to transform transactions into meaningful information for the user.

---

## Frontend Technology Stack

### Core Technologies

* **React**
* **JavaScript / JSX**
* **Vite**

### State Management

* **Redux Toolkit**
* **React Redux**

Redux Toolkit is used to manage shared application state such as:

* Authentication
* Transactions
* Categories
* Budgets
* Savings Goals

### Routing

* **React Router DOM**

Used for:

* Page navigation
* Protected routes
* Authentication-based routing

### API Integration

* **Axios**

Axios is used to communicate with the application's REST API.

### Forms & Validation

* **Formik**
* **Yup**

Used for creating and validating forms throughout the application.

### Data Visualization

* **Recharts**

Used to create interactive financial charts and visualizations.

### Styling

* **Tailwind CSS**
* Responsive CSS utilities
* Custom UI design system

---

## Frontend Architecture

The project follows a modular React component architecture.

```text
src/
├── components/
│   ├── common/
│   ├── layout/
│   ├── dashboard/
│   ├── transactions/
│   ├── budgets/
│   ├── savings/
│   └── charts/
│
├── pages/
│
├── routes/
│
├── services/
│
├── store/
│   └── slices/
│
├── utils/
│
├── App.jsx
└── main.jsx
```

### Reusable Components

The application uses reusable UI components to maintain consistency and reduce duplicated code.

Examples include:

* Buttons
* Cards
* Inputs
* Select fields
* Modals
* Tables
* Loading states
* Error states
* Empty states
* Progress indicators

Feature-specific components are also separated into dedicated folders for easier maintenance and scalability.

---

## Application Flow

```text
Registration / Login
        ↓
     Dashboard
        ↓
   Transactions
        ↓
      Budgets
        ↓
   Savings Goals
        ↓
     Analytics
        ↓
 Spending Insights
```

Users can navigate between protected sections of the application after authentication.

---

## State Management

Redux Toolkit is used for centralized application state management.

The application separates state into feature-based slices, including:

```text
authSlice
transactionsSlice
categoriesSlice
budgetsSlice
savingsGoalsSlice
```

This approach makes the application state easier to manage, maintain, and scale.

---

## CRUD Operations

The application demonstrates complete CRUD workflows where applicable.

### Transactions

```text
Create → Read → Update → Delete
```

### Categories

```text
Create → Read → Update → Delete
```

### Budgets

```text
Create → Read → Update → Delete
```

### Savings Goals

```text
Create → Read → Update → Delete
```

---

## Search, Filtering & Sorting

The transaction management interface provides multiple ways to work with financial data.

### Search

Users can search transactions using relevant transaction information.

### Filtering

Transactions can be filtered by:

* Income / Expense
* Category
* Month

### Sorting

Transactions can be sorted by:

* Date
* Amount

Sorting can be performed in:

* Ascending order
* Descending order

---

## Form Validation

Forms throughout the application include validation to ensure that users provide valid information before submitting data.

Validation is applied to features such as:

* Login
* Registration
* Transactions
* Categories
* Budgets
* Savings Goals

The interface provides feedback when required fields are missing or invalid.

---

## Application States

The frontend handles different application states to provide a better user experience.

### Loading States

Displayed while data is being retrieved or processed.

### Error States

Displayed when an operation fails and provide users with appropriate feedback and recovery options.

### Empty States

Displayed when there is no available data, with guidance for the next action.

### Validation States

Used to provide immediate feedback when users enter invalid form data.

---

## Responsive Design

Personal Finance 360 is designed to work across:

* Desktop
* Tablet
* Mobile

The interface adapts its:

* Navigation
* Cards
* Forms
* Tables
* Charts
* Layouts
* Controls

to provide a consistent user experience across different screen sizes.

---

## API Integration

The React frontend communicates with a REST API using Axios.

The frontend is responsible for:

* Sending API requests
* Receiving financial data
* Managing application state
* Displaying API results
* Handling loading and error states
* Updating the interface after CRUD operations

The backend/API serves as the data layer for the React application.

---

## Getting Started

### Prerequisites

Make sure you have the following installed:

* Node.js
* npm

You can verify your installation with:

```bash
node --version
npm --version
```

---

## Installation

Clone the repository and navigate to the frontend project:

```bash
git clone <YOUR-GITHUB-REPOSITORY-URL>
cd Finance360
```

Install the dependencies:

```bash
npm install
```

---

## Environment Variables

Create a `.env` file in the frontend project if your API configuration requires environment variables.

Example:

```env
VITE_API_URL=<YOUR_API_URL>
```

Do not commit private credentials, tokens, or secrets to GitHub.

---

## Running the Development Server

Start the React development server:

```bash
npm run dev
```

Vite will provide a local development URL, normally:

```text
http://localhost:5173
```

---

## Production Build

Create a production build with:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

---

## Project Requirements Demonstrated

This project demonstrates the main requirements of the React Front-End Development Training Program:

| Requirement            | Implementation                                   |
| ---------------------- | ------------------------------------------------ |
| React                  | React application using functional components    |
| React Hooks            | Used throughout the application                  |
| Component Architecture | Modular and reusable components                  |
| React Router           | Application navigation and protected routes      |
| State Management       | Redux Toolkit                                    |
| API Integration        | Axios REST API integration                       |
| Forms                  | Formik-based forms                               |
| Validation             | Yup validation                                   |
| CRUD                   | Transactions, Categories, Budgets, Savings Goals |
| Search                 | Transaction search                               |
| Filtering              | Transaction filters                              |
| Sorting                | Date and amount sorting                          |
| Data Visualization     | Recharts                                         |
| Derived State          | Financial calculations and insights              |
| Authentication         | Login, registration and protected routes         |
| Responsive Design      | Desktop, tablet and mobile layouts               |
| Loading States         | Loading feedback                                 |
| Error States           | Error handling and recovery                      |
| Empty States           | User guidance when no data exists                |
| Professional UI/UX     | Consistent responsive interface                  |

---

## Key Learning Outcomes

Through this project, the following front-end development skills were demonstrated:

* Building a complete React application
* Creating reusable React components
* Managing global state with Redux Toolkit
* Implementing client-side routing
* Creating protected routes
* Integrating REST APIs
* Building and validating forms
* Implementing CRUD operations
* Managing complex financial data
* Implementing search, filtering, and sorting
* Creating interactive charts
* Calculating derived financial information
* Designing responsive interfaces
* Handling loading, error, and empty states
* Structuring a maintainable frontend project

---

## Future Improvements

Possible future enhancements include:

* Financial data export
* More advanced financial reports
* Notifications and reminders
* Additional analytics
* More detailed spending predictions
* Multi-currency support
* Enhanced accessibility
* Personalized financial recommendations

---

## Graduation Project

**Project:** Personal Finance 360
**Program:** React Front-End Development Training Program
**Project Type:** Graduation Project

### Main Focus

The primary focus of this project is demonstrating practical **React front-end development**, including component architecture, state management, routing, API integration, forms, CRUD operations, responsive design, data visualization, and user experience.

---

## License

This project was developed for educational and training purposes as part of the React Front-End Development Training Program.
