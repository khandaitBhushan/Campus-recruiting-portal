import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { KeyRound, Mail, AlertCircle, ShieldCheck, Building, GraduationCap, Sparkles, ArrowRight, Check } from 'lucide-react';

const DEMO_ACCOUNTS = [
  {
    role: 'ADMIN',
    title: 'University Placement Cell (Admin)',
    email: 'admin@university.edu',
    password: 'admin123',
    badge: 'Admin Panel',
    badgeColor: '#4f46e5',
    badgeBg: 'rgba(79, 70, 229, 0.12)',
    icon: ShieldCheck,
    description: 'Full administrative access: audit company registrations, approve job drives, review placement analytics, and export PDF reports.',
    highlight: true,
  },
  {
    role: 'COMPANY',
    title: 'Approved Recruiter (Orbit Analytics)',
    email: 'recruiting@orbit.example',
    password: 'password123',
    badge: 'Recruiter Board',
    badgeColor: '#059669',
    badgeBg: 'rgba(5, 150, 105, 0.12)',
    icon: Building,
    description: 'Post job vacancies, set branch & CGPA eligibility criteria, review candidate resumes, and update applicant statuses.',
    highlight: false,
  },
  {
    role: 'STUDENT',
    title: 'Eligible Student (Priya Mehta)',
    email: 'priya.mehta@university.edu',
    password: 'password123',
    badge: 'Student Portal',
    badgeColor: '#d97706',
    badgeBg: 'rgba(217, 119, 6, 0.12)',
    icon: GraduationCap,
    description: 'CGPA 8.72 (CSE). Browse active drives, check automated criteria eligibility, and track multi-round application progress.',
    highlight: false,
  },
];

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [selectedDemoRole, setSelectedDemoRole] = useState(null);

  const applyDemoAccount = (demo) => {
    setEmail(demo.email);
    setPassword(demo.password);
    setSelectedDemoRole(demo.role);
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

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '80vh',
      padding: '24px 16px',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '960px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '24px',
        alignItems: 'start',
      }}>

        {/* LEFT COLUMN: Demo Credentials & Evaluator Showcase */}
        <div className="glass-panel" style={{
          padding: '24px',
          border: '1px solid rgba(79, 70, 229, 0.25)',
          background: 'linear-gradient(145deg, rgba(79, 70, 229, 0.04) 0%, rgba(255, 255, 255, 0.02) 100%)',
          borderRadius: '16px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <span style={{
              display: 'inline-flex',
              padding: '6px 12px',
              borderRadius: '999px',
              backgroundColor: 'rgba(79, 70, 229, 0.15)',
              color: '#4f46e5',
              fontSize: '12px',
              fontWeight: '700',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}>
              <Sparkles size={14} style={{ marginRight: '6px' }} />
              Recruiter & Evaluator Demo
            </span>
          </div>

          <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '8px', color: 'var(--text)' }}>
            Instant Role Exploration
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: '1.5', marginBottom: '20px' }}>
            This is a student project demonstration. Pre-configured demo credentials are provided below so you can explore the
            <strong> Admin Placement Cell Dashboard</strong>, <strong>Recruiter Board</strong>, and <strong>Student Portal</strong> instantly without manual registration.
          </p>

          {/* Quick-fill Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {DEMO_ACCOUNTS.map((demo) => {
              const Icon = demo.icon;
              const isSelected = selectedDemoRole === demo.role;

              return (
                <div
                  key={demo.role}
                  onClick={() => applyDemoAccount(demo)}
                  style={{
                    padding: '14px 16px',
                    borderRadius: '12px',
                    border: isSelected
                      ? `2px solid ${demo.badgeColor}`
                      : demo.highlight
                        ? '1px solid rgba(79, 70, 229, 0.35)'
                        : '1px solid var(--border)',
                    backgroundColor: isSelected
                      ? 'rgba(79, 70, 229, 0.08)'
                      : demo.highlight
                        ? 'rgba(79, 70, 229, 0.03)'
                        : 'rgba(255, 255, 255, 0.03)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    position: 'relative',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '6px',
                        backgroundColor: demo.badgeBg,
                        color: demo.badgeColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <Icon size={16} />
                      </div>
                      <strong style={{ fontSize: '14px', color: 'var(--text)' }}>
                        {demo.title}
                      </strong>
                    </div>

                    <span style={{
                      fontSize: '11px',
                      fontWeight: '700',
                      padding: '2px 8px',
                      borderRadius: '6px',
                      backgroundColor: demo.badgeBg,
                      color: demo.badgeColor,
                    }}>
                      {demo.badge}
                    </span>
                  </div>

                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '0 0 10px 0', lineHeight: '1.4' }}>
                    {demo.description}
                  </p>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '6px 10px',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    fontSize: '12px',
                  }}>
                    <code style={{ color: 'var(--text)', fontWeight: '600' }}>
                      {demo.email} &nbsp;|&nbsp; {demo.password}
                    </code>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: '600',
                      color: isSelected ? demo.badgeColor : 'var(--primary)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}>
                      {isSelected ? (<><Check size={12} /> Loaded</>) : (<>Use Credentials <ArrowRight size={12} /></>)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: Sign In Form */}
        <div className="glass-panel" style={{ padding: '28px', borderRadius: '16px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px', textAlign: 'center' }}>
            Sign In
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px', textAlign: 'center' }}>
            Select a demo role or sign in with your account
          </p>

          {error && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              color: 'var(--danger)',
              padding: '12px 16px',
              borderRadius: '8px',
              fontSize: '14px',
              marginBottom: '20px',
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
                  placeholder="admin@university.edu"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setSelectedDemoRole(null); }}
                  required
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '24px' }}>
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
                  placeholder="admin123"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setSelectedDemoRole(null); }}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '14px', fontSize: '15px', fontWeight: '600' }}
              disabled={submitting}
            >
              {submitting ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px', color: 'var(--text-muted)' }}>
            Want to register a new account?{' '}
            <Link to="/register" style={{ color: 'var(--primary)', fontWeight: '600', textDecoration: 'none' }}>
              Register here
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Login;
