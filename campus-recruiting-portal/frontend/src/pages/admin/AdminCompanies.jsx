import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Building, Check, X, Ban, MessageSquare } from 'lucide-react';

const AdminCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Reject reason dialog state
  const [rejectingId, setRejectingId] = useState(null);
  const [reason, setReason] = useState('');
  const [actionId, setActionId] = useState(null);

  const fetchCompanies = async () => {
    try {
      const response = await api.get('/api/companies');
      setCompanies(response.data);
    } catch (err) {
      console.error('Error fetching companies list:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleReviewCompany = async (companyId, newStatus, rejectReason = '') => {
    setActionId(companyId);
    try {
      await api.patch(`/api/companies/${companyId}/review`, {
        status: newStatus,
        rejectionReason: rejectReason
      });
      setRejectingId(null);
      setReason('');
      await fetchCompanies();
    } catch (err) {
      console.error('Error reviewing company:', err);
    } finally {
      setActionId(null);
    }
  };

  const handleDeactivateCompany = async (companyId) => {
    setActionId(companyId);
    try {
      await api.patch(`/api/companies/${companyId}/deactivate`);
      await fetchCompanies();
    } catch (err) {
      console.error('Error deactivating company:', err);
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
    <div style={{ padding: '0 40px 40px 40px' }}>
      <h1 style={{ fontSize: '26px', fontWeight: '700', marginBottom: '24px' }}>Visiting Companies</h1>

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
          zIndex: 10000
        }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', backgroundColor: 'var(--bg)' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '12px' }}>Enter Rejection Reason</h3>
            <textarea
              className="form-control"
              rows="3"
              placeholder="Provide a clear reason for the company recruiter..."
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
                onClick={() => handleReviewCompany(rejectingId, 'REJECTED', reason)} 
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

      {companies.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '48px' }}>
          <Building size={48} color="var(--text-muted)" style={{ marginBottom: '16px' }} />
          <p style={{ color: 'var(--text-muted)' }}>No companies have registered in the portal yet.</p>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Logo</th>
                <th>Company Name</th>
                <th>Industry</th>
                <th>Recruiter Email</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((c) => (
                <tr key={c.id}>
                  <td>
                    {c.logoUrl ? (
                      <img 
                        src={`http://localhost:8080${c.logoUrl}`} 
                        alt="Logo"
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '6px',
                          objectFit: 'contain',
                          border: '1px solid var(--border)',
                          backgroundColor: 'white',
                          padding: '2px'
                        }}
                      />
                    ) : (
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '6px',
                        backgroundColor: 'rgba(var(--primary-rgb), 0.05)',
                        border: '1px solid var(--border)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--primary)'
                      }}>
                        <Building size={18} />
                      </div>
                    )}
                  </td>
                  <td>
                    <div style={{ fontWeight: '600' }}>{c.name}</div>
                    {c.status === 'REJECTED' && (
                      <div style={{ fontSize: '12px', color: 'var(--danger)', marginTop: '4px' }}>
                        Reason: "{c.rejectionReason}"
                      </div>
                    )}
                  </td>
                  <td>{c.industry}</td>
                  <td>{c.recruiterEmail}</td>
                  <td>
                    <span className={`badge badge-${c.status.toLowerCase()}`}>
                      {c.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {actionId === c.id ? (
                        <span style={{ fontSize: '13px', color: 'var(--primary)' }}>Saving...</span>
                      ) : c.status === 'PENDING' ? (
                        <>
                          <button
                            onClick={() => handleReviewCompany(c.id, 'APPROVED')}
                            className="btn btn-primary"
                            style={{ padding: '6px 12px', fontSize: '12px', background: 'var(--success)' }}
                          >
                            <Check size={14} /> Approve
                          </button>
                          <button
                            onClick={() => setRejectingId(c.id)}
                            className="btn btn-danger"
                            style={{ padding: '6px 12px', fontSize: '12px' }}
                          >
                            <X size={14} /> Reject
                          </button>
                        </>
                      ) : c.status === 'APPROVED' ? (
                        <button
                          onClick={() => handleDeactivateCompany(c.id)}
                          className="btn btn-outline"
                          style={{ padding: '6px 12px', fontSize: '12px', color: 'var(--danger)' }}
                        >
                          <Ban size={14} /> Deactivate
                        </button>
                      ) : (
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic' }}>No Actions</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminCompanies;
