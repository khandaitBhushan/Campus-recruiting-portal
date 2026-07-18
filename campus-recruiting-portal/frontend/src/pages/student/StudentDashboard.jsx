import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  CalendarRange,
  FileCheck2,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import StudentWorkspace from '../../components/StudentWorkspace';

const StudentDashboard = () => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [applications, setApplications] = useState([]);
  const [postings, setPostings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileResponse, applicationsResponse, postingsResponse] = await Promise.all([
          api.get(`/api/students/${user.profileId}`),
          api.get(`/api/applications/student/${user.profileId}`),
          api.get('/api/postings/student'),
        ]);

        setProfile(profileResponse.data);
        setApplications(applicationsResponse.data);
        setPostings(postingsResponse.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user.profileId]);

  const readinessScore = useMemo(() => {
    const checks = [
      Boolean(profile?.name),
      Boolean(profile?.department),
      Boolean(profile?.branch),
      Number(profile?.cgpa) > 0,
      Boolean(profile?.resumeUrl),
    ];

    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }, [profile]);

  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    );
  }

  const activeApplications = applications.filter(
    (application) => !['SELECTED', 'REJECTED', 'WITHDRAWN'].includes(application.status)
  ).length;

  const interviewingCount = applications.filter((application) =>
    ['SHORTLISTED', 'INTERVIEWING'].includes(application.status)
  ).length;

  const matchedRoles = postings.filter((posting) => {
    const cgpaCheck = Number(profile?.cgpa) >= Number(posting.minimumCgpa);
    const branchList = posting.eligibleBranches
      ?.split(',')
      .map((branch) => branch.trim().toLowerCase());
    const branchCheck = branchList?.includes(profile?.branch?.trim().toLowerCase());
    const backlogCheck = posting.backlogsAllowed || Number(profile?.activeBacklogs) === 0;

    return cgpaCheck && branchCheck && backlogCheck;
  });

  return (
    <StudentWorkspace
      eyebrow="Student workspace"
      title={`Good morning, ${profile?.name?.split(' ')[0] || 'student'}`}
      description="Track your placement momentum, keep your profile ready, and move on the roles that fit your academic profile best."
      profileName={profile?.name}
      profileEmail={profile?.email}
      actions={
        <>
          <Link to="/student/jobs" className="btn btn-primary">
            Browse roles
          </Link>
          <Link to="/student/profile" className="btn btn-secondary">
            Update profile
          </Link>
        </>
      }
      aside={
        <div className="aside-stack">
          <div className="surface-card aside-panel reveal">
            <h3>Readiness score</h3>
            <p className="aside-note">
              A complete profile keeps eligible roles easy to apply to and helps you avoid
              last-minute blockers.
            </p>
            <div className="readiness-meter">
              <div className="readiness-track">
                <div className="readiness-fill" style={{ width: `${readinessScore}%` }} />
              </div>
              <strong className="stat-number">{readinessScore}% complete</strong>
            </div>
          </div>

          <div className="surface-card aside-panel reveal">
            <h3>Profile snapshot</h3>
            <div className="summary-list">
              <div className="summary-item">
                <GraduationCap size={16} />
                <span>{profile?.branch}</span>
              </div>
              <div className="summary-item">
                <BadgeCheck size={16} />
                <span>{profile?.cgpa} CGPA</span>
              </div>
              <div className="summary-item">
                <FileCheck2 size={16} />
                <span>{profile?.resumeUrl ? 'Resume uploaded' : 'Resume missing'}</span>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <div className="page-stack">
        <section className="hero-banner reveal">
          <h2>Stay ready for the next shortlist round.</h2>
          <p>
            You currently have {activeApplications} active applications and {matchedRoles.length}{' '}
            approved roles that already fit your profile.
          </p>
          <div className="hero-meta">
            <span className="meta-pill">
              <CalendarRange size={15} />
              Placement status: {profile?.placed ? 'Placed' : 'Seeking opportunities'}
            </span>
            <span className="meta-pill">
              <Sparkles size={15} />
              Resume: {profile?.resumeUrl ? 'Ready to apply' : 'Needs upload'}
            </span>
          </div>
        </section>

        <section className="metrics-grid">
          <div className="surface-card metric-card reveal">
            <div className="metric-icon">
              <GraduationCap size={22} />
            </div>
            <div>
              <p className="metric-label">Academic CGPA</p>
              <div className="metric-value">{profile?.cgpa}</div>
              <p className="metric-note">{profile?.department}</p>
            </div>
          </div>

          <div className="surface-card metric-card reveal">
            <div className="metric-icon">
              <BriefcaseBusiness size={22} />
            </div>
            <div>
              <p className="metric-label">Active applications</p>
              <div className="metric-value">{activeApplications}</div>
              <p className="metric-note">{applications.length} total submissions</p>
            </div>
          </div>

          <div className="surface-card metric-card reveal">
            <div className="metric-icon">
              <Sparkles size={22} />
            </div>
            <div>
              <p className="metric-label">Matched roles</p>
              <div className="metric-value">{matchedRoles.length}</div>
              <p className="metric-note">Approved roles you can act on now</p>
            </div>
          </div>

          <div className="surface-card metric-card reveal">
            <div className="metric-icon">
              <BadgeCheck size={22} />
            </div>
            <div>
              <p className="metric-label">Interview pipeline</p>
              <div className="metric-value">{interviewingCount}</div>
              <p className="metric-note">Shortlisted or interviewing</p>
            </div>
          </div>
        </section>

        <section className="highlights-grid">
          <div className="section-card reveal">
            <div className="section-header">
              <div>
                <h2 className="card-heading">Recent applications</h2>
                <p className="card-subheading">Your latest movement across open roles.</p>
              </div>
              <Link to="/student/applications" className="link-action">
                View all
                <ArrowRight size={15} />
              </Link>
            </div>

            {applications.length === 0 ? (
              <div className="empty-state">
                <BriefcaseBusiness size={28} />
                <p>No applications yet. Start with roles that match your branch and CGPA.</p>
                <Link to="/student/jobs" className="btn btn-primary">
                  Browse roles
                </Link>
              </div>
            ) : (
              <div className="list-stack">
                {applications.slice(0, 4).map((application) => (
                  <div key={application.id} className="list-row">
                    <div>
                      <h3>{application.postingTitle}</h3>
                      <p>{application.companyName}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span className={`badge badge-${application.status.toLowerCase()}`}>
                        {application.status}
                      </span>
                      <div
                        className="list-meta"
                        style={{ justifyContent: 'flex-end', marginTop: '8px' }}
                      >
                        <span>{new Date(application.appliedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="section-card reveal">
            <div className="section-header">
              <div>
                <h2 className="card-heading">Next best actions</h2>
                <p className="card-subheading">Small updates that increase your placement speed.</p>
              </div>
            </div>

            <div className="list-stack">
              <div className="list-row">
                <div>
                  <h3>{profile?.resumeUrl ? 'Resume looks ready' : 'Upload your resume'}</h3>
                  <p>
                    {profile?.resumeUrl
                      ? 'You can apply immediately without profile blockers.'
                      : 'A missing resume prevents submissions from the job detail page.'}
                  </p>
                </div>
                <Link to="/student/profile" className="btn btn-secondary">
                  {profile?.resumeUrl ? 'Review profile' : 'Upload now'}
                </Link>
              </div>

              <div className="list-row">
                <div>
                  <h3>{matchedRoles.length} matched roles are live</h3>
                  <p>Prioritize roles where your CGPA, branch, and backlog status already fit.</p>
                </div>
                <Link to="/student/jobs" className="btn btn-primary">
                  Open jobs
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </StudentWorkspace>
  );
};

export default StudentDashboard;
