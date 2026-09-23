import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { KeyRound, Mail, AlertCircle } from 'lucide-react';

const DEMO_USERS = [
  { label: '👑 Admin (Placement Cell)', email: 'admin@university.edu', pass: 'admin123', role: 'ADMIN' },
  { label: '🏢 Company (Orbit Recruiter)', email: 'recruiting@orbit.example', pass: 'password123', role: 'COMPANY' },
  { label: '🎓 Student (Priya Mehta - CSE)', email: 'priya.mehta@university.edu', pass: 'password123', role: 'STUDENT' },
];

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@university.edu');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fillDemo = (demo) => {
    setEmail(demo.email);
    setPassword(demo.pass);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const user = await login(email, password);
      const routes = { ADMIN: '/admin/dashboard', STUDENT: '/student/dashboard', COMPANY: '/company/dashboard' };
      navigate(routes[user.role] || '/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '75vh', padding: '20px' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '440px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '700', textAlign: 'center', marginBottom: '4px' }}>Welcome Back</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '13px', textAlign: 'center', marginBottom: '18px' }}>
          Sign in or click a demo account below to explore
        </p>

        {/* Compact Quick Demo Autofill Box */}
        <div style={{
          backgroundColor: 'rgba(79, 70, 229, 0.06)',
          border: '1px solid rgba(79, 70, 229, 0.2)',
          borderRadius: '10px',
          padding: '12px',
          marginBottom: '18px',
        }}>
          <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--primary)', marginBottom: '8px' }}>
            ⚡ Project Demo Access (Click to autofill):
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {DEMO_USERS.map((u) => (
              <button
                key={u.role}
                type="button"
                onClick={() => fillDemo(u)}
                className="btn btn-outline"
                style={{
                  justifyContent: 'space-between',
                  padding: '7px 10px',
                  fontSize: '12px',
                  backgroundColor: email === u.email ? 'rgba(79, 70, 229, 0.15)' : 'transparent',
                  borderColor: email === u.email ? 'var(--primary)' : 'var(--border)',
                }}
              >
                <span><strong>{u.label}</strong></span>
                <span style={{ color: 'var(--text-muted)', fontFamily: 'monospace' }}>{u.pass}</span>
              </button>
            ))}
          </div>
          <p style={{ margin: '8px 0 0', fontSize: '11px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
            * Evaluators can use Admin to test company verification, drive approvals, and placement PDF reports.
          </p>
        </div>

        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            color: 'var(--danger)',
            padding: '10px 14px',
            borderRadius: '8px',
            fontSize: '13px',
            marginBottom: '16px',
          }}>
            <AlertCircle size={16} /> <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                id="email"
                type="email"
                className="form-control"
                style={{ paddingLeft: '44px' }}
                placeholder="admin@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label htmlFor="password">Password</label>
            <div style={{ position: 'relative' }}>
              <KeyRound size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                id="password"
                type="password"
                className="form-control"
                style={{ paddingLeft: '44px' }}
                placeholder="admin123"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }} disabled={submitting}>
            {submitting ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <p style={{ marginTop: '16px', textAlign: 'center', fontSize: '13px', color: 'var(--text-muted)' }}>
          Need an account? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: '600' }}>Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
