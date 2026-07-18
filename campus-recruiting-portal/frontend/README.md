# Campus Recruiting Portal - Frontend Web Client

This folder contains the React web application client for the Campus Recruiting Portal. Built on **React 19** and bundled with **Vite**, the interface utilizes a custom vanilla CSS design system featuring dark mode capability and a responsive, glassmorphic layout.

---

## 🛠 Technology Stack

- **Core Library**: React 19
- **Bundler & Dev Server**: Vite 8
- **Routing**: React Router DOM 7
- **HTTP Client**: Axios 1.18 (configured with request/response interceptors)
- **Styling Engine**: Vanilla CSS Design Tokens (defined in `index.css`)
- **Icons**: Lucide React
- **Linter**: Oxlint

---

## 📂 Project Architecture

```
src/
├── main.jsx          # Application entry point
├── App.jsx           # Main layout router and route guard mapping
├── App.css           # Global core layout styles
├── index.css         # Custom CSS Design System, tokens, glassmorphism, and dark-theme
├── assets/           # Static asset assets (logos, images)
├── components/       # Shared UI components (Navbar, RouteGuard)
├── context/          # React context providers (AuthContext)
├── pages/            # View pages grouped by workspace role (student, company, admin)
└── services/         # API integration layer (Axios client config)
```

---

## ⚙️ Local Development Setup

