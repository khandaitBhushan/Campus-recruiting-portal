import React, { useState, useEffect, useContext } from 'react';
import { AlertCircle, CheckCircle, Download, Upload, User } from 'lucide-react';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import StudentWorkspace from '../../components/StudentWorkspace';

const StudentProfile = () => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [branch, setBranch] = useState('');
  const [cgpa, setCgpa] = useState('');
  const [activeBacklogs, setActiveBacklogs] = useState(0);
  const [resumeUrl, setResumeUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get(`/api/students/${user.profileId}`);
        const data = response.data;
        setProfile(data);
        setName(data.name);
        setDepartment(data.department);
        setBranch(data.branch);
        setCgpa(data.cgpa);
        setActiveBacklogs(data.activeBacklogs);
        setResumeUrl(data.resumeUrl);
      } catch (errorResponse) {
        console.error('Error fetching student profile:', errorResponse);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user.profileId]);

  const validateForm = () => {
    const nextErrors = {};

    if (!name.trim()) {
      nextErrors.name = 'Enter your full name.';
    }

    if (!department.trim()) {
      nextErrors.department = 'Enter your department.';
    }

    if (!branch.trim()) {
      nextErrors.branch = 'Enter your branch.';
    }

    if (Number.isNaN(parseFloat(cgpa)) || parseFloat(cgpa) < 0 || parseFloat(cgpa) > 10) {
      nextErrors.cgpa = 'CGPA must be between 0 and 10.';
    }

    if (Number.isNaN(parseInt(activeBacklogs, 10)) || parseInt(activeBacklogs, 10) < 0) {
      nextErrors.activeBacklogs = 'Backlogs cannot be negative.';
    }

    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUploadResume = async () => {
    if (!selectedFile) {
      return null;
    }

    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await api.post('/api/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResumeUrl(response.data.url);
      setSelectedFile(null);
      return response.data.url;
    } catch (errorResponse) {
      setError('Failed to upload file. Make sure it is a valid document.');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSaveProfile = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      let currentResumeUrl = resumeUrl;

      if (selectedFile) {
        const uploadedUrl = await handleUploadResume();
        if (uploadedUrl) {
          currentResumeUrl = uploadedUrl;
        } else {
          setSubmitting(false);
          return;
        }
      }

      const response = await api.put(`/api/students/${user.profileId}`, {
        name,
        department,
        branch,
        cgpa: parseFloat(cgpa),
        activeBacklogs: parseInt(activeBacklogs, 10),
        resumeUrl: currentResumeUrl,
      });

      setProfile(response.data);
      setSuccess('Profile updated successfully.');
    } catch (errorResponse) {
      setError(errorResponse.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    );
  }

  const readinessChecks = [
    Boolean(name.trim()),
    Boolean(department.trim()),
    Boolean(branch.trim()),
    Number(cgpa) > 0,
    Boolean(resumeUrl),
  ];

  const readinessScore = Math.round(
    (readinessChecks.filter(Boolean).length / readinessChecks.length) * 100
  );

  return (
    <StudentWorkspace
      eyebrow="Academic profile"
      title="Keep your placement profile ready"
      description="Update the details recruiters screen for, keep your resume current, and remove blockers before the next application round."
      profileName={profile?.name}
      profileEmail={profile?.email}
    >
      <div className="profile-grid">
        <div className="page-stack">
          <section className="profile-card reveal">
            <div className="profile-head">
              <div className="profile-badge">
                <User size={30} />
              </div>
              <div className="profile-copy">
                <h2 className="profile-name">{profile?.name}</h2>
                <p>{profile?.email}</p>
              </div>
            </div>

            <span className={`badge ${profile?.placed ? 'badge-approved' : 'badge-pending'}`}>
              {profile?.placed ? 'Placed' : 'Seeking placement'}
            </span>

            <div className="readiness-meter">
              <div className="readiness-track">
                <div className="readiness-fill" style={{ width: `${readinessScore}%` }} />
              </div>
              <strong className="stat-number">{readinessScore}% profile readiness</strong>
            </div>
          </section>

          <section className="profile-card reveal">
            <h3>Resume status</h3>
            {resumeUrl ? (
              <>
                <div className="inline-message success">
                  <CheckCircle size={18} />
                  <p>Your current resume is uploaded and ready to use.</p>
                </div>
                <a
                  href={`http://localhost:8080${resumeUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                >
                  <Download size={16} />
                  Download current resume
                </a>
              </>
            ) : (
              <div className="inline-message warning">
                <AlertCircle size={18} />
                <p>No resume is attached yet. Add one to unlock job applications.</p>
              </div>
            )}
          </section>
        </div>

        <section className="profile-panel reveal">
          <div className="section-header">
            <div>
              <h2 className="card-heading">Update profile information</h2>
              <p className="card-subheading">
                Your academic record should match what recruiters review.
              </p>
            </div>
          </div>

          {error ? (
            <div className="inline-message error" style={{ marginBottom: '16px' }}>
              <AlertCircle size={18} />
              <p>{error}</p>
            </div>
          ) : null}

          {success ? (
            <div className="inline-message success" style={{ marginBottom: '16px' }}>
              <CheckCircle size={18} />
              <p>{success}</p>
            </div>
          ) : null}

          <form onSubmit={handleSaveProfile} className="form-stack">
            <div className="form-section">
              <h3>Academic details</h3>
              <div className="form-grid">
                <div className="form-group full-span">
                  <label htmlFor="profile-name">Full name</label>
                  <input
                    id="profile-name"
                    type="text"
                    className="form-control"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                  />
                  {fieldErrors.name ? <span className="field-error">{fieldErrors.name}</span> : null}
                </div>

                <div className="form-group">
                  <label htmlFor="profile-department">Department</label>
                  <input
                    id="profile-department"
                    type="text"
                    className="form-control"
                    value={department}
                    onChange={(event) => setDepartment(event.target.value)}
                  />
                  {fieldErrors.department ? (
                    <span className="field-error">{fieldErrors.department}</span>
                  ) : null}
                </div>

                <div className="form-group">
                  <label htmlFor="profile-branch">Branch</label>
                  <input
                    id="profile-branch"
                    type="text"
                    className="form-control"
                    value={branch}
                    onChange={(event) => setBranch(event.target.value)}
                  />
                  {fieldErrors.branch ? (
                    <span className="field-error">{fieldErrors.branch}</span>
                  ) : null}
                </div>

                <div className="form-group">
                  <label htmlFor="profile-cgpa">CGPA</label>
                  <input
                    id="profile-cgpa"
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    className="form-control"
                    value={cgpa}
                    onChange={(event) => setCgpa(event.target.value)}
                  />
                  {fieldErrors.cgpa ? <span className="field-error">{fieldErrors.cgpa}</span> : null}
                </div>

                <div className="form-group">
                  <label htmlFor="profile-backlogs">Active backlogs</label>
                  <input
                    id="profile-backlogs"
                    type="number"
                    min="0"
                    className="form-control"
                    value={activeBacklogs}
                    onChange={(event) => setActiveBacklogs(event.target.value)}
                  />
                  {fieldErrors.activeBacklogs ? (
                    <span className="field-error">{fieldErrors.activeBacklogs}</span>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Resume upload</h3>
              <p className="field-note">Accepted formats: PDF, DOC, and DOCX.</p>
              <label className="upload-zone" htmlFor="resume-upload">
                <input
                  id="resume-upload"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                />
                <div className="upload-copy">
                  <Upload size={24} />
                  <strong>{selectedFile ? selectedFile.name : 'Click to choose a new resume file'}</strong>
                  <span className="field-note">
                    {selectedFile
                      ? 'The file will upload when you save the form.'
                      : 'Keep your latest resume ready before applying to roles.'}
                  </span>
                </div>
              </label>
            </div>

            <button type="submit" className="btn btn-primary" disabled={submitting || uploading}>
              {submitting || uploading ? 'Saving profile' : 'Save profile and resume'}
            </button>
          </form>
        </section>
      </div>
    </StudentWorkspace>
  );
};

export default StudentProfile;
