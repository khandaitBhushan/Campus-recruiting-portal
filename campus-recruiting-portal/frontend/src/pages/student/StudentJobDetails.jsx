import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { Briefcase, MapPin, DollarSign, Award, AlertTriangle, FileText, CheckCircle2, ChevronLeft } from 'lucide-react';

const StudentJobDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [profile, setProfile] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Apply form state
  const [coverLetter, setCoverLetter] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const [jobRes, profileRes, appsRes] = await Promise.all([
          api.get(`/api/postings/${id}`),
          api.get(`/api/students/${user.profileId}`),
          api.get(`/api/applications/student/${user.profileId}`)
        ]);
        setJob(jobRes.data);
        setProfile(profileRes.data);
        setApplications(appsRes.data);
      } catch (err) {
        console.error('Error fetching job details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id, user.profileId]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}>
        <div className="loader"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Job posting not found</h2>
        <Link to="/student/jobs" className="btn btn-outline" style={{ marginTop: '20px' }}>
          Back to Jobs
        </Link>
      </div>
    );
  }

  // Eligibility checking logic
  const meetsCgpa = profile.cgpa >= job.minimumCgpa;
  
  const eligibleBranchesList = job.eligibleBranches
    .split(',')
    .map(b => b.trim().toLowerCase());
  const meetsBranch = eligibleBranchesList.includes(profile.branch.trim().toLowerCase());

  const meetsBacklogs = job.backlogsAllowed || profile.activeBacklogs === 0;

  const isEligible = meetsCgpa && meetsBranch && meetsBacklogs;
  const hasApplied = applications.some(app => app.postingId === job.id);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!profile.resumeUrl) {
      setError('You must upload a resume in your profile page before applying.');
      return;
    }
    
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      await api.post('/api/applications', {
        studentId: profile.id,
        postingId: job.id,
        coverLetter: coverLetter,
        resumeUrl: profile.resumeUrl
      });
      setSuccess('Application submitted successfully!');
      setTimeout(() => {
        navigate('/student/applications');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit application.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '0 40px 40px 40px' }}>
      <Link to="/student/jobs" style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        textDecoration: 'none',
        color: 'var(--text-muted)',
        marginBottom: '24px',
        fontSize: '14px',
        fontWeight: '500'
      }}>
        <ChevronLeft size={16} /> Back to Job Openings
      </Link>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
        {/* Job Info Details */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h1 style={{ fontSize: '24px', fontWeight: '700' }}>{job.title}</h1>
              <span className="badge badge-approved">{job.employmentType}</span>
            </div>
            <p style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '16px' }}>{job.companyName}</p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '16px',
            borderTop: '1px solid var(--border)',
            borderBottom: '1px solid var(--border)',
            padding: '16px 0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <MapPin size={20} color="var(--text-muted)" />
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Location</div>
                <div style={{ fontSize: '14px', fontWeight: '500' }}>{job.location}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <DollarSign size={20} color="var(--text-muted)" />
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Compensation</div>
                <div style={{ fontSize: '14px', fontWeight: '500' }}>{job.ctc} LPA</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Award size={20} color="var(--text-muted)" />
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>CGPA Cutoff</div>
                <div style={{ fontSize: '14px', fontWeight: '500' }}>{job.minimumCgpa}</div>
              </div>
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '10px' }}>Job Description</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '15px' }}>{job.description}</p>
          </div>

          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '10px' }}>Eligibility Details</h3>
            <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--text-muted)', fontSize: '15px' }}>
              <li>Eligible Branches: <strong style={{ color: 'var(--text)' }}>{job.eligibleBranches}</strong></li>
              <li>Backlogs Allowed: <strong style={{ color: 'var(--text)' }}>{job.backlogsAllowed ? 'Yes' : 'No'}</strong></li>
              <li>Application Deadline: <strong style={{ color: 'var(--text)' }}>{new Date(job.deadline).toLocaleDateString()}</strong></li>
            </ul>
          </div>
        </div>

        {/* Application / Eligibility Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="glass-panel">
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px' }}>Your Eligibility</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '14px' }}>CGPA (Required: {job.minimumCgpa})</span>
                <span className={`badge ${meetsCgpa ? 'badge-approved' : 'badge-rejected'}`}>
                  {profile.cgpa} {meetsCgpa ? '✓' : '✗'}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '14px' }}>Branch (Required: {job.eligibleBranches})</span>
                <span className={`badge ${meetsBranch ? 'badge-approved' : 'badge-rejected'}`}>
                  {profile.branch} {meetsBranch ? '✓' : '✗'}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '14px' }}>Backlog Limit</span>
                <span className={`badge ${meetsBacklogs ? 'badge-approved' : 'badge-rejected'}`}>
                  {profile.activeBacklogs} backlogs {meetsBacklogs ? '✓' : '✗'}
                </span>
              </div>
            </div>

            {hasApplied ? (
              <div style={{
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                color: 'var(--success)',
                padding: '16px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                <CheckCircle2 size={18} />
                <span>You have already applied for this job.</span>
              </div>
            ) : isEligible ? (
              <div>
                <h4 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '12px' }}>Apply to Position</h4>
                
                {error && (
                  <div style={{
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    color: 'var(--danger)',
                    padding: '10px 14px',
                    borderRadius: '6px',
                    fontSize: '13px',
                    marginBottom: '14px'
                  }}>
                    {error}
                  </div>
                )}

                {success && (
                  <div style={{
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                    color: 'var(--success)',
                    padding: '10px 14px',
                    borderRadius: '6px',
                    fontSize: '13px',
                    marginBottom: '14px'
                  }}>
                    {success}
                  </div>
                )}

                <form onSubmit={handleApply}>
                  <div className="form-group">
                    <label style={{ fontSize: '13px' }}>Cover Note (Optional)</label>
                    <textarea
                      className="form-control"
                      rows="4"
                      placeholder="Explain why you are a good fit..."
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ width: '100%' }}
                    disabled={submitting}
                  >
                    {submitting ? 'Submitting...' : 'Submit Application'}
                  </button>
                </form>
              </div>
            ) : (
              <div style={{
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                color: 'var(--danger)',
                padding: '16px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                fontSize: '14px'
              }}>
                <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>You do not meet the academic eligibility criteria for this posting.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentJobDetails;