Ensure you have **Node.js** (v18+) installed.

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure API Endpoint
The client connects to the Spring Boot backend via Axios. By default, this is pointed to `http://localhost:8080` in [services/api.js](file:///e:/campus-recruiting-portal/campus-recruiting-portal/frontend/src/services/api.js).

### 3. Run the Dev Server
Launch Vite's local dev server (typically runs on `http://localhost:5173`):
```bash
npm run dev
```

### 4. Production Build & Preview
To compile optimized static assets and preview the build:
```bash
# Build
npm run build

# Preview local build
npm run preview
```

---

## 🔐 Client-Side Core Workings

### 1. Authentication State Management
The user session is managed globally by [AuthContext.jsx](file:///e:/campus-recruiting-portal/campus-recruiting-portal/frontend/src/context/AuthContext.jsx).
- **Login**: On successful authentication, the backend JWT and user profile object are written to `localStorage`.
- **Session Sync**: The application listens to `auth-change` events. If a user logs out or their token is revoked, context state is updated and the user is redirected to the login screen.

### 2. Axios Request & Response Interceptors
Communication with the backend API is routed through [services/api.js](file:///e:/campus-recruiting-portal/campus-recruiting-portal/frontend/src/services/api.js):
- **Request Interceptor**: Automatically reads the token from `localStorage` and appends it as a `Bearer` token to the `Authorization` header of all outgoing network requests.
- **Response Interceptor**: Monitors API responses. If an API request returns a `401 Unauthorized` status (indicating an expired or invalid token), the interceptor automatically purges local credentials and triggers the `auth-change` event.

### 3. Protected Route Guards
To prevent unauthorized users from manually entering URLs to restricted pages:
- React Router paths are wrapped inside the custom `RouteGuard` component.
- The guard inspects the current user's role and grants access only if the role matches the configured parameters (e.g., `STUDENT`, `COMPANY`, or `ADMIN`). If unauthorized, they are redirected to the root `/` page which routes them to their correct home page.

### 4. Custom CSS Design System
We avoid utility CSS engines in favor of custom design tokens defined in [index.css](file:///e:/campus-recruiting-portal/campus-recruiting-portal/frontend/src/index.css):
- **CSS Variables**: Manage core themes like `--primary`, `--bg`, `--card-bg`, and `--border`.
- **Dark Mode**: Applying the class `.dark-theme` to the `body` element swaps token values dynamically.
- **Glassmorphism**: Components apply `.glass-panel` to inherit translucent backdrops and subtle border details.

---

## 🗺 Application Navigation Map

Below is a catalog of the client-side router configurations:

| Route Path | Allowed Roles | Component Page | Purpose |
| :--- | :--- | :--- | :--- |
| `/login` | Public | [Login.jsx](file:///e:/campus-recruiting-portal/campus-recruiting-portal/frontend/src/pages/Login.jsx) | Credentials form login |
| `/register` | Public | [Register.jsx](file:///e:/campus-recruiting-portal/campus-recruiting-portal/frontend/src/pages/Register.jsx) | Registration for students or companies |
| `/` | Authenticated | Redirect Component | Routes users to their respective dashboards based on role |
| **Student Workspace** | | | |
| `/student/dashboard` | `STUDENT` | [StudentDashboard.jsx](file:///e:/campus-recruiting-portal/campus-recruiting-portal/frontend/src/pages/student/StudentDashboard.jsx) | Active eligibility overview |
| `/student/jobs` | `STUDENT` | [StudentJobs.jsx](file:///e:/campus-recruiting-portal/campus-recruiting-portal/frontend/src/pages/student/StudentJobs.jsx) | Filterable approved job listings |
| `/student/jobs/:id` | `STUDENT` | [StudentJobDetails.jsx](file:///e:/campus-recruiting-portal/campus-recruiting-portal/frontend/src/pages/student/StudentJobDetails.jsx) | Detailed description and application submission |
| `/student/applications`| `STUDENT` | [StudentApplications.jsx](file:///e:/campus-recruiting-portal/campus-recruiting-portal/frontend/src/pages/student/StudentApplications.jsx)| Real-time application tracker |
| `/student/profile` | `STUDENT` | [StudentProfile.jsx](file:///e:/campus-recruiting-portal/campus-recruiting-portal/frontend/src/pages/student/StudentProfile.jsx) | Academic profile editor & resume upload |
| **Company Workspace** | | | |
| `/company/dashboard` | `COMPANY` | [CompanyDashboard.jsx](file:///e:/campus-recruiting-portal/campus-recruiting-portal/frontend/src/pages/company/CompanyDashboard.jsx) | Status status metrics & recent applications |
| `/company/post-job` | `COMPANY` | [CompanyPostJob.jsx](file:///e:/campus-recruiting-portal/campus-recruiting-portal/frontend/src/pages/company/CompanyPostJob.jsx) | Job vacancy creator |
| `/company/jobs` | `COMPANY` | [CompanyJobs.jsx](file:///e:/campus-recruiting-portal/campus-recruiting-portal/frontend/src/pages/company/CompanyJobs.jsx) | History list of created jobs |
| `/company/jobs/:id/applicants`| `COMPANY` | [CompanyApplicants.jsx](file:///e:/campus-recruiting-portal/campus-recruiting-portal/frontend/src/pages/company/CompanyApplicants.jsx)| Board for updating candidate statuses |
| **Admin Workspace** | | | |
| `/admin/dashboard` | `ADMIN` | [AdminDashboard.jsx](file:///e:/campus-recruiting-portal/campus-recruiting-portal/frontend/src/pages/admin/AdminDashboard.jsx) | Admin tasks and links |
| `/admin/companies` | `ADMIN` | [AdminCompanies.jsx](file:///e:/campus-recruiting-portal/campus-recruiting-portal/frontend/src/pages/admin/AdminCompanies.jsx) | List of registered companies for approvals |
| `/admin/jobs/pending` | `ADMIN` | [AdminPendingJobs.jsx](file:///e:/campus-recruiting-portal/campus-recruiting-portal/frontend/src/pages/admin/AdminPendingJobs.jsx) | Review queue for new job posts |
| `/admin/analytics` | `ADMIN` | [AdminAnalytics.jsx](file:///e:/campus-recruiting-portal/campus-recruiting-portal/frontend/src/pages/admin/AdminAnalytics.jsx) | Charts and CSV/PDF export tools |
| `/admin/students` | `ADMIN` | [AdminStudents.jsx](file:///e:/campus-recruiting-portal/campus-recruiting-portal/frontend/src/pages/admin/AdminStudents.jsx) | Academic list, placement switches, and CSV imports |
