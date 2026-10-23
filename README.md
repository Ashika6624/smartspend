# SmartSpend – Personal Expense Tracker

A full-stack, enterprise-grade personal expense management web application developed for **MCA (Master of Computer Applications)**. Built using **Java Spring Boot 3** for the RESTful backend, **React 18** with **Vite** for the responsive frontend, and **MySQL 8** for persistent relational database storage.

---

## 1. Project Overview & Motivation

SmartSpend empowers users to take full control of their personal finances through:
- **Income & Expense Tracking:** Add, edit, delete, categorize, and search financial transactions.
- **Monthly & Category Budget Planner:** Set overall monthly limits as well as category-specific caps (Food, Travel, Bills, etc.) with automated warnings (at 80%) and alert badges (when exceeded).
- **Interactive Dashboard:** Real-time summary cards for Total Income, Total Expenses, and Net Balance; visual expense distribution donut charts and 6-month comparative bar charts.
- **Reports & Analytics:** Spending category breakdowns, identification of top expense drivers, net savings rate calculation, and **1-click CSV report export**.
- **Security & Authorization:** Spring Security 6 with stateless **JWT (JSON Web Tokens)**, BCrypt password encryption, and isolated user-level data segregation.
- **Modern User Experience:** Clean UI typography, responsive layout, and seamless **Light / Dark theme toggle**.

---

## 2. Technology Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Backend Framework** | Java Spring Boot 3.2.5 | REST APIs, dependency injection, service layers |
| **Language & Runtime** | Java 17 LTS | Modern LTS Java standard |
| **Database** | MySQL Server 8.0 | Relational database management |
| **ORM / Data Access** | Spring Data JPA / Hibernate | Object-Relational Mapping & automated schema sync |
| **Security & Auth** | Spring Security 6 + JWT | Stateless JWT authentication, BCrypt password hashing |
| **Frontend Framework** | React.js 18 + Vite | Component-based dynamic single-page application |
| **Icons & Visuals** | Lucide-React | Crisp vector iconography |
| **Data Visualization** | Recharts | Interactive Donut/Pie & Bar charts |
| **HTTP Client** | Axios | Interceptors for Bearer token & error handling |
| **Build Tools** | Maven Wrapper (`mvnw`), npm | Dependency and build lifecycle management |

---

## 3. Architecture & Project Structure

