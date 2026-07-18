import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Users, Building, ShieldAlert, Award, FileSpreadsheet, Download } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/api/admin/analytics');
        setStats(response.data);
      } catch (err) {
        console.error('Error fetching admin analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}>
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div style={{ padding: '0 40px 40px 40px' }}>
      {/* Header */}
      <div className="glass-panel" style={{
        background: 'linear-gradient(135deg, rgba(30, 144, 255, 0.1), rgba(30, 144, 255, 0.02))',
        marginBottom: '32px'
      }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>
          Placement Cell Admin Dashboard 🏛️
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Manage company accounts, review pending job listings, oversee student eligibility, and generate reports.
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
            <Building size={24} color="var(--primary)" />
          </div>
          <div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Companies</div>
            <div style={{ fontSize: '20px', fontWeight: '700', marginTop: '4px' }}>{stats?.companies}</div>
          </div>
        </div>

        <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(100, 116, 139, 0.1)' }}>
            <Users size={24} color="var(--text-muted)" />
          </div>
          <div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Registered Students</div>
            <div style={{ fontSize: '20px', fontWeight: '700', marginTop: '4px' }}>{stats?.students}</div>
          </div>
        </div>

        <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.1)' }}>
            <ShieldAlert size={24} color="var(--warning)" />
          </div>
          <div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Pending Postings</div>
            <div style={{ fontSize: '20px', fontWeight: '700', marginTop: '4px' }}>{stats?.pendingPostings}</div>
          </div>
        </div>

        <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)' }}>
            <Award size={24} color="var(--success)" />
          </div>
          <div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Placement Rate</div>
            <div style={{ fontSize: '20px', fontWeight: '700', marginTop: '4px', color: 'var(--success)' }}>
              {stats?.placementRate}%
            </div>
          </div>
        </div>
      </div>

      {/* Main Admin Quick Links Board */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
        <div className="glass-panel">
          <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px' }}>Admin Task Center</h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px'
          }}>
            <Link to="/admin/companies" className="glass-panel" style={{
              textDecoration: 'none',
              color: 'var(--text)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              padding: '20px',
              border: '1px solid var(--border)',
            }}>
              <Building size={24} color="var(--primary)" />
              <strong style={{ fontSize: '15px' }}>Verify Company Registrations</strong>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Approve visiting organizations to publish jobs.</span>
            </Link>

            <Link to="/admin/jobs/pending" className="glass-panel" style={{
              textDecoration: 'none',
              color: 'var(--text)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              padding: '20px',
              border: '1px solid var(--border)'
            }}>
              <ShieldAlert size={24} color="var(--warning)" />
              <strong style={{ fontSize: '15px' }}>Review Pending Postings</strong>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Audit descriptions and package eligibility.</span>
            </Link>

            <Link to="/admin/analytics" className="glass-panel" style={{
              textDecoration: 'none',
              color: 'var(--text)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              padding: '20px',
              border: '1px solid var(--border)'
            }}>
              <Award size={24} color="var(--success)" />
              <strong style={{ fontSize: '15px' }}>Placement Analytics</strong>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>View branch success levels and metrics.</span>
            </Link>

            <Link to="/admin/students" className="glass-panel" style={{
              textDecoration: 'none',
              color: 'var(--text)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              padding: '20px',
              border: '1px solid var(--border)'
            }}>
              <Users size={24} color="var(--text-muted)" />
              <strong style={{ fontSize: '15px' }}>Manage Student Records</strong>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Import student lists or update placement states.</span>
            </Link>
          </div>
        </div>

        {/* Generate Report Card */}
        <div className="glass-panel" style={{ height: 'fit-content' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px' }}>Export Portal Data</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px', lineHeight: '1.5' }}>
            Download the official placement statistics PDF generated dynamically by the backend reporting engine.
          </p>
          <a 
            href="http://localhost:8080/api/admin/reports/placement-pdf" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn btn-primary" 
            style={{ width: '100%', display: 'flex', gap: '8px' }}
          >
            <Download size={18} /> Export Statistics PDF
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
