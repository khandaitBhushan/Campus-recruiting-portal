import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  Award,
  BriefcaseBusiness,
  CheckCircle2,
  CircleAlert,
  MapPin,
  Wallet,
} from 'lucide-react';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import StudentWorkspace from '../../components/StudentWorkspace';

const StudentJobDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [profile, setProfile] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [coverLetter, setCoverLetter] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const [jobResponse, profileResponse, applicationsResponse] = await Promise.all([
          api.get(`/api/postings/${id}`),
          api.get(`/api/students/${user.profileId}`),
          api.get(`/api/applications/student/${user.profileId}`),
        ]);

        setJob(jobResponse.data);
        setProfile(profileResponse.data);
        setApplications(applicationsResponse.data);
      } catch (errorResponse) {
        console.error('Error fetching job details:', errorResponse);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id, user.profileId]);

  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <StudentWorkspace
        eyebrow="Role details"
        title="Job posting not found"
        description="This role may have been removed or is no longer visible to students."
        profileName={profile?.name}
        profileEmail={profile?.email}
        backLink="/student/jobs"
        backLabel="Back to roles"
      >
        <section className="section-card reveal">
          <div className="empty-state">
            <BriefcaseBusiness size={28} />
            <p>Try returning to the approved jobs board to review current openings.</p>
            <Link to="/student/jobs" className="btn btn-primary">
              Back to jobs
            </Link>
          </div>
        </section>
      </StudentWorkspace>
    );
  }

  const meetsCgpa = Number(profile.cgpa) >= Number(job.minimumCgpa);
  const eligibleBranchesList = job.eligibleBranches
    .split(',')
    .map((branch) => branch.trim().toLowerCase());
  const meetsBranch = eligibleBranchesList.includes(profile.branch.trim().toLowerCase());
  const meetsBacklogs = job.backlogsAllowed || Number(profile.activeBacklogs) === 0;
  const isEligible = meetsCgpa && meetsBranch && meetsBacklogs;
  const hasApplied = applications.some((application) => application.postingId === job.id);

  const handleApply = async (event) => {
    event.preventDefault();

    if (!profile.resumeUrl) {
      setError('You must upload a resume in your profile page before applying.');
      return;
    }

    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      await api.post('/api/applications', {
        studentId: profile.id,
        postingId: job.id,
        coverLetter,
        resumeUrl: profile.resumeUrl,
      });
      setSuccess('Application submitted successfully.');
      setTimeout(() => {
        navigate('/student/applications');
      }, 1500);
    } catch (errorResponse) {
      setError(errorResponse.response?.data?.message || 'Failed to submit application.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <StudentWorkspace
      eyebrow="Role details"
      title={job.title}
      description="Review compensation, branch fit, and eligibility before sending your application."
      profileName={profile?.name}
      profileEmail={profile?.email}
      backLink="/student/jobs"
      backLabel="Back to approved roles"
      actions={
        hasApplied ? (
          <Link to="/student/applications" className="btn btn-secondary">
            View my application
          </Link>
        ) : null
      }
    >
      <div className="page-stack">
        <section className="hero-banner reveal">
          <h2>{job.companyName}</h2>
          <p>
            {job.employmentType} role with a package of {job.ctc} LPA. Deadline:{' '}
            {new Date(job.deadline).toLocaleDateString()}.
          </p>
          <div className="hero-meta">
            <span className="meta-pill">
              <MapPin size={15} />
              {job.location}
            </span>
            <span className="meta-pill">
              <Award size={15} />
              Minimum CGPA {job.minimumCgpa}
            </span>
          </div>
        </section>

        <section className="detail-grid">
          <article className="detail-panel reveal">
            <div className="detail-stack">
              <div className="detail-meta-grid">
                <div className="detail-meta-card">
                  <span>Location</span>
                  <strong>{job.location}</strong>
                </div>
                <div className="detail-meta-card">
                  <span>Compensation</span>
                  <strong>{job.ctc} LPA</strong>
                </div>
                <div className="detail-meta-card">
                  <span>Work type</span>
                  <strong>{job.employmentType}</strong>
                </div>
              </div>

              <section className="detail-section">
                <h3>Role summary</h3>
                <p>{job.description}</p>
              </section>

              <section className="detail-section">
                <h3>Eligibility details</h3>
                <ul>
                  <li>
                    Eligible branches: <strong>{job.eligibleBranches}</strong>
                  </li>
                  <li>
                    Backlogs allowed: <strong>{job.backlogsAllowed ? 'Yes' : 'No'}</strong>
                  </li>
                  <li>
                    Application deadline:{' '}
                    <strong>{new Date(job.deadline).toLocaleDateString()}</strong>
                  </li>
                </ul>
              </section>
            </div>
          </article>

          <aside className="application-panel reveal">
            <div className="detail-stack">
              <section>
                <h3>Your eligibility</h3>
                <div className="eligibility-list">
                  <div className="eligibility-item">
                    <div className="eligibility-copy">
                      <strong>CGPA</strong>
                      <p>Required {job.minimumCgpa}</p>
                    </div>
                    <span className={`badge ${meetsCgpa ? 'badge-approved' : 'badge-rejected'}`}>
                      {profile.cgpa}
                    </span>
                  </div>
                  <div className="eligibility-item">
                    <div className="eligibility-copy">
                      <strong>Branch</strong>
                      <p>{job.eligibleBranches}</p>
                    </div>
                    <span className={`badge ${meetsBranch ? 'badge-approved' : 'badge-rejected'}`}>
                      {profile.branch}
                    </span>
                  </div>
                  <div className="eligibility-item">
                    <div className="eligibility-copy">
                      <strong>Backlogs</strong>
                      <p>{job.backlogsAllowed ? 'Allowed by recruiter' : 'Must be zero'}</p>
                    </div>
                    <span className={`badge ${meetsBacklogs ? 'badge-approved' : 'badge-rejected'}`}>
                      {profile.activeBacklogs}
                    </span>
                  </div>
                </div>
              </section>

              {hasApplied ? (
                <div className="inline-message success">
                  <CheckCircle2 size={18} />
                  <p>You have already applied for this role.</p>
                </div>
              ) : isEligible ? (
                <section>
                  <h3>Apply now</h3>

                  {error ? (
                    <div className="inline-message error" style={{ marginBottom: '12px' }}>
                      <CircleAlert size={18} />
                      <p>{error}</p>
                    </div>
                  ) : null}

                  {success ? (
                    <div className="inline-message success" style={{ marginBottom: '12px' }}>
                      <CheckCircle2 size={18} />
                      <p>{success}</p>
                    </div>
                  ) : null}

                  <form onSubmit={handleApply} className="form-stack">
                    <div className="form-group">
                      <label htmlFor="cover-note">Cover note</label>
                      <textarea
                        id="cover-note"
                        className="form-control"
                        placeholder="Share why your background fits this role."
                        value={coverLetter}
                        onChange={(event) => setCoverLetter(event.target.value)}
                      />
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={submitting}>
                      {submitting ? 'Submitting application' : 'Submit application'}
                    </button>
                  </form>
                </section>
              ) : (
                <div className="inline-message warning">
                  <AlertTriangle size={18} />
                  <p>You do not currently meet the academic criteria for this role.</p>
                </div>
              )}

              <div className="surface-card aside-panel">
                <h3>Before you submit</h3>
                <p className="aside-note">
                  Resume status: {profile.resumeUrl ? 'uploaded and ready' : 'missing from your profile'}.
                </p>
                <Link to="/student/profile" className="link-action" style={{ marginTop: '12px' }}>
                  Review profile
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </aside>
        </section>
      </div>
    </StudentWorkspace>
  );
};

export default StudentJobDetails;
