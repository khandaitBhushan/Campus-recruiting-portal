import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { KeyRound, Mail, AlertCircle } from 'lucide-react';

const ROLES = {
  ADMIN: {
    title: 'Admin Login',
    buttonText: 'ADMIN LOGIN',
    email: 'admin@university.edu',
    password: 'admin123',
    message: 'Admin access: Pre-filled credentials to inspect the Admin dashboard, verify recruiters, and view placement reports.',
  },
  STUDENT: {
    title: 'Student Login',
    buttonText: 'STUDENT LOGIN',
    email: 'priya.mehta@university.edu',
    password: 'password123',
    message: 'Student access: Pre-filled credentials to test job eligibility and application tracking (Priya Mehta - CSE).',
  },
  COMPANY: {
    title: 'Company Login',
    buttonText: 'COMPANY LOGIN (CORPAY)',
    email: 'campus@corpay.example',
    password: 'password123',
    message: 'Company access: Pre-filled credentials for Corpay (posted multiple tech roles: SDE, Cloud & Data platform).',
  },
};

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeRole, setActiveRole] = useState('ADMIN');
  const [email, setEmail] = useState(ROLES.ADMIN.email);
  const [password, setPassword] = useState(ROLES.ADMIN.password);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const selectRole = (roleKey) => {
    setActiveRole(roleKey);
    setEmail(ROLES[roleKey].email);
    setPassword(ROLES[roleKey].password);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const user = await login(email, password);
      if (user.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else if (user.role === 'STUDENT') {
        navigate('/student/dashboard');
      } else if (user.role === 'COMPANY') {
        navigate('/company/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setSubmitting(false);
    }
  };

  const current = ROLES[activeRole];

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '75vh',
      padding: '20px',
    }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '420px' }}>
        
        {/* Simple Role Toggle Tabs */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '20px',
          borderBottom: '1px solid var(--border)',
          paddingBottom: '12px',
        }}>
          <button
            type="button"
            onClick={() => selectRole('ADMIN')}
            className={`btn ${activeRole === 'ADMIN' ? 'btn-primary' : 'btn-outline'}`}
            style={{ flex: 1, padding: '8px', fontSize: '13px', fontWeight: '600' }}
          >
            Admin
          </button>
          <button
            type="button"
            onClick={() => selectRole('STUDENT')}
            className={`btn ${activeRole === 'STUDENT' ? 'btn-primary' : 'btn-outline'}`}
            style={{ flex: 1, padding: '8px', fontSize: '13px', fontWeight: '600' }}
          >
            Student
          </button>
          <button
            type="button"
            onClick={() => selectRole('COMPANY')}
            className={`btn ${activeRole === 'COMPANY' ? 'btn-primary' : 'btn-outline'}`}
            style={{ flex: 1.2, padding: '8px', fontSize: '12px', fontWeight: '600' }}
          >
            Corpay
          </button>
        </div>

        {/* Big Letter Title */}
        <h2 style={{
          fontSize: '26px',
          fontWeight: '800',
          marginBottom: '6px',
          textAlign: 'center',
          letterSpacing: '-0.02em',
        }}>
          {current.title}
        </h2>

        {/* Short Grey Message */}
        <p style={{
          color: 'var(--text-muted)',
          fontSize: '13px',
          lineHeight: '1.4',
          marginBottom: '20px',
          textAlign: 'center',
        }}>
          {current.message}
        </p>

        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            color: 'var(--danger)',
            padding: '10px 14px',
            borderRadius: '8px',
            fontSize: '13px',
            marginBottom: '18px',
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
              }} />
              <input
                id="email"
                type="email"
                className="form-control"
                style={{ paddingLeft: '44px' }}
                placeholder={current.email}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '22px' }}>
            <label htmlFor="password">Password</label>
            <div style={{ position: 'relative' }}>
              <KeyRound size={18} style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
              }} />
              <input
                id="password"
                type="password"
                className="form-control"
                style={{ paddingLeft: '44px' }}
                placeholder={current.password}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Big Letter Label Above Button */}
          <div style={{
            fontSize: '12px',
            fontWeight: '700',
            color: 'var(--text-muted)',
            textAlign: 'center',
            marginBottom: '8px',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          }}>
            Click to Sign In
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: '14px',
              fontSize: '15px',
              fontWeight: '800',
              letterSpacing: '0.04em',
            }}
            disabled={submitting}
          >
            {submitting ? 'LOGGING IN...' : current.buttonText}
          </button>
        </form>

        <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '13px', color: 'var(--text-muted)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--primary)', fontWeight: '600', textDecoration: 'none' }}>
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
