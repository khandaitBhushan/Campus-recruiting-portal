import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Briefcase, Check, X, ShieldAlert, AlertCircle } from 'lucide-react';

const AdminPendingJobs = () => {
  const [postings, setPostings] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Rejection state
  const [rejectingId, setRejectingId] = useState(null);
  const [reason, setReason] = useState('');
  const [actionId, setActionId] = useState(null);

  const fetchPendingPostings = async () => {
    try {
      const response = await api.get('/api/postings/pending');
      setPostings(response.data);
    } catch (err) {
      console.error('Error fetching pending postings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingPostings();
  }, []);

  const handleReviewPosting = async (postingId, newStatus, rejectReason = '') => {
    setActionId(postingId);
    try {
      await api.patch(`/api/postings/${postingId}/review`, {
        status: newStatus,
        rejectionReason: rejectReason
      });
      setRejectingId(null);
      setReason('');
      await fetchPendingPostings();
    } catch (err) {
      console.error('Error reviewing job posting:', err);
    } finally {
      setActionId(null);
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
    <div className="portal-container">
      <h1 style={{ fontSize: '26px', fontWeight: '700', marginBottom: '24px' }}>Pending Job Postings</h1>

      {/* Reject Reason input dialog overlay */}
      {rejectingId && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 10000,
          padding: '16px'
        }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '420px', backgroundColor: 'var(--bg)' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '12px' }}>Enter Rejection Reason</h3>
            <textarea
              className="form-control"
              rows="3"
              placeholder="State why this job listing is not approved..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              style={{ marginBottom: '16px' }}
              required
            />
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button onClick={() => setRejectingId(null)} className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '13px' }}>
                Cancel
              </button>
              <button 
                onClick={() => handleReviewPosting(rejectingId, 'REJECTED', reason)} 
                className="btn btn-danger" 
                style={{ padding: '8px 16px', fontSize: '13px' }}
                disabled={!reason.trim()}
              >
                Submit Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {postings.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '48px' }}>
          <ShieldAlert size={48} color="var(--text-muted)" style={{ marginBottom: '16px' }} />
          <p style={{ color: 'var(--text-muted)' }}>There are no job postings awaiting approval.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {postings.map((p) => (
            <div key={p.id} className="glass-panel split-card-row">
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '4px' }}>{p.title}</h3>
                <p style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '14px', marginBottom: '12px' }}>
                  {p.companyName}
                </p>
                <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', fontSize: '13px', color: 'var(--text-muted)' }}>
                  <span>Location: <strong>{p.location}</strong></span>
                  <span>Package: <strong>{p.ctc} LPA</strong></span>
                  <span>Cutoff: <strong>{p.minimumCgpa} CGPA</strong></span>
                  <span>Branches: <strong>{p.eligibleBranches}</strong></span>
                </div>
                <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '12px', lineHeight: '1.5' }}>
                  {p.description}
                </div>
              </div>

              <div className="split-card-actions">
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  Deadline: {new Date(p.deadline).toLocaleDateString()}
                </span>
                {actionId === p.id ? (
                  <span style={{ fontSize: '14px', color: 'var(--primary)' }}>Updating...</span>
                ) : (
                  <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                    <button 
                      onClick={() => handleReviewPosting(p.id, 'APPROVED')}
                      className="btn btn-primary"
                      style={{ padding: '8px 16px', fontSize: '13px', background: 'var(--success)', flex: 1 }}
                    >
                      <Check size={14} /> Approve
                    </button>
                    <button 
                      onClick={() => setRejectingId(p.id)}
                      className="btn btn-danger"
                      style={{ padding: '8px 16px', fontSize: '13px' }}
                    >
                      <X size={14} /> Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPendingJobs;
