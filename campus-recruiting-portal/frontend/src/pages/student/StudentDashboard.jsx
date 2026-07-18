import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { GraduationCap, Briefcase, FileCheck, CheckCircle2, ChevronRight } from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, appsRes] = await Promise.all([
          api.get(`/api/students/${user.profileId}`),
          api.get(`/api/applications/student/${user.profileId}`)
        ]);
        setProfile(profileRes.data);
        setApplications(appsRes.data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user.profileId]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}>
        <div className="loader"></div>
      </div>
    );
  }

  const activeApplications = applications.filter(
    app => app.status !== 'SELECTED' && app.status !== 'REJECTED' && app.status !== 'WITHDRAWN'
  ).length;

  const placementStatus = profile?.placed ? 'Placed' : 'Not Placed';

  return (
    <div style={{ padding: '0 40px 40px 40px' }}>
      {/* Welcome Section */}
      <div className="glass-panel" style={{
        background: 'linear-gradient(135deg, rgba(30, 144, 255, 0.1), rgba(30, 144, 255, 0.02))',
        marginBottom: '32px'
      }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>
          Hello, {profile?.name}! 👋
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Welcome to your Placement Dashboard. You can browse active job postings, check eligibility, apply, and monitor application states in real-time.
        </p>
      </div>

      {/* Metrics Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '24px',
        marginBottom: '32px'
      }}>
        <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(30, 144, 255, 0.1)' }}>
            <GraduationCap size={24} color="var(--primary)" />
          </div>
          <div>
            <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Academic CGPA</div>
            <div style={{ fontSize: '20px', fontWeight: '700', marginTop: '4px' }}>{profile?.cgpa}</div>
          </div>
        </div>

        <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)' }}>
            <CheckCircle2 size={24} color="var(--success)" />
          </div>
          <div>
            <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Placement Status</div>
            <div style={{
              fontSize: '20px',
              fontWeight: '700',
              marginTop: '4px',
              color: profile?.placed ? 'var(--success)' : 'var(--text)'
            }}>
              {placementStatus}
            </div>
          </div>
        </div>

        <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.1)' }}>
            <Briefcase size={24} color="var(--warning)" />
          </div>
          <div>
            <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Active Applications</div>
            <div style={{ fontSize: '20px', fontWeight: '700', marginTop: '4px' }}>{activeApplications}</div>
          </div>
        </div>

        <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(100, 116, 139, 0.1)' }}>
            <FileCheck size={24} color="var(--text-muted)" />
          </div>
          <div>
            <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Total Applied</div>
            <div style={{ fontSize: '20px', fontWeight: '700', marginTop: '4px' }}>{applications.length}</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
        {/* Recent Applications */}
        <div className="glass-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700' }}>Recent Applications</h3>
            <Link to="/student/applications" style={{
              fontSize: '14px',
              color: 'var(--primary)',
              textDecoration: 'none',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              View All <ChevronRight size={16} />
            </Link>
          </div>

          {applications.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '24px' }}>
              You haven't submitted any job applications yet.
            </p>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Job Title</th>
                    <th>Company</th>
                    <th>Date Applied</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.slice(0, 4).map((app) => (
                    <tr key={app.id}>
                      <td style={{ fontWeight: '500' }}>{app.postingTitle}</td>
                      <td>{app.companyName}</td>
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

        {/* Quick Actions */}
        <div className="glass-panel" style={{ height: 'fit-content' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px' }}>Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Link to="/student/jobs" className="btn btn-primary" style={{ width: '100%' }}>
              Browse Job Postings
            </Link>
            <Link to="/student/profile" className="btn btn-outline" style={{ width: '100%' }}>
              Update Profile & Resume
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
