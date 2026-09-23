import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ShieldCheck, GraduationCap, BriefcaseBusiness, AlertCircle } from 'lucide-react';

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loadingRole, setLoadingRole] = useState('');

  // Pre-filled working credentials for direct 1-click evaluation
  const [admin, setAdmin] = useState({ email: 'admin@university.edu', password: 'admin123' });
  const [student, setStudent] = useState({ email: 'priya.mehta@university.edu', password: 'password123' });
  const [company, setCompany] = useState({ email: 'campus@corpay.example', password: 'password123' });

  const handleLogin = async (e, email, password, role) => {
    e.preventDefault();
    setError('');
    setLoadingRole(role);
    try {
      const user = await login(email, password);
      navigate(user.role === 'ADMIN' ? '/admin/dashboard' : user.role === 'STUDENT' ? '/student/dashboard' : '/company/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoadingRole('');
    }
  };

  return (
    <div className="portal-container" style={{ maxWidth: '1040px', marginTop: '16px' }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', margin: '0 0 6px' }}>Direct Role Login</h1>
        <p style={{ color: 'var(--ink-500)', fontSize: '14px', margin: 0 }}>
          Click any role below to test immediately with pre-filled credentials.
        </p>
      </div>

      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '12px 16px', borderRadius: '10px', fontSize: '14px', marginBottom: '20px' }}>
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* TOP: ADMIN LOGIN */}
      <div className="surface-card" style={{ border: '2px solid var(--navy-500)', borderRadius: '18px', padding: '20px 24px', marginBottom: '24px', background: 'color-mix(in oklab, var(--navy-100) 25%, white)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldCheck size={24} color="var(--navy-600)" />
            <h2 style={{ fontSize: '22px', fontWeight: '800', margin: 0 }}>Admin Login</h2>
          </div>
          <span style={{ fontSize: '12px', fontWeight: '700', padding: '3px 10px', borderRadius: '999px', background: 'var(--navy-600)', color: 'white' }}>
            Placement Cell Admin
          </span>
        </div>

        <form onSubmit={(e) => handleLogin(e, admin.email, admin.password, 'ADMIN')} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr)) auto', gap: '14px', alignItems: 'end' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label style={{ fontSize: '13px', fontWeight: '700', marginBottom: '4px', display: 'block' }}>Email</label>
            <input type="email" className="form-control" value={admin.email} onChange={(e) => setAdmin({ ...admin, email: e.target.value })} required />
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label style={{ fontSize: '13px', fontWeight: '700', marginBottom: '4px', display: 'block' }}>Password</label>
            <input type="password" className="form-control" value={admin.password} onChange={(e) => setAdmin({ ...admin, password: e.target.value })} required />
          </div>
          <button type="submit" className="btn btn-primary" style={{ height: '42px', padding: '0 20px', whiteSpace: 'nowrap' }} disabled={loadingRole === 'ADMIN'}>
            {loadingRole === 'ADMIN' ? 'Signing in...' : 'Admin Login'}
          </button>
        </form>
      </div>

      {/* 2-COLUMN: STUDENT (LEFT) & COMPANY (RIGHT) */}
      <div className="responsive-grid-2">
        {/* STUDENT */}
        <div className="surface-card" style={{ borderRadius: '18px', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <GraduationCap size={22} color="var(--moss-500)" />
                <h2 style={{ fontSize: '19px', fontWeight: '800', margin: 0 }}>Student Login</h2>
              </div>
              <span className="badge badge-selected" style={{ fontSize: '12px' }}>Priya Mehta (CSE)</span>
            </div>

            <form onSubmit={(e) => handleLogin(e, student.email, student.password, 'STUDENT')}>
              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '13px', fontWeight: '700', marginBottom: '4px', display: 'block' }}>Student Email</label>
                <input type="email" className="form-control" value={student.email} onChange={(e) => setStudent({ ...student, email: e.target.value })} required />
              </div>
              <div className="form-group" style={{ marginBottom: '18px' }}>
                <label style={{ fontSize: '13px', fontWeight: '700', marginBottom: '4px', display: 'block' }}>Password</label>
                <input type="password" className="form-control" value={student.password} onChange={(e) => setStudent({ ...student, password: e.target.value })} required />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '44px' }} disabled={loadingRole === 'STUDENT'}>
                {loadingRole === 'STUDENT' ? 'Logging in...' : 'Student Login'}
              </button>
            </form>
          </div>
          <p style={{ margin: '16px 0 0', textAlign: 'center', fontSize: '13px', color: 'var(--ink-500)' }}>
            New student? <Link to="/register" style={{ color: 'var(--navy-600)', fontWeight: '700', textDecoration: 'none' }}>Register here</Link>
          </p>
        </div>

        {/* COMPANY */}
        <div className="surface-card" style={{ borderRadius: '18px', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <BriefcaseBusiness size={22} color="oklch(0.65 0.16 75)" />
                <h2 style={{ fontSize: '19px', fontWeight: '800', margin: 0 }}>Company Login</h2>
              </div>
              <span className="badge badge-interview" style={{ fontSize: '12px' }}>Corpay (3 Roles)</span>
            </div>

            <form onSubmit={(e) => handleLogin(e, company.email, company.password, 'COMPANY')}>
              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '13px', fontWeight: '700', marginBottom: '4px', display: 'block' }}>Recruiter Email</label>
                <input type="email" className="form-control" value={company.email} onChange={(e) => setCompany({ ...company, email: e.target.value })} required />
              </div>
              <div className="form-group" style={{ marginBottom: '18px' }}>
                <label style={{ fontSize: '13px', fontWeight: '700', marginBottom: '4px', display: 'block' }}>Password</label>
                <input type="password" className="form-control" value={company.password} onChange={(e) => setCompany({ ...company, password: e.target.value })} required />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '44px' }} disabled={loadingRole === 'COMPANY'}>
                {loadingRole === 'COMPANY' ? 'Logging in...' : 'Company Login'}
              </button>
            </form>
          </div>
          <p style={{ margin: '16px 0 0', textAlign: 'center', fontSize: '13px', color: 'var(--ink-500)' }}>
            New recruiter? <Link to="/register" style={{ color: 'var(--navy-600)', fontWeight: '700', textDecoration: 'none' }}>Register company</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
