import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { FileText, Plus, Eye, Users } from 'lucide-react';

const CompanyJobs = () => {
  const { user } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await api.get(`/api/postings/company/${user.profileId}`);
        setJobs(response.data);
      } catch (err) {
        console.error('Error fetching company jobs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [user.profileId]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}>
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="portal-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: '700' }}>Job Openings</h1>
        <Link to="/company/post-job" className="btn btn-primary">
          <Plus size={18} /> Post New Job
        </Link>
      </div>

      {jobs.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '48px' }}>
          <FileText size={48} color="var(--text-muted)" style={{ marginBottom: '16px' }} />
          <p style={{ color: 'var(--text-muted)' }}>You have not posted any job openings yet.</p>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Location</th>
                <th>Package (CTC)</th>
                <th>Status</th>
                <th>Deadline</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id}>
                  <td>
                    <div style={{ fontWeight: '600' }}>{job.title}</div>
                    {job.status === 'REJECTED' && (
                      <div style={{ fontSize: '12px', color: 'var(--danger)', marginTop: '4px' }}>
                        Rejection Reason: "{job.rejectionReason}"
                      </div>
                    )}
                  </td>
                  <td>{job.location}</td>
                  <td>{job.ctc} LPA</td>
                  <td>
                    <span className={`badge badge-${job.status.toLowerCase()}`}>
                      {job.status}
                    </span>
                  </td>
                  <td>{new Date(job.deadline).toLocaleDateString()}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {job.status === 'APPROVED' && (
                        <Link 
                          to={`/company/jobs/${job.id}/applicants`} 
                          className="btn btn-outline" 
                          style={{ padding: '6px 12px', fontSize: '13px' }}
                        >
                          <Users size={14} /> Applicants
                        </Link>
                      )}
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
                        {job.status !== 'APPROVED' && 'Awaiting Approval'}
                      </span>
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

export default CompanyJobs;
