import React, { useContext } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  BriefcaseBusiness,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Sparkles,
  UserRound,
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const navigationItems = [
  {
    label: 'Overview',
    to: '/student/dashboard',
    icon: LayoutDashboard,
    match: '/student/dashboard',
  },
  {
    label: 'Jobs',
    to: '/student/jobs',
    icon: BriefcaseBusiness,
    match: '/student/jobs',
  },
  {
    label: 'Applications',
    to: '/student/applications',
    icon: Sparkles,
    match: '/student/applications',
  },
  {
    label: 'Profile',
    to: '/student/profile',
    icon: UserRound,
    match: '/student/profile',
  },
];

const formatFallbackName = (email = '') =>
  email
    .split('@')[0]
    .split('.')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

const StudentWorkspace = ({
  eyebrow,
  title,
  description,
  actions,
  children,
  aside,
  profileName,
  profileEmail,
  backLink,
  backLabel = 'Back',
  statusLabel = 'Placement cycle active',
}) => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const displayName = profileName || formatFallbackName(user?.email) || 'Student';
  const email = profileEmail || user?.email || '';
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((chunk) => chunk[0]?.toUpperCase())
    .join('');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="student-workspace">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>

      <aside className="workspace-sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-brand-mark">
            <GraduationCap size={18} />
          </div>
          <div>
            <p className="sidebar-brand-eyebrow">Campus recruiting</p>
            <h2>Student portal</h2>
          </div>
        </div>

        <div className="sidebar-profile surface-card">
          <div className="sidebar-avatar">{initials || 'S'}</div>
          <div>
            <h3>{displayName}</h3>
            <p>{email}</p>
          </div>
          <span className="sidebar-status-pill">{statusLabel}</span>
        </div>

        <nav className="sidebar-nav" aria-label="Student navigation">
          {navigationItems.map(({ label, to, icon: Icon, match }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                isActive || location.pathname.startsWith(`${match}/`)
                  ? 'sidebar-link active'
                  : 'sidebar-link'
              }
            >
              <Icon size={17} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-note surface-card">
          <p className="sidebar-note-label">This week</p>
          <p>
            Keep your resume and academic details current so eligible roles stay easy to
            act on.
          </p>
        </div>

        <button type="button" className="btn btn-secondary sidebar-logout" onClick={handleLogout}>
          <LogOut size={16} />
          Log out
        </button>
      </aside>

      <div className="workspace-main-shell">
        <div className="workspace-mobile-nav" aria-label="Student navigation">
          <div className="workspace-mobile-brand" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div className="sidebar-brand-mark">
                <GraduationCap size={16} />
              </div>
              <span>Student portal</span>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="btn btn-secondary"
              style={{ padding: '6px 12px', fontSize: '12px' }}
              title="Log out of student portal"
            >
              <LogOut size={13} />
              <span>Log out</span>
            </button>
          </div>
          <div className="workspace-mobile-links">
            {navigationItems.map(({ label, to, icon: Icon, match }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  isActive || location.pathname.startsWith(`${match}/`)
                    ? 'mobile-link active'
                    : 'mobile-link'
                }
              >
                <Icon size={15} />
                <span>{label}</span>
              </NavLink>
            ))}
          </div>
        </div>

        <header className="workspace-header reveal">
          <div className="workspace-header-copy">
            {backLink ? (
              <Link className="back-link" to={backLink}>
                <ArrowLeft size={15} />
                {backLabel}
              </Link>
            ) : null}
            <p className="workspace-eyebrow">{eyebrow}</p>
            <h1>{title}</h1>
            <p className="workspace-description">{description}</p>
          </div>
          {actions ? <div className="workspace-actions">{actions}</div> : null}
        </header>

        <main
          id="main-content"
          className={aside ? 'workspace-content with-aside' : 'workspace-content'}
        >
          <div className="workspace-primary">{children}</div>
          {aside ? <aside className="workspace-aside">{aside}</aside> : null}
        </main>
      </div>
    </div>
  );
};

export default StudentWorkspace;
