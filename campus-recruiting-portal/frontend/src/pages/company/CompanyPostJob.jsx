import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate as useNav } from 'react-router-dom';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { Briefcase, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';

const CompanyPostJob = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNav();

  // Form states
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [employmentType, setEmploymentType] = useState('Full-time');
  const [ctc, setCtc] = useState('');
  const [description, setDescription] = useState('');
  const [eligibilityCriteria, setEligibilityCriteria] = useState('');
  const [minimumCgpa, setMinimumCgpa] = useState('');
  const [eligibleBranches, setEligibleBranches] = useState('');
  const [backlogsAllowed, setBacklogsAllowed] = useState(false);
  const [deadline, setDeadline] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      await api.post(`/api/postings/company/${user.profileId}`, {
        title,
        location,
        employmentType,
        ctc: parseFloat(ctc),
        description,
        eligibilityCriteria,
        minimumCgpa: parseFloat(minimumCgpa),
        eligibleBranches,
        backlogsAllowed,
        deadline,
      });

      setSuccess('Job posting submitted for Admin approval!');
      setTimeout(() => {
        navigate('/company/jobs');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit job posting.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="portal-container">
      <Link to="/company/dashboard" style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        textDecoration: 'none',
        color: 'var(--text-muted)',
        marginBottom: '24px',
        fontSize: '14px',
        fontWeight: '500'
      }}>
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>

      <div className="glass-panel" style={{ maxWidth: '720px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '8px' }}>Post a Job Opening</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px' }}>
          Fill in the specifications below. The posting will go live to eligible students after Admin approval.
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
            marginBottom: '20px'
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            color: 'var(--success)',
            padding: '12px 16px',
            borderRadius: '8px',
            fontSize: '14px',
            marginBottom: '20px'
          }}>
            <CheckCircle size={16} />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group full-span">
              <label>Job Title</label>
              <input
                type="text"
                className="form-control"
                placeholder="Software Engineer Intern"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Bengaluru / Remote"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Employment Type</label>
              <select
                className="form-control"
                value={employmentType}
                onChange={(e) => setEmploymentType(e.target.value)}
              >
                <option value="Full-time">Full-time</option>
                <option value="Internship">Internship</option>
                <option value="Contract">Contract</option>
              </select>
            </div>

            <div className="form-group">
              <label>Compensation Package (CTC in LPA)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                className="form-control"
                placeholder="e.g. 12"
                value={ctc}
                onChange={(e) => setCtc(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Application Deadline</label>
              <input
                type="date"
                className="form-control"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                required
              />
            </div>

            <div className="form-group full-span">
              <label>Job Description</label>
              <textarea
                className="form-control"
                rows="4"
                placeholder="Detail core responsibilities, key tasks, and expectations..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
            </div>

            <div className="form-group full-span">
              <h3 style={{ fontSize: '15px', fontWeight: '700', marginTop: '12px', marginBottom: '8px' }}>
                Eligibility Constraints
              </h3>
            </div>

            <div className="form-group">
              <label>Minimum CGPA Cutoff</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="10"
                className="form-control"
                placeholder="e.g. 8.0"
                value={minimumCgpa}
                onChange={(e) => setMinimumCgpa(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ display: 'flex', alignItems: 'center', height: '100%', paddingTop: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={backlogsAllowed}
                  onChange={(e) => setBacklogsAllowed(e.target.checked)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '14px', fontWeight: '500' }}>Active Backlogs Allowed?</span>
              </label>
            </div>

            <div className="form-group full-span">
              <label>Eligible Branches (comma separated)</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. CSE, IT, ECE"
                value={eligibleBranches}
                onChange={(e) => setEligibleBranches(e.target.value)}
                required
              />
            </div>

            <div className="form-group full-span">
              <label>Summary Eligibility Statement</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. 8.0+ CGPA, CSE/IT, no backlogs"
                value={eligibilityCriteria}
                onChange={(e) => setEligibilityCriteria(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '14px', marginTop: '16px' }}
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Post Job Opening'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CompanyPostJob;
