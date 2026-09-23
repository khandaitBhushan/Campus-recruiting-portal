import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api, { API_BASE_URL } from '../../services/api';
import { ArrowLeft, User, Download, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const CompanyApplicants = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchApplicants = async () => {
    try {
      const [jobRes, appsRes] = await Promise.all([
        api.get(`/api/postings/${id}`),
        api.get(`/api/applications/posting/${id}`)
      ]);
      setJob(jobRes.data);
      setApplicants(appsRes.data);
    } catch (err) {
      console.error('Error fetching applicants:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, [id]);

  const handleUpdateStatus = async (appId, newStatus) => {
    setUpdatingId(appId);
    try {
      await api.patch(`/api/applications/${appId}/status`, { status: newStatus });
      // Reload applicant data
      await fetchApplicants();
    } catch (err) {
      console.error('Error updating status:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}>
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div style={{ padding: '0 40px 40px 40px' }}>
      <Link to="/company/jobs" style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        textDecoration: 'none',
        color: 'var(--text-muted)',
        marginBottom: '24px',
        fontSize: '14px',
        fontWeight: '500'
      }}>
        <ArrowLeft size={16} /> Back to Job Openings
      </Link>

      <div className="glass-panel" style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '6px' }}>
          Applicants for: {job?.title}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
          Package: {job?.ctc} LPA | Cutoff: {job?.minimumCgpa} CGPA | Eligible: {job?.eligibleBranches}
        </p>
      </div>

      {applicants.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '48px' }}>
          <User size={48} color="var(--text-muted)" style={{ marginBottom: '16px' }} />
          <p style={{ color: 'var(--text-muted)' }}>No student has applied for this opening yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {applicants.map((app) => (
            <div key={app.id} className="glass-panel" style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr',
              gap: '24px',
              alignItems: 'flex-start'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '700' }}>{app.studentName}</h3>
                  <span className={`badge badge-${app.status.toLowerCase()}`}>
                    {app.status}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px 16px', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                  <span>Email: <strong style={{ color: 'var(--text)' }}>{app.studentEmail}</strong></span>
                  <span>Dept: <strong style={{ color: 'var(--text)' }}>{app.studentDept}</strong></span>
                  <span>Branch: <strong style={{ color: 'var(--text)' }}>{app.studentBranch}</strong></span>
                  <span>CGPA: <strong style={{ color: 'var(--text)' }}>{app.studentCgpa}</strong></span>
                  <span>Backlogs: <strong style={{ color: 'var(--text)' }}>{app.studentBacklogs}</strong></span>
                  <span>Grad Year: <strong style={{ color: 'var(--text)' }}>{app.studentGradYear}</strong></span>
                </div>

                {app.coverLetter && (
                  <div style={{
                    backgroundColor: 'rgba(var(--primary-rgb), 0.02)',
                    borderLeft: '3px solid var(--primary)',
                    padding: '10px 14px',
                    borderRadius: '0 8px 8px 0',
                    fontSize: '14px',
                    color: 'var(--text-muted)',
                    marginBottom: '16px'
                  }}>
                    <strong>Cover Note:</strong> "{app.coverLetter}"
                  </div>
                )}

                {app.resumeUrl && (
                  <a 
                    href={`${API_BASE_URL}${app.resumeUrl}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn btn-outline"
                    style={{ padding: '8px 16px', fontSize: '13px', display: 'inline-flex' }}
                  >
                    <Download size={14} /> Download Student Resume
                  </a>
                )}
              </div>

              {/* Action Buttons */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                borderLeft: '1px solid var(--border)',
                paddingLeft: '24px',
                height: '100%',
                justifyContent: 'center'
              }}>
                <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  Change Candidate Status
                </div>
                
                {updatingId === app.id ? (
                  <span style={{ fontSize: '14px', color: 'var(--primary)' }}>Updating...</span>
                ) : (
                  <>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {app.status === 'APPLIED' && (
                        <button 
                          onClick={() => handleUpdateStatus(app.id, 'SHORTLISTED')}
                          className="btn btn-primary"
                          style={{ padding: '8px 12px', fontSize: '12px', flex: 1 }}
                        >
                          Shortlist
                        </button>
                      )}

                      {app.status === 'SHORTLISTED' && (
                        <button 
                          onClick={() => handleUpdateStatus(app.id, 'INTERVIEW')}
                          className="btn btn-primary"
                          style={{ padding: '8px 12px', fontSize: '12px', flex: 1, backgroundColor: 'var(--warning)' }}
                        >
                          Schedule Interview
                        </button>
                      )}

                      {app.status === 'INTERVIEW' && (
                        <button 
                          onClick={() => handleUpdateStatus(app.id, 'SELECTED')}
                          className="btn btn-primary"
                          style={{ padding: '8px 12px', fontSize: '12px', flex: 1, backgroundColor: 'var(--success)' }}
                        >
                          Select
                        </button>
                      )}

                      {app.status !== 'SELECTED' && app.status !== 'REJECTED' && (
                        <button 
                          onClick={() => handleUpdateStatus(app.id, 'REJECTED')}
                          className="btn btn-danger"
                          style={{ padding: '8px 12px', fontSize: '12px' }}
                        >
                          Reject
                        </button>
                      )}
                    </div>
                    {(app.status === 'SELECTED' || app.status === 'REJECTED') && (
                      <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                        Process completed. Status is locked.
                      </span>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompanyApplicants;
