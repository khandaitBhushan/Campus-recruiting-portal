import React, { useState, useEffect, useContext } from 'react';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { FileText, Download, Calendar, ExternalLink } from 'lucide-react';

const StudentApplications = () => {
  const { user } = useContext(AuthContext);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await api.get(`/api/applications/student/${user.profileId}`);
        setApplications(response.data);
      } catch (err) {
        console.error('Error fetching applications:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, [user.profileId]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}>
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div style={{ padding: '0 40px 40px 40px' }}>
      <h1 style={{ fontSize: '26px', fontWeight: '700', marginBottom: '24px' }}>My Applications</h1>

      {applications.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '48px' }}>
          <FileText size={48} color="var(--text-muted)" style={{ marginBottom: '16px' }} />
          <p style={{ color: 'var(--text-muted)' }}>You have not applied for any placement positions yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {applications.map((app) => (
            <div key={app.id} className="glass-panel" style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto',
              alignItems: 'center',
              gap: '24px'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '700' }}>{app.postingTitle}</h3>
                  <span className={`badge badge-${app.status.toLowerCase()}`}>
                    {app.status}
                  </span>
                </div>
                <p style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '14px', marginBottom: '12px' }}>
                  {app.companyName}
                </p>

                {app.coverLetter && (
                  <div style={{
                    backgroundColor: 'rgba(var(--primary-rgb), 0.02)',
                    borderLeft: '3px solid var(--primary)',
                    padding: '8px 12px',
                    borderRadius: '0 8px 8px 0',
                    fontSize: '14px',
                    color: 'var(--text-muted)',
                    marginBottom: '12px'
                  }}>
                    <strong>Cover Note:</strong> "{app.coverLetter}"
                  </div>
                )}

                <div style={{ display: 'flex', gap: '20px', fontSize: '13px', color: 'var(--text-muted)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={14} /> Applied on: {new Date(app.appliedAt).toLocaleDateString()}
                  </span>
                  {app.resumeUrl && (
                    <a 
                      href={`http://localhost:8080${app.resumeUrl}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        color: 'var(--primary)',
                        textDecoration: 'none',
                        fontWeight: '500'
                      }}
                    >
                      <Download size={14} /> Download Submitted Resume
                    </a>
                  )}
                </div>
              </div>

              <div>
                <span className={`badge badge-${app.status.toLowerCase()}`} style={{
                  padding: '8px 16px',
                  fontSize: '13px'
                }}>
                  Status: {app.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentApplications;
