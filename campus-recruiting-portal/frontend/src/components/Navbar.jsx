import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { LogOut, Sun, Moon, Briefcase } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [darkTheme, setDarkTheme] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });
  const [displayName, setDisplayName] = useState('');

  useEffect(() => {
    if (darkTheme) {
      document.body.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');
    }
  }, [darkTheme]);

  useEffect(() => {
    if (!user) {
      setDisplayName('');
      return;
    }
    if (user.role === 'ADMIN') {
      setDisplayName('Admin');
      return;
    }

    // Set initial display name by parsing the email prefix (e.g., tushar.grover -> Tushar Grover)
    const emailPrefix = user.email.split('@')[0];
    const nameFormatted = emailPrefix.split('.').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
    setDisplayName(nameFormatted);

    if (user.profileId) {
      const fetchName = async () => {
        try {
          if (user.role === 'STUDENT') {
            const res = await api.get(`/api/students/${user.profileId}`);
            setDisplayName(res.data.name);
          } else if (user.role === 'COMPANY') {
            const res = await api.get(`/api/companies/${user.profileId}`);
            setDisplayName(res.data.name);
          }
        } catch (err) {
          console.error('Failed to load profile name:', err);
        }
      };
      fetchName();
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="glass-panel" style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px 40px',
      borderRadius: '0 0 16px 16px',
      marginBottom: '32px',
      borderTop: 'none',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Briefcase size={28} color="var(--primary)" />
        <Link to="/" style={{
          textDecoration: 'none',
          color: 'var(--text)',
          fontSize: '20px',
          fontWeight: '700',
          letterSpacing: '-0.5px'
        }}>
          CRP <span style={{ color: 'var(--primary)' }}>Portal</span>
        </Link>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        {user && user.role === 'STUDENT' && (
          <>
            <Link to="/student/dashboard" className="nav-link" style={linkStyle}>Dashboard</Link>
            <Link to="/student/jobs" className="nav-link" style={linkStyle}>Browse Jobs</Link>
            <Link to="/student/applications" className="nav-link" style={linkStyle}>My Applications</Link>
            <Link to="/student/profile" className="nav-link" style={linkStyle}>My Profile</Link>
          </>
        )}

        {user && user.role === 'COMPANY' && (
          <>
            <Link to="/company/dashboard" className="nav-link" style={linkStyle}>Dashboard</Link>
            <Link to="/company/post-job" className="nav-link" style={linkStyle}>Post a Job</Link>
            <Link to="/company/jobs" className="nav-link" style={linkStyle}>Job Openings</Link>
          </>
        )}

        {user && user.role === 'ADMIN' && (
          <>
            <Link to="/admin/dashboard" className="nav-link" style={linkStyle}>Dashboard</Link>
            <Link to="/admin/companies" className="nav-link" style={linkStyle}>Companies</Link>
            <Link to="/admin/jobs/pending" className="nav-link" style={linkStyle}>Pending Jobs</Link>
            <Link to="/admin/analytics" className="nav-link" style={linkStyle}>Analytics</Link>
            <Link to="/admin/students" className="nav-link" style={linkStyle}>Students</Link>
          </>
        )}

        <button 
          onClick={() => setDarkTheme(!darkTheme)} 
          className="btn btn-outline" 
          style={{ padding: '8px', borderRadius: '50%' }}
          title="Toggle Theme"
        >
          {darkTheme ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--primary)' }}>
              Welcome, {displayName} ({user.role})
            </span>
            <button onClick={handleLogout} className="btn btn-danger" style={{ padding: '8px 16px', fontSize: '14px' }}>
              <LogOut size={16} /> Logout
            </button>
          </div>
        ) : (
          <Link to="/login" className="btn btn-primary" style={{ padding: '8px 20px', fontSize: '14px' }}>
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

const linkStyle = {
  textDecoration: 'none',
  color: 'var(--text-muted)',
  fontSize: '15px',
  fontWeight: '500',
  transition: 'var(--transition)',
};

// Add CSS hover style injections for nav links
const style = document.createElement('style');
style.innerHTML = `
  .nav-link:hover {
    color: var(--primary) !important;
  }
`;
document.head.appendChild(style);

export default Navbar;
