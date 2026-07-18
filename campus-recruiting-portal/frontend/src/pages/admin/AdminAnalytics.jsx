import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { PieChart, BarChart2, TrendingUp, HelpCircle } from 'lucide-react';

const AdminAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await api.get('/api/admin/analytics');
        setData(response.data);
      } catch (err) {
        console.error('Error fetching analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}>
        <div className="loader"></div>
      </div>
    );
  }

  // Find maximum values for relative scale calculations in charts
  const maxCompanyApps = data?.applicationsPerCompany?.length > 0
    ? Math.max(...data.applicationsPerCompany.map(c => c.applications), 1)
    : 1;

  const maxBranchStudents = data?.branchPlacementStats?.length > 0
    ? Math.max(...data.branchPlacementStats.map(b => b.students), 1)
    : 1;

  return (
    <div style={{ padding: '0 40px 40px 40px' }}>
      <h1 style={{ fontSize: '26px', fontWeight: '700', marginBottom: '24px' }}>Placement Statistics & Analytics</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '32px' }}>
        {/* Branch Placement Rates */}
        <div className="glass-panel">
          <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={20} color="var(--primary)" /> Branch Placement Rates
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {data?.branchPlacementStats?.map((item) => {
              const rate = item.students > 0 ? Math.round((item.placed / item.students) * 100) : 0;
              return (
                <div key={item.branch}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px' }}>
                    <span style={{ fontWeight: '600' }}>{item.branch}</span>
                    <span style={{ color: 'var(--text-muted)' }}>
                      {item.placed} Placed / {item.students} Total ({rate}%)
                    </span>
                  </div>
                  {/* CSS Bar Chart */}
                  <div style={{
                    width: '100%',
                    height: '14px',
                    borderRadius: '999px',
                    backgroundColor: 'var(--border)',
                    overflow: 'hidden',
                    position: 'relative'
                  }}>
                    <div style={{
                      width: `${rate}%`,
                      height: '100%',
                      backgroundColor: 'var(--primary)',
                      borderRadius: '999px',
                      transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)'
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CGPA Band Placements */}
        <div className="glass-panel">
          <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart2 size={20} color="var(--success)" /> Placement Success by CGPA Band
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {data?.cgpaBandPlacementStats?.map((item) => {
              const rate = item.students > 0 ? Math.round((item.placed / item.students) * 100) : 0;
              return (
                <div key={item.band}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px' }}>
                    <span style={{ fontWeight: '600' }}>{item.band} CGPA</span>
                    <span style={{ color: 'var(--text-muted)' }}>
                      {item.placed} Placed / {item.students} Total ({rate}%)
                    </span>
                  </div>
                  {/* CSS Bar Chart */}
                  <div style={{
                    width: '100%',
                    height: '14px',
                    borderRadius: '999px',
                    backgroundColor: 'var(--border)',
                    overflow: 'hidden',
                    position: 'relative'
                  }}>
                    <div style={{
                      width: `${rate}%`,
                      height: '100%',
                      backgroundColor: 'var(--success)',
                      borderRadius: '999px',
                      transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)'
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Applications Per Company */}
      <div className="glass-panel" style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <PieChart size={20} color="var(--warning)" /> Job Application Volumes per Company
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {data?.applicationsPerCompany?.map((company) => {
            const percentage = Math.round((company.applications / maxCompanyApps) * 100);
            return (
              <div key={company.companyId} style={{ display: 'grid', gridTemplateColumns: '150px 1fr 60px', alignItems: 'center', gap: '16px' }}>
                <span style={{ fontSize: '14px', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {company.companyName}
                </span>
                
                {/* Horizontal Scale Bar */}
                <div style={{
                  height: '24px',
                  borderRadius: '6px',
                  backgroundColor: 'var(--border)',
                  overflow: 'hidden',
                  width: '100%',
                  position: 'relative'
                }}>
                  <div style={{
                    width: `${percentage || 2}%`, // min 2% width for visual indicators
                    height: '100%',
                    background: 'linear-gradient(90deg, var(--primary), #00c6ff)',
                    borderRadius: '6px',
                    transition: 'width 1s ease-out'
                  }} />
                </div>

                <span style={{ fontSize: '14px', fontWeight: '700', textAlign: 'right' }}>
                  {company.applications} apps
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
