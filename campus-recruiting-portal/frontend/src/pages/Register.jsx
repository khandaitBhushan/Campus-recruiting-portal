import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { User, Building, AlertCircle, CheckCircle } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('STUDENT');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Student form fields
  const [studentEmail, setStudentEmail] = useState('');
  const [studentPassword, setStudentPassword] = useState('');
  const [studentName, setStudentName] = useState('');
  const [studentDept, setStudentDept] = useState('');
  const [studentBranch, setStudentBranch] = useState('');
  const [studentCgpa, setStudentCgpa] = useState('');
  const [studentBacklogs, setStudentBacklogs] = useState(0);
  const [studentGradYear, setStudentGradYear] = useState(2027);

  // Company form fields
  const [companyName, setCompanyName] = useState('');
  const [companyIndustry, setCompanyIndustry] = useState('');
  const [companyEmail, setCompanyEmail] = useState('');
  const [companyPassword, setCompanyPassword] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      if (role === 'STUDENT') {
        if (!studentEmail.endsWith('@university.edu')) {
          setError('Student registration is strictly restricted to @university.edu emails.');
          setSubmitting(false);
          return;
        }
        await api.post('/api/auth/register/student', {
          email: studentEmail,
          password: studentPassword,
          name: studentName,
          department: studentDept,
          branch: studentBranch,
          cgpa: parseFloat(studentCgpa),
          activeBacklogs: parseInt(studentBacklogs),
          resumeUrl: '',
          graduationYear: parseInt(studentGradYear),
        });
      } else {
        await api.post('/api/auth/register/company', {
          name: companyName,
          industry: companyIndustry,
          recruiterEmail: companyEmail,
          password: companyPassword,
        });
      }

      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1800);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', padding: '20px' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '520px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '700', textAlign: 'center', marginBottom: '4px' }}>Create an Account</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '13px', textAlign: 'center', marginBottom: '18px' }}>
          Select your role to register
        </p>

        {/* Role Tabs */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
          <button
            type="button"
            onClick={() => { setRole('STUDENT'); setError(''); }}
            className={`btn ${role === 'STUDENT' ? 'btn-primary' : 'btn-outline'}`}
            style={{ flex: 1, padding: '10px' }}
          >
            <User size={16} /> Student
          </button>
          <button
            type="button"
            onClick={() => { setRole('COMPANY'); setError(''); }}
            className={`btn ${role === 'COMPANY' ? 'btn-primary' : 'btn-outline'}`}
            style={{ flex: 1, padding: '10px' }}
          >
            <Building size={16} /> Company
          </button>
        </div>

        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--danger)', background: 'rgba(239, 68, 68, 0.1)', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px' }}>
            <AlertCircle size={16} /> <span>{error}</span>
          </div>
        )}

        {success && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--success)', background: 'rgba(16, 185, 129, 0.1)', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px' }}>
            <CheckCircle size={16} /> <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleRegister}>
          {role === 'STUDENT' ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label>Full Name</label>
                <input type="text" className="form-control" placeholder="Karan Grover" value={studentName} onChange={(e) => setStudentName(e.target.value)} required />
              </div>

              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label>University Email</label>
                <input type="email" className="form-control" placeholder="karan@university.edu" value={studentEmail} onChange={(e) => setStudentEmail(e.target.value)} required />
                <small style={{ color: 'var(--primary)', fontWeight: '600', marginTop: '4px', display: 'block', fontSize: '11px' }}>
                  ✓ Strictly restricted to institutional domain: @university.edu
                </small>
              </div>

              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label>Password</label>
                <input type="password" className="form-control" placeholder="••••••••" value={studentPassword} onChange={(e) => setStudentPassword(e.target.value)} required />
              </div>

              <div className="form-group">
                <label>Department</label>
                <input type="text" className="form-control" placeholder="Engineering" value={studentDept} onChange={(e) => setStudentDept(e.target.value)} required />
              </div>

              <div className="form-group">
                <label>Branch</label>
                <input type="text" className="form-control" placeholder="CSE" value={studentBranch} onChange={(e) => setStudentBranch(e.target.value)} required />
              </div>

              <div className="form-group">
                <label>CGPA</label>
                <input type="number" step="0.01" min="0" max="10" className="form-control" placeholder="8.50" value={studentCgpa} onChange={(e) => setStudentCgpa(e.target.value)} required />
              </div>

              <div className="form-group">
                <label>Active Backlogs</label>
                <input type="number" min="0" className="form-control" value={studentBacklogs} onChange={(e) => setStudentBacklogs(e.target.value)} required />
              </div>

              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label>Graduation Year</label>
                <input type="number" min="2000" className="form-control" value={studentGradYear} onChange={(e) => setStudentGradYear(e.target.value)} required />
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div className="form-group">
                <label>Company Name</label>
                <input type="text" className="form-control" placeholder="Synergy Tech Inc." value={companyName} onChange={(e) => setCompanyName(e.target.value)} required />
              </div>

              <div className="form-group">
                <label>Industry</label>
                <input type="text" className="form-control" placeholder="Software / Analytics" value={companyIndustry} onChange={(e) => setCompanyIndustry(e.target.value)} required />
              </div>

              <div className="form-group">
                <label>Recruiter Email</label>
                <input type="email" className="form-control" placeholder="recruiter@synergy.com" value={companyEmail} onChange={(e) => setCompanyEmail(e.target.value)} required />
                <small style={{ color: 'var(--success)', fontWeight: '600', marginTop: '4px', display: 'block', fontSize: '11px' }}>
                  ✓ Any corporate/business domain accepted. Note: Requires Admin approval before posting jobs.
                </small>
              </div>

              <div className="form-group" style={{ marginBottom: '14px' }}>
                <label>Password</label>
                <input type="password" className="form-control" placeholder="••••••••" value={companyPassword} onChange={(e) => setCompanyPassword(e.target.value)} required />
              </div>
            </div>
          )}

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', marginTop: '8px' }} disabled={submitting}>
            {submitting ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p style={{ marginTop: '16px', textAlign: 'center', fontSize: '13px', color: 'var(--text-muted)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '600' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
