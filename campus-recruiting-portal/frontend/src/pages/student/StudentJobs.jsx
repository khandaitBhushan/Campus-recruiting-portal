import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Award,
  BriefcaseBusiness,
  Filter,
  MapPin,
  Search,
  Wallet,
} from 'lucide-react';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import StudentWorkspace from '../../components/StudentWorkspace';

const StudentJobs = () => {
  const { user } = useContext(AuthContext);
  const [postings, setPostings] = useState([]);
  const [profile, setProfile] = useState(null);
  const [filteredPostings, setFilteredPostings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [minCtc, setMinCtc] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');

  useEffect(() => {
    const fetchPostings = async () => {
      try {
        const [postingsResponse, profileResponse] = await Promise.all([
          api.get('/api/postings/student'),
          api.get(`/api/students/${user.profileId}`),
        ]);

        setPostings(postingsResponse.data);
        setFilteredPostings(postingsResponse.data);
        setProfile(profileResponse.data);
      } catch (error) {
        console.error('Error fetching job postings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPostings();
  }, [user.profileId]);

  const matchesProfile = (posting) => {
    if (!profile) {
      return false;
    }

    const branchList = posting.eligibleBranches
      .split(',')
      .map((branch) => branch.trim().toLowerCase());

    return (
      Number(profile.cgpa) >= Number(posting.minimumCgpa) &&
      branchList.includes(profile.branch.trim().toLowerCase()) &&
      (posting.backlogsAllowed || Number(profile.activeBacklogs) === 0)
    );
  };

  useEffect(() => {
    let result = postings;

    if (searchTerm) {
      result = result.filter(
        (posting) =>
          posting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          posting.companyName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (minCtc) {
      result = result.filter((posting) => posting.ctc >= parseFloat(minCtc));
    }

    if (selectedBranch) {
      result = result.filter((posting) => {
        const branches = posting.eligibleBranches
          .split(',')
          .map((branch) => branch.trim().toLowerCase());
        return branches.includes(selectedBranch.toLowerCase());
      });
    }

    setFilteredPostings(result);
  }, [searchTerm, minCtc, selectedBranch, postings]);

  const allBranches = useMemo(
    () =>
      Array.from(
        new Set(
          postings
            .flatMap((posting) => posting.eligibleBranches.split(','))
            .map((branch) => branch.trim())
            .filter(Boolean)
        )
      ),
    [postings]
  );

  const matchedCount = filteredPostings.filter(matchesProfile).length;

  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <StudentWorkspace
      eyebrow="Approved roles"
      title="Browse active job openings"
      description="Filter by role, package, and branch, then focus on openings that already align with your academic profile."
      profileName={profile?.name}
      profileEmail={profile?.email}
      actions={
        <Link to="/student/profile" className="btn btn-secondary">
          Review my profile
        </Link>
      }
      aside={
        <div className="aside-stack">
          <div className="surface-card aside-panel reveal">
            <h3>Matching roles</h3>
            <p className="aside-note">
              {matchedCount} of the current results fit your profile based on branch, CGPA, and
              backlog rules.
            </p>
          </div>
          <div className="surface-card aside-panel reveal">
            <h3>Search smarter</h3>
            <p className="aside-note">
              Use branch and CTC filters together when you want high-fit roles first, then open
              details to confirm deadline and backlog policy.
            </p>
          </div>
        </div>
      }
    >
      <div className="page-stack">
        <section className="hero-banner reveal">
          <h2>{filteredPostings.length} approved roles are open right now.</h2>
          <p>
            {matchedCount > 0
              ? `${matchedCount} roles already look eligible for you.`
              : 'Refine your filters or update your profile to discover stronger matches.'}
          </p>
          <div className="hero-meta">
            <span className="meta-pill">
              <BriefcaseBusiness size={15} />
              {postings.length} total approved opportunities
            </span>
            <span className="meta-pill">
              <Filter size={15} />
              Filters stay scoped to your current search
            </span>
          </div>
        </section>

        <section className="filter-panel reveal">
          <div className="section-header">
            <div>
              <h2 className="card-heading">Refine results</h2>
              <p className="card-subheading">Narrow by role, package, and eligible branch.</p>
            </div>
          </div>

          <div className="filter-grid">
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label htmlFor="job-search">Search role or company</label>
              <div className="input-with-icon">
                <Search size={16} />
                <input
                  id="job-search"
                  type="text"
                  className="form-control"
                  placeholder="Data analyst, product intern, Meridian Logistics..."
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label htmlFor="job-ctc">Minimum CTC</label>
              <input
                id="job-ctc"
                type="number"
                className="form-control"
                placeholder="8"
                value={minCtc}
                onChange={(event) => setMinCtc(event.target.value)}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label htmlFor="job-branch">Eligible branch</label>
              <select
                id="job-branch"
                className="form-control"
                value={selectedBranch}
                onChange={(event) => setSelectedBranch(event.target.value)}
              >
                <option value="">All branches</option>
                {allBranches.map((branch) => (
                  <option key={branch} value={branch}>
                    {branch}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {filteredPostings.length === 0 ? (
          <section className="section-card reveal">
            <div className="empty-state">
              <Search size={28} />
              <p>No roles matched this search. Try a broader title or clear one of the filters.</p>
            </div>
          </section>
        ) : (
          <section className="jobs-grid">
            {filteredPostings.map((posting) => {
              const isMatch = matchesProfile(posting);

              return (
                <article key={posting.id} className="job-card reveal">
                  <div className="job-card-header">
                    <div>
                      <h3 className="job-card-title">{posting.title}</h3>
                      <p className="job-card-company">{posting.companyName}</p>
                    </div>
                    <span className={`badge ${isMatch ? 'badge-approved' : 'badge-pending'}`}>
                      {isMatch ? 'Good match' : posting.employmentType}
                    </span>
                  </div>

                  <div className="job-card-meta">
                    <div className="summary-item">
                      <MapPin size={15} />
                      <span>{posting.location}</span>
                    </div>
                    <div className="summary-item">
                      <Wallet size={15} />
                      <span>{posting.ctc} LPA</span>
                    </div>
                    <div className="summary-item">
                      <Award size={15} />
                      <span>CGPA cutoff {posting.minimumCgpa}</span>
                    </div>
                  </div>

                  <p className="aside-note">
                    Eligible branches: {posting.eligibleBranches}. Deadline:{' '}
                    {new Date(posting.deadline).toLocaleDateString()}.
                  </p>

                  <div className="job-card-foot">
                    <span>{posting.employmentType}</span>
                    <Link to={`/student/jobs/${posting.id}`} className="btn btn-primary">
                      View details
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </div>
    </StudentWorkspace>
  );
};

export default StudentJobs;