```text
smartspend/
│
├── frontend/                          # React Frontend Application
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx             # Top bar, User profile pill, Theme toggle, Logout
│   │   │   ├── Sidebar.jsx            # Persistent navigation menu with active route tracking
│   │   │   ├── SummaryCard.jsx        # Reusable metric card with currency formatting
│   │   │   └── TransactionForm.jsx    # Modal dialog for creating/editing transactions
│   │   │
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx          # KPI metrics, Budget warning banners, Recharts graphs
│   │   │   ├── Income.jsx             # Income CRUD, category filters, date filters, search
│   │   │   ├── Expenses.jsx           # Expense CRUD, category breakdown, search, filters
│   │   │   ├── Budget.jsx             # Overall & category budget setup with progress bars
│   │   │   ├── Reports.jsx            # Analytics, top spending driver, CSV data download
│   │   │   ├── Login.jsx              # Secure login with Demo Credentials button
│   │   │   └── Register.jsx           # User registration with password validation
│   │   │
│   │   ├── services/
│   │   │   └── api.js                 # Axios instance with JWT Authorization interceptors
│   │   │
│   │   ├── App.jsx                    # Route definitions, Protected Route wrapper, theme state
│   │   ├── index.css                  # Custom styling & dark mode CSS variables
│   │   └── main.jsx                   # React root entrypoint with BrowserRouter
│   │
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── backend/                           # Spring Boot Backend Application
│   ├── src/main/java/com/smartspend/
│   │   ├── SmartSpendApplication.java # Spring Boot main runner
│   │   │
│   │   ├── config/
│   │   │   ├── SecurityConfig.java    # Spring Security 6, CORS, JWT filter chain
│   │   │   └── DataInitializer.java   # Auto-seeds demo user, budgets, & transactions
│   │   │
│   │   ├── controller/
│   │   │   ├── AuthController.java        # /api/auth (register, login, me)
│   │   │   ├── TransactionController.java # /api/transactions (CRUD + CSV export)
│   │   │   ├── BudgetController.java      # /api/budgets (CRUD + status calculation)
│   │   │   └── DashboardController.java   # /api/dashboard (aggregated summaries)
│   │   │
│   │   ├── dto/                       # Request and Response Data Transfer Objects
│   │   │   ├── AuthRequest.java
│   │   │   ├── RegisterRequest.java
│   │   │   ├── AuthResponse.java
│   │   │   ├── TransactionRequest.java
│   │   │   ├── BudgetRequest.java
│   │   │   ├── BudgetStatusDTO.java
│   │   │   └── DashboardSummary.java
│   │   │
│   │   ├── entity/                    # JPA Entities mapped to MySQL tables
│   │   │   ├── User.java              # users table
│   │   │   ├── Transaction.java       # transactions table
│   │   │   ├── TransactionType.java   # INCOME, EXPENSE enum
│   │   │   └── Budget.java            # budgets table
│   │   │
│   │   ├── exception/                 # Global exception handlers & custom errors
│   │   │   ├── ResourceNotFoundException.java
│   │   │   ├── BadRequestException.java
│   │   │   └── GlobalExceptionHandler.java
│   │   │
│   │   ├── repository/                # Spring Data JPA Repository interfaces
│   │   │   ├── UserRepository.java
│   │   │   ├── TransactionRepository.java
│   │   │   └── BudgetRepository.java
│   │   │
│   │   ├── security/                  # JWT security provider & auth filter
│   │   │   ├── CustomUserDetails.java
│   │   │   ├── CustomUserDetailsService.java
│   │   │   ├── JwtAuthenticationEntryPoint.java
│   │   │   ├── JwtAuthenticationFilter.java
│   │   │   └── JwtUtils.java
│   │   │
│   │   └── service/                   # Business logic layer
│   │       ├── AuthService.java
│   │       ├── TransactionService.java
│   │       ├── BudgetService.java
│   │       └── DashboardService.java
│   │
│   ├── src/main/resources/
│   │   └── application.properties     # Database credentials, JPA settings, JWT secret
│   │
│   ├── mvnw & mvnw.cmd                # Maven Wrapper executables
│   └── pom.xml                        # Maven dependencies & build configuration
│
└── README.md
```

---

## 4. Database Schema (MySQL)

### Table: `users`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `user_id` | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Unique user identifier |
| `name` | VARCHAR(255) | NOT NULL | User's full name |
| `email` | VARCHAR(255) | NOT NULL, UNIQUE | User's login email address |
| `password` | VARCHAR(255) | NOT NULL | BCrypt encrypted hash |
| `created_at` | DATETIME | NOT NULL | Timestamp of account registration |

### Table: `transactions`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `transaction_id` | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Unique transaction identifier |
| `title` | VARCHAR(255) | NOT NULL | Brief description (e.g. "Monthly Salary") |
| `amount` | DECIMAL(12,2)| NOT NULL | Transaction value in INR (₹) |
| `type` | VARCHAR(20)  | NOT NULL | `INCOME` or `EXPENSE` |
| `category` | VARCHAR(100) | NOT NULL | Category (e.g., Salary, Food, Travel, Bills) |
| `transaction_date` | DATE | NOT NULL | Date of financial event |
| `notes` | TEXT | NULLABLE | Optional remarks or reference numbers |
| `user_id` | BIGINT | FOREIGN KEY (`users.user_id`) | Connects transaction to creator |

