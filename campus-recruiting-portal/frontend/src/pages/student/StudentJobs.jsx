import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Search, MapPin, DollarSign, Award, ArrowRight } from 'lucide-react';

const StudentJobs = () => {
  const [postings, setPostings] = useState([]);
  const [filteredPostings, setFilteredPostings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [minCtc, setMinCtc] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');

  useEffect(() => {
    const fetchPostings = async () => {
      try {
        const response = await api.get('/api/postings/student');
        setPostings(response.data);
        setFilteredPostings(response.data);
      } catch (err) {
        console.error('Error fetching job postings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPostings();
  }, []);

  useEffect(() => {
    let result = postings;

    if (searchTerm) {
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.companyName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (minCtc) {
      result = result.filter((p) => p.ctc >= parseFloat(minCtc));
    }

    if (selectedBranch) {
      result = result.filter((p) => {
        const branches = p.eligibleBranches.split(',').map((b) => b.trim().toLowerCase());
        return branches.includes(selectedBranch.toLowerCase());
      });
    }

    setFilteredPostings(result);
  }, [searchTerm, minCtc, selectedBranch, postings]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}>
        <div className="loader"></div>
      </div>
    );
  }

  // Get unique branch values from postings for filter dropdown
  const allBranches = Array.from(
    new Set(
      postings
        .flatMap((p) => p.eligibleBranches.split(','))
        .map((b) => b.trim())
        .filter((b) => b !== '')
    )
  );

  return (
    <div style={{ padding: '0 40px 40px 40px' }}>
      <h1 style={{ fontSize: '26px', fontWeight: '700', marginBottom: '24px' }}>Browse Approved Jobs</h1>

      {/* Filter controls */}
      <div className="glass-panel" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '32px'
      }}>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label>Search Role or Company</label>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)'
            }} />
            <input
              type="text"
              className="form-control"
              style={{ paddingLeft: '38px' }}
              placeholder="e.g. Data Analyst"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label>Minimum CTC (LPA)</label>
          <input
            type="number"
            className="form-control"
            placeholder="e.g. 8"
            value={minCtc}
            onChange={(e) => setMinCtc(e.target.value)}
          />
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label>Eligible Branch</label>
          <select
            className="form-control"
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
          >
            <option value="">All Branches</option>
            {allBranches.map((br) => (
              <option key={br} value={br}>{br}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Job Card Grid */}
      {filteredPostings.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '48px' }}>
          <p style={{ color: 'var(--text-muted)' }}>No job postings found matching the filter criteria.</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '24px'
        }}>
          {filteredPostings.map((p) => (
            <div key={p.id} className="glass-panel" style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: '100%',
              padding: '24px'
            }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '4px' }}>{p.title}</h3>
                    <p style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '14px' }}>{p.companyName}</p>
                  </div>
                  <span className="badge badge-approved" style={{ fontSize: '11px' }}>{p.employmentType}</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>
                    <MapPin size={16} />
                    <span>{p.location}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>
                    <DollarSign size={16} />
                    <span>Package: {p.ctc} LPA</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>
                    <Award size={16} />
                    <span>Min CGPA Cutoff: {p.minimumCgpa}</span>
                  </div>
                </div>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderTop: '1px solid var(--border)',
                paddingTop: '16px',
                marginTop: '12px'
              }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Deadline: {new Date(p.deadline).toLocaleDateString()}
                </span>
                <Link to={`/student/jobs/${p.id}`} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '13px' }}>
                  View Details <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentJobs;
