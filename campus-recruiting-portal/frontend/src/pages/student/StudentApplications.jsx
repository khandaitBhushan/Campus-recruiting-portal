import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Download, FileText, Sparkles } from 'lucide-react';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import StudentWorkspace from '../../components/StudentWorkspace';

const StudentApplications = () => {
  const { user } = useContext(AuthContext);
  const [applications, setApplications] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const [applicationsResponse, profileResponse] = await Promise.all([
          api.get(`/api/applications/student/${user.profileId}`),
          api.get(`/api/students/${user.profileId}`),
        ]);

        setApplications(applicationsResponse.data);
        setProfile(profileResponse.data);
      } catch (error) {
        console.error('Error fetching applications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [user.profileId]);

  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    );
  }

  const shortlistedCount = applications.filter((application) =>
    ['SHORTLISTED', 'INTERVIEWING', 'SELECTED'].includes(application.status)
  ).length;

  return (
    <StudentWorkspace
      eyebrow="Application tracker"
      title="Your placement pipeline"
      description="Follow each application from submission through shortlist, interview, and final outcome."
      profileName={profile?.name}
      profileEmail={profile?.email}
      actions={
        <Link to="/student/jobs" className="btn btn-primary">
          Browse more roles
        </Link>
      }
      aside={
        <div className="aside-stack">
          <div className="surface-card aside-panel reveal">
            <h3>Progress snapshot</h3>
            <div className="summary-list">
              <div className="summary-item">
                <Sparkles size={16} />
                <span>{applications.length} total applications</span>
              </div>
              <div className="summary-item">
                <FileText size={16} />
                <span>{shortlistedCount} in shortlist or beyond</span>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <div className="page-stack">
        {applications.length === 0 ? (
          <section className="section-card reveal">
            <div className="empty-state">
              <FileText size={28} />
              <p>You have not applied to any roles yet. Start with approved openings that match your profile.</p>
              <Link to="/student/jobs" className="btn btn-primary">
                Explore jobs
              </Link>
            </div>
          </section>
        ) : (
          <section className="section-card reveal">
            <div className="section-header">
              <div>
                <h2 className="card-heading">All applications</h2>
                <p className="card-subheading">Newest submissions appear first.</p>
              </div>
            </div>

            <div className="application-stack">
              {applications.map((application) => (
                <article key={application.id} className="application-row">
                  <div>
                    <h3>{application.postingTitle}</h3>
                    <p className="job-card-company">{application.companyName}</p>

                    {application.coverLetter ? (
                      <div className="application-cover" style={{ marginTop: '14px' }}>
                        Cover note: "{application.coverLetter}"
                      </div>
                    ) : null}

                    <div className="application-meta" style={{ marginTop: '14px' }}>
                      <span className="summary-item">
                        <Calendar size={14} />
                        <span>{new Date(application.appliedAt).toLocaleDateString()}</span>
                      </span>
                      {application.resumeUrl ? (
                        <a
                          href={`http://localhost:8080${application.resumeUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="link-action"
                        >
                          <Download size={14} />
                          Resume
                        </a>
                      ) : null}
                    </div>
                  </div>

                  <span className={`badge badge-${application.status.toLowerCase()}`}>
                    {application.status}
                  </span>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </StudentWorkspace>
  );
};

export default StudentApplications;
