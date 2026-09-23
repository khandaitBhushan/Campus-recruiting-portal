import React, { useContext } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import RouteGuard from './components/RouteGuard';
import Navbar from './components/Navbar';

// Authentication Pages
import Login from './pages/Login';
import Register from './pages/Register';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCompanies from './pages/admin/AdminCompanies';
import AdminPendingJobs from './pages/admin/AdminPendingJobs';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminStudents from './pages/admin/AdminStudents';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import StudentJobs from './pages/student/StudentJobs';
import StudentJobDetails from './pages/student/StudentJobDetails';
import StudentApplications from './pages/student/StudentApplications';
import StudentProfile from './pages/student/StudentProfile';

// Company Pages
import CompanyDashboard from './pages/company/CompanyDashboard';
import CompanyPostJob from './pages/company/CompanyPostJob';
import CompanyJobs from './pages/company/CompanyJobs';
import CompanyApplicants from './pages/company/CompanyApplicants';

const AppContent = () => {
  const { user } = useContext(AuthContext);

  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" replace />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/" replace />} />

        {/* Root Redirect based on user role */}
        <Route 
          path="/" 
          element={
            user ? (
              user.role === 'ADMIN' ? <Navigate to="/admin/dashboard" replace /> :
              user.role === 'STUDENT' ? <Navigate to="/student/dashboard" replace /> :
              user.role === 'COMPANY' ? <Navigate to="/company/dashboard" replace /> :
              <Navigate to="/login" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />

        {/* Protected Student Routes */}
        <Route path="/student/dashboard" element={<RouteGuard allowedRoles={['STUDENT']}><StudentDashboard /></RouteGuard>} />
        <Route path="/student/jobs" element={<RouteGuard allowedRoles={['STUDENT']}><StudentJobs /></RouteGuard>} />
        <Route path="/student/jobs/:id" element={<RouteGuard allowedRoles={['STUDENT']}><StudentJobDetails /></RouteGuard>} />
        <Route path="/student/applications" element={<RouteGuard allowedRoles={['STUDENT']}><StudentApplications /></RouteGuard>} />
        <Route path="/student/profile" element={<RouteGuard allowedRoles={['STUDENT']}><StudentProfile /></RouteGuard>} />

        {/* Protected Company Routes */}
        <Route path="/company/dashboard" element={<RouteGuard allowedRoles={['COMPANY']}><CompanyDashboard /></RouteGuard>} />
        <Route path="/company/post-job" element={<RouteGuard allowedRoles={['COMPANY']}><CompanyPostJob /></RouteGuard>} />
        <Route path="/company/jobs" element={<RouteGuard allowedRoles={['COMPANY']}><CompanyJobs /></RouteGuard>} />
        <Route path="/company/jobs/:id/applicants" element={<RouteGuard allowedRoles={['COMPANY']}><CompanyApplicants /></RouteGuard>} />

        {/* Protected Admin Routes */}
        <Route path="/admin/dashboard" element={<RouteGuard allowedRoles={['ADMIN']}><AdminDashboard /></RouteGuard>} />
        <Route path="/admin/companies" element={<RouteGuard allowedRoles={['ADMIN']}><AdminCompanies /></RouteGuard>} />
        <Route path="/admin/jobs/pending" element={<RouteGuard allowedRoles={['ADMIN']}><AdminPendingJobs /></RouteGuard>} />
        <Route path="/admin/analytics" element={<RouteGuard allowedRoles={['ADMIN']}><AdminAnalytics /></RouteGuard>} />
        <Route path="/admin/students" element={<RouteGuard allowedRoles={['ADMIN']}><AdminStudents /></RouteGuard>} />

        {/* Catch-all Redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