### Table: `budgets`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `budget_id` | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Unique budget entry identifier |
| `budget_amount` | DECIMAL(12,2)| NOT NULL | Maximum expenditure cap in INR (₹) |
| `category` | VARCHAR(100) | NOT NULL | `OVERALL` or category (e.g. `Food`) |
| `month` | INT | NOT NULL (1 - 12) | Target budget month |
| `year` | INT | NOT NULL (e.g., 2026) | Target budget year |
| `user_id` | BIGINT | FOREIGN KEY (`users.user_id`) | Connects budget limit to user |

---

## 5. REST API Endpoints

### Authentication APIs (`/api/auth`)
- `POST /api/auth/register` – Register new user with name, email, and password.
- `POST /api/auth/login` – Authenticate user and receive JWT bearer token.
- `GET /api/auth/me` – Retrieve profile information for the authenticated user.

### Transaction APIs (`/api/transactions`)
- `GET /api/transactions` – List transactions with optional filters (`type`, `category`, `startDate`, `endDate`, `search`).
- `GET /api/transactions/{id}` – Retrieve a single transaction by ID.
- `POST /api/transactions` – Record a new income or expense.
- `PUT /api/transactions/{id}` – Update an existing record.
- `DELETE /api/transactions/{id}` – Remove a transaction.
- `GET /api/transactions/export/csv` – Stream and download complete transaction history in `.csv` format.

### Budget APIs (`/api/budgets`)
- `GET /api/budgets?month=&year=` – Retrieve user's configured budgets for given period.
- `POST /api/budgets` – Upsert overall or category budget target.
- `DELETE /api/budgets/{id}` – Delete a budget cap.
- `GET /api/budgets/status?month=&year=` – Get computed spent vs remaining amount, usage percentage, and alert status (`NORMAL`, `WARNING`, `EXCEEDED`).

### Dashboard APIs (`/api/dashboard`)
- `GET /api/dashboard/summary` – Aggregates lifetime totals, current month totals, category percentages, 6-month comparisons, and recent records.

---

## 6. How to Run the Project Locally

### Prerequisites
- **Java 17 LTS** or newer
- **MySQL 8.0** running on `localhost:3306`
- **Node.js** (v18+) and **npm**

### Step 1: Start MySQL Database
Ensure MySQL is running and the database `smartspend` is created:
```sql
CREATE DATABASE IF NOT EXISTS smartspend;
```
*(Database configuration in `backend/src/main/resources/application.properties` is set for user `root` and password `ashika@123`)*.

### Step 2: Run the Spring Boot Backend
Open a terminal in `smartspend/backend`:
```powershell
.\mvnw spring-boot:run
```
The backend starts on `http://localhost:8080`.  
On first launch, **DataInitializer** automatically verifies the database and seeds sample demo data!

### Step 3: Run the React Frontend
Open another terminal in `smartspend/frontend`:
```powershell
npm run dev
```
The React application starts on `http://localhost:5173`.

### Step 4: Login with Pre-Configured Demo Credentials
Navigate to `http://localhost:5173/login`:
- **Email:** `demo@smartspend.com`
- **Password:** `password123`
*(Or click the **"Use Demo Credentials"** button on the login screen for instant access!)*

---

## 7. Key Features Demonstrated in MCA Examination / Viva
1. **Separation of Concerns:** Clean layered architecture: Entity &rarr; Repository &rarr; Service &rarr; Controller &rarr; DTO.
2. **Security & Authentication:** Stateless JSON Web Tokens (JWT), BCrypt password hashing, and user-isolated query filters so users never see each other's finances.
3. **Budget Overflow Logic:** Automatic computation of remaining funds and live alert badges triggered at 80% warning and 100% budget limit exceeded.
4. **Data Analytics & CSV Export:** Backend dynamic CSV writer for instant report downloads without external third-party report servers.
5. **Data Visualization:** Modern charting with Recharts Donut & Bar graphs.
