import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { Building, Upload, AlertCircle, CheckCircle, FileSpreadsheet, Send, FileCheck } from 'lucide-react';

const CompanyDashboard = () => {
  const { user } = useContext(AuthContext);
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [applications, setApplications] = useState([]);

  // Logo upload state
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchDashboardData = async () => {
    try {
      const companyRes = await api.get(`/api/companies/${user.profileId}`);
      setCompany(companyRes.data);
      
      if (companyRes.data.status === 'APPROVED') {
        const jobsRes = await api.get(`/api/postings/company/${user.profileId}`);
        setJobs(jobsRes.data);

        // Fetch applicants for each job posting in parallel
        const applicantsPromises = jobsRes.data.map(job => 
          api.get(`/api/applications/posting/${job.id}`).catch(() => ({ data: [] }))
        );
        const applicantsResponses = await Promise.all(applicantsPromises);
        const allApplicants = applicantsResponses.flatMap(res => res.data);

        // Sort by applied date descending
        allApplicants.sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));
        setApplications(allApplicants);
      }
    } catch (err) {
      console.error('Error loading company dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user.profileId]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleLogoUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    setUploading(true);
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      // 1. Upload file
      const fileRes = await api.post('/api/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const logoUrl = fileRes.data.url;

      // 2. Update company logo endpoint
      const companyRes = await api.patch(`/api/companies/${user.profileId}/logo?logoUrl=${encodeURIComponent(logoUrl)}`);
      setCompany(companyRes.data);
      setSuccess('Company logo uploaded successfully!');
      setSelectedFile(null);
    } catch (err) {
      setError('Failed to upload logo image.');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}>
        <div className="loader"></div>
      </div>
    );
  }

  const isApproved = company?.status === 'APPROVED';

  // Calculate metrics
  const activePostings = jobs.filter(j => j.status === 'APPROVED').length;
  const pendingPostings = jobs.filter(j => j.status === 'PENDING').length;

  return (
    <div style={{ padding: '0 40px 40px 40px' }}>
      {/* Status Warning Panel for non-approved companies */}
      {!isApproved && (
        <div className="glass-panel" style={{
          background: company?.status === 'REJECTED' 
            ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(239, 68, 68, 0.02))'
            : 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(245, 158, 11, 0.02))',
          borderLeft: `5px solid ${company?.status === 'REJECTED' ? 'var(--danger)' : 'var(--warning)'}`,
          marginBottom: '32px'
        }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <AlertCircle size={28} color={company?.status === 'REJECTED' ? 'var(--danger)' : 'var(--warning)'} style={{ flexShrink: 0 }} />
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '6px' }}>
                Account Review Status: {company?.status}
              </h2>
              {company?.status === 'PENDING' && (
                <p style={{ color: 'var(--text-muted)' }}>
                  Your recruiter registration has been submitted and is currently pending review by the placement cell administrators. You will be able to post job openings and review candidates once approved.
                </p>
              )}
              {company?.status === 'REJECTED' && (
                <div>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '8px' }}>
                    Your registration was rejected by the administration.
                  </p>
                  <p style={{ color: 'var(--danger)', fontWeight: '600' }}>
                    Reason: "{company?.rejectionReason}"
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Info Columns */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px' }}>
        {/* Company Card / Logo Upload */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="glass-panel" style={{ textAlign: 'center' }}>
            {company?.logoUrl ? (
              <img 
                src={`http://localhost:8080${company.logoUrl}`} 
                alt={`${company.name} Logo`}
                style={{
                  width: '90px',
                  height: '90px',
                  borderRadius: '12px',
                  objectFit: 'contain',
                  border: '1px solid var(--border)',
                  padding: '8px',
                  backgroundColor: 'white',
                  margin: '0 auto 16px auto',
                  display: 'block'
                }}
              />
            ) : (
              <div style={{
                width: '90px',
                height: '90px',
                borderRadius: '12px',
                backgroundColor: 'rgba(var(--primary-rgb), 0.05)',
                border: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto',
                color: 'var(--primary)'
              }}>
                <Building size={40} />
              </div>
            )}
            <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '4px' }}>{company?.name}</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '16px' }}>{company?.industry} Industry</p>
            <span className={`badge badge-${company?.status.toLowerCase()}`}>
              {company?.status}
            </span>
          </div>

          {/* Logo Uploader */}
          <div className="glass-panel">
            <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>Upload Company Logo</h3>
            
            {error && <div style={{ color: 'var(--danger)', fontSize: '13px', marginBottom: '12px' }}>{error}</div>}
            {success && <div style={{ color: 'var(--success)', fontSize: '13px', marginBottom: '12px' }}>{success}</div>}

            <form onSubmit={handleLogoUpload}>
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <div style={{
                  border: '2px dashed var(--border)',
                  borderRadius: '8px',
                  padding: '12px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  position: 'relative'
                }}>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileChange}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      opacity: 0,
                      cursor: 'pointer'
                    }}
                  />
                  <Upload size={18} color="var(--text-muted)" style={{ margin: '0 auto 6px auto', display: 'block' }} />
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    {selectedFile ? selectedFile.name : 'Select logo image file'}
                  </span>
                </div>
              </div>
              <button 
                type="submit" 
                className="btn btn-outline" 
                style={{ width: '100%', padding: '10px' }}
                disabled={uploading || !selectedFile}
              >
                {uploading ? 'Uploading...' : 'Save Logo'}
              </button>
            </form>
          </div>
        </div>

        {/* Dashboard Actions and Job Stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {isApproved ? (
            <>
              {/* Metrics Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)' }}>
                    <FileCheck size={24} color="var(--success)" />
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Active Postings</div>
                    <div style={{ fontSize: '20px', fontWeight: '700', marginTop: '4px' }}>{activePostings}</div>
                  </div>
                </div>

                <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.1)' }}>
                    <Send size={24} color="var(--warning)" />
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Pending Approvals</div>
                    <div style={{ fontSize: '20px', fontWeight: '700', marginTop: '4px' }}>{pendingPostings}</div>
                  </div>
                </div>
              </div>

              {/* Action Board */}
              <div className="glass-panel">
                <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px' }}>Recruiter Actions</h3>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <Link to="/company/post-job" className="btn btn-primary" style={{ flex: 1 }}>
                    Post a New Job
                  </Link>
                  <Link to="/company/jobs" className="btn btn-outline" style={{ flex: 1 }}>
                    Manage Job Openings
                  </Link>
                </div>
              </div>

              {/* Recent Applications */}
              <div className="glass-panel" style={{ marginTop: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '700' }}>Recent Candidate Applications</h3>
                  <Link to="/company/jobs" style={{
                    fontSize: '14px',
                    color: 'var(--primary)',
                    textDecoration: 'none',
                    fontWeight: '600'
                  }}>
                    Manage Applicants via Jobs
                  </Link>
                </div>

                {applications.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', fontSize: '14px', textAlign: 'center', padding: '16px' }}>
                    No student has applied for your postings yet.
                  </p>
                ) : (
                  <div className="table-container">
                    <table>
                      <thead>
                        <tr>
                          <th>Student Name</th>
                          <th>Applied Role</th>
                          <th>CGPA</th>
                          <th>Date Applied</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {applications.slice(0, 5).map((app) => (
                          <tr key={app.id}>
                            <td style={{ fontWeight: '600' }}>{app.studentName}</td>
                            <td>{app.postingTitle}</td>
                            <td>{app.studentCgpa}</td>
                            <td>{new Date(app.appliedAt).toLocaleDateString()}</td>
                            <td>
                              <span className={`badge badge-${app.status.toLowerCase()}`}>
                                {app.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="glass-panel" style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '60px 40px',
              textAlign: 'center',
              height: '100%',
              color: 'var(--text-muted)'
            }}>
              <Building size={48} style={{ marginBottom: '16px' }} />
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text)', marginBottom: '8px' }}>
                Awaiting Approval
              </h3>
              <p style={{ maxWidth: '400px', fontSize: '14px' }}>
                Your administrative review is currently pending. Features such as job posting, analytics, and applicant review will unlock once approved.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;
