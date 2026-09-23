import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  ShieldCheck,
  GraduationCap,
  BriefcaseBusiness,
  Mail,
  KeyRound,
  AlertCircle,
  Building2,
  Sparkles,
} from 'lucide-react';

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // Admin credentials state (pre-filled)
  const [adminEmail, setAdminEmail] = useState('admin@university.edu');
  const [adminPassword, setAdminPassword] = useState('admin123');

  // Student credentials state (pre-filled with seeded demo student)
  const [studentEmail, setStudentEmail] = useState('priya.mehta@university.edu');
  const [studentPassword, setStudentPassword] = useState('password123');

  // Company credentials state (pre-filled with seeded demo company Corpay)
  const [companyEmail, setCompanyEmail] = useState('campus@corpay.example');
  const [companyPassword, setCompanyPassword] = useState('password123');

  // Error & loading states per card
  const [activeError, setActiveError] = useState('');
  const [loadingRole, setLoadingRole] = useState('');

  const executeLogin = async (email, password, roleLabel) => {
    setActiveError('');
    setLoadingRole(roleLabel);
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
      setActiveError(err.response?.data?.message || 'Invalid email or password. Please verify credentials.');
    } finally {
      setLoadingRole('');
    }
  };

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '1100px',
        margin: '20px auto 40px',
        padding: '0 16px',
        boxSizing: 'border-box',
      }}
    >
      {/* Page Title & Branding */}
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--navy-100)',
            color: 'var(--navy-600)',
            padding: '6px 14px',
            borderRadius: '999px',
            fontSize: '13px',
            fontWeight: '700',
            marginBottom: '12px',
          }}
        >
          <Sparkles size={15} />
          Campus Recruiting Portal Demo & Evaluator Access
        </div>
        <h1
          style={{
            fontSize: 'clamp(26px, 4vw, 36px)',
            fontWeight: '800',
            letterSpacing: '-0.02em',
            margin: '0 0 8px',
            color: 'var(--ink-900)',
          }}
        >
          Direct Role Login
        </h1>
        <p style={{ color: 'var(--ink-500)', fontSize: '15px', maxWidth: '640px', margin: '0 auto' }}>
          Select any portal role below. Each box is pre-loaded with verified demo credentials so you can click to log in immediately, or enter your own account details.
        </p>
      </div>

      {/* Global Error Banner if any */}
      {activeError && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: 'var(--danger)',
            padding: '14px 18px',
            borderRadius: '12px',
            fontSize: '14px',
            marginBottom: '24px',
            maxWidth: '1040px',
            margin: '0 auto 24px',
          }}
        >
          <AlertCircle size={18} style={{ flexShrink: 0 }} />
          <span>{activeError}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TOP HEADER: ADMIN LOGIN BAR */}
      {/* ========================================================================= */}
      <div
        className="surface-card"
        style={{
          border: '2px solid var(--navy-500)',
          borderRadius: '20px',
          padding: '24px',
          marginBottom: '28px',
          background: 'color-mix(in oklab, var(--navy-100) 25%, white)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                display: 'grid',
                placeItems: 'center',
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'var(--navy-600)',
                color: 'white',
              }}
            >
              <ShieldCheck size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '22px', fontWeight: '800', margin: 0, color: 'var(--ink-900)' }}>
                Admin Login
              </h2>
              <span style={{ fontSize: '13px', color: 'var(--ink-500)' }}>
                University placement cell & portal management
              </span>
            </div>
          </div>
          <span
            style={{
              fontSize: '12px',
              fontWeight: '700',
              padding: '4px 10px',
              borderRadius: '999px',
              background: 'var(--navy-600)',
              color: 'white',
            }}
          >
            Direct Administrator Access
          </span>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            executeLogin(adminEmail, adminPassword, 'ADMIN');
          }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr)) auto',
            gap: '16px',
            alignItems: 'end',
          }}
        >
          <div className="form-group" style={{ margin: 0 }}>
            <label style={{ fontSize: '13px', fontWeight: '700', marginBottom: '6px', display: 'block' }}>
              Admin Email
            </label>
            <div style={{ position: 'relative' }}>
              <Mail
                size={16}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--ink-500)',
                }}
              />
              <input
                type="email"
                className="form-control"
                style={{ paddingLeft: '38px', height: '44px' }}
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label style={{ fontSize: '13px', fontWeight: '700', marginBottom: '6px', display: 'block' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <KeyRound
                size={16}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--ink-500)',
                }}
              />
              <input
                type="password"
                className="form-control"
                style={{ paddingLeft: '38px', height: '44px' }}
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{
              height: '44px',
              padding: '0 24px',
              fontSize: '15px',
              fontWeight: '700',
              whiteSpace: 'nowrap',
            }}
            disabled={loadingRole === 'ADMIN'}
          >
            {loadingRole === 'ADMIN' ? 'Signing in...' : 'Admin Login'}
          </button>
        </form>
      </div>

      {/* ========================================================================= */}
      {/* 2-COLUMN SPLIT: LEFT STUDENT LOGIN | RIGHT COMPANY LOGIN */}
      {/* ========================================================================= */}
      <div className="responsive-grid-2">
        {/* LEFT COLUMN: STUDENT LOGIN */}
        <div
          className="surface-card"
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            borderRadius: '20px',
            padding: '28px',
            border: '1px solid var(--line-soft)',
            background: 'var(--surface-panel)',
          }}
        >
          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '16px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    display: 'grid',
                    placeItems: 'center',
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    background: 'var(--moss-500)',
                    color: 'white',
                  }}
                >
                  <GraduationCap size={22} />
                </div>
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: '800', margin: 0 }}>Student Login</h2>
                  <span style={{ fontSize: '13px', color: 'var(--ink-500)' }}>
                    Apply for jobs & track status
                  </span>
                </div>
              </div>
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: '700',
                  padding: '4px 10px',
                  borderRadius: '999px',
                  background: 'var(--moss-100)',
                  color: 'var(--moss-500)',
                }}
              >
                Priya Mehta (CSE)
              </span>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--ink-500)', marginBottom: '20px', lineHeight: 1.5 }}>
              Explore approved company job openings, track review stages, and access placement resources.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                executeLogin(studentEmail, studentPassword, 'STUDENT');
              }}
            >
              <div className="form-group" style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '13px', fontWeight: '700', marginBottom: '6px', display: 'block' }}>
                  Student Email
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail
                    size={16}
                    style={{
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--ink-500)',
                    }}
                  />
                  <input
                    type="email"
                    className="form-control"
                    style={{ paddingLeft: '38px', height: '44px' }}
                    value={studentEmail}
                    onChange={(e) => setStudentEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '13px', fontWeight: '700', marginBottom: '6px', display: 'block' }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <KeyRound
                    size={16}
                    style={{
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--ink-500)',
                    }}
                  />
                  <input
                    type="password"
                    className="form-control"
                    style={{ paddingLeft: '38px', height: '44px' }}
                    value={studentPassword}
                    onChange={(e) => setStudentPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{
                  width: '100%',
                  height: '46px',
                  fontSize: '15px',
                  fontWeight: '700',
                  marginBottom: '16px',
                }}
                disabled={loadingRole === 'STUDENT'}
              >
                {loadingRole === 'STUDENT' ? 'Logging in...' : 'Student Login'}
              </button>
            </form>
          </div>

          <div
            style={{
              paddingTop: '16px',
              borderTop: '1px solid var(--line-soft)',
              textAlign: 'center',
              fontSize: '13px',
              color: 'var(--ink-500)',
            }}
          >
            New student?{' '}
            <Link to="/register" style={{ color: 'var(--navy-600)', fontWeight: '700', textDecoration: 'none' }}>
              Register student profile
            </Link>
          </div>
        </div>

        {/* RIGHT COLUMN: COMPANY / RECRUITER LOGIN */}
        <div
          className="surface-card"
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            borderRadius: '20px',
            padding: '28px',
            border: '1px solid var(--line-soft)',
            background: 'var(--surface-panel)',
          }}
        >
          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '16px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    display: 'grid',
                    placeItems: 'center',
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    background: 'var(--amber-500)',
                    color: 'white',
                  }}
                >
                  <BriefcaseBusiness size={22} />
                </div>
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: '800', margin: 0 }}>Company Login</h2>
                  <span style={{ fontSize: '13px', color: 'var(--ink-500)' }}>
                    Recruiter hiring dashboard
                  </span>
                </div>
              </div>
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: '700',
                  padding: '4px 10px',
                  borderRadius: '999px',
                  background: 'var(--amber-100)',
                  color: 'oklch(0.55 0.14 78)',
                }}
              >
                Corpay (3 Roles Live)
              </span>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--ink-500)', marginBottom: '20px', lineHeight: 1.5 }}>
              Post full-time & internship job openings, screen student applicants, and manage recruitment decisions.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                executeLogin(companyEmail, companyPassword, 'COMPANY');
              }}
            >
              <div className="form-group" style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '13px', fontWeight: '700', marginBottom: '6px', display: 'block' }}>
                  Recruiter Email
                </label>
                <div style={{ position: 'relative' }}>
                  <Building2
                    size={16}
                    style={{
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--ink-500)',
                    }}
                  />
                  <input
                    type="email"
                    className="form-control"
                    style={{ paddingLeft: '38px', height: '44px' }}
                    value={companyEmail}
                    onChange={(e) => setCompanyEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '13px', fontWeight: '700', marginBottom: '6px', display: 'block' }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <KeyRound
                    size={16}
                    style={{
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--ink-500)',
                    }}
                  />
                  <input
                    type="password"
                    className="form-control"
                    style={{ paddingLeft: '38px', height: '44px' }}
                    value={companyPassword}
                    onChange={(e) => setCompanyPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{
                  width: '100%',
                  height: '46px',
                  fontSize: '15px',
                  fontWeight: '700',
                  marginBottom: '16px',
                }}
                disabled={loadingRole === 'COMPANY'}
              >
                {loadingRole === 'COMPANY' ? 'Logging in...' : 'Company Login'}
              </button>
            </form>
          </div>

          <div
            style={{
              paddingTop: '16px',
              borderTop: '1px solid var(--line-soft)',
              textAlign: 'center',
              fontSize: '13px',
              color: 'var(--ink-500)',
            }}
          >
            New recruiter?{' '}
            <Link to="/register" style={{ color: 'var(--navy-600)', fontWeight: '700', textDecoration: 'none' }}>
              Register company profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
