import React, { useState, useEffect, useContext } from 'react';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { User, Mail, Upload, FileText, CheckCircle, AlertCircle, Download } from 'lucide-react';

const StudentProfile = () => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Edit fields state
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [branch, setBranch] = useState('');
  const [cgpa, setCgpa] = useState('');
  const [activeBacklogs, setActiveBacklogs] = useState(0);
  const [resumeUrl, setResumeUrl] = useState('');

  // File Upload State
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

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
      } catch (err) {
        console.error('Error fetching student profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user.profileId]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUploadResume = async () => {
    if (!selectedFile) return null;
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
    } catch (err) {
      setError('Failed to upload file. Make sure it is a valid document.');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      let currentResumeUrl = resumeUrl;
      
      // If a file is selected, upload it first
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
        activeBacklogs: parseInt(activeBacklogs),
        resumeUrl: currentResumeUrl
      });
      setProfile(response.data);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}>
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div style={{ padding: '0 40px 40px 40px' }}>
      <h1 style={{ fontSize: '26px', fontWeight: '700', marginBottom: '24px' }}>My Academic Profile</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px' }}>
        {/* Profile Card & Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="glass-panel" style={{ textAlign: 'center' }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: 'rgba(30, 144, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
              color: 'var(--primary)'
            }}>
              <User size={40} />
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '4px' }}>{profile?.name}</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '16px' }}>{profile?.email}</p>
            <span className={`badge ${profile?.placed ? 'badge-approved' : 'badge-pending'}`}>
              {profile?.placed ? 'Placed' : 'Seeking Placements'}
            </span>
          </div>

          <div className="glass-panel">
            <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>Resume Details</h3>
            {resumeUrl ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--success)' }}>
                  <CheckCircle size={18} />
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>Resume is Uploaded</span>
                </div>
                <a 
                  href={`http://localhost:8080${resumeUrl}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn btn-outline" 
                  style={{ display: 'flex', justifyContent: 'center' }}
                >
                  <Download size={16} /> Download Resume
                </a>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--text-muted)', fontSize: '14px' }}>
                <p>No resume uploaded. Please select and upload a file to apply to postings.</p>
              </div>
            )}
          </div>
        </div>

        {/* Update Form */}
        <div className="glass-panel">
          <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '24px' }}>Update Profile Information</h3>

          {error && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              color: 'var(--danger)',
              padding: '12px 16px',
              borderRadius: '8px',
              fontSize: '14px',
              marginBottom: '20px'
            }}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              color: 'var(--success)',
              padding: '12px 16px',
              borderRadius: '8px',
              fontSize: '14px',
              marginBottom: '20px'
            }}>
              <CheckCircle size={16} />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSaveProfile}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label>Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Department</label>
                <input
                  type="text"
                  className="form-control"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Branch</label>
                <input
                  type="text"
                  className="form-control"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>CGPA</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  className="form-control"
                  value={cgpa}
                  onChange={(e) => setCgpa(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Active Backlogs</label>
                <input
                  type="number"
                  min="0"
                  className="form-control"
                  value={activeBacklogs}
                  onChange={(e) => setActiveBacklogs(e.target.value)}
                  required
                />
              </div>

              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label>Resume File (PDF / Word)</label>
                <div style={{
                  border: '2px dashed var(--border)',
                  borderRadius: '8px',
                  padding: '16px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  position: 'relative'
                }}>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      opacity: 0,
                      cursor: 'pointer'
                    }}
                  />
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <Upload size={24} color="var(--text-muted)" />
                    {selectedFile ? (
                      <span style={{ fontSize: '14px', fontWeight: '500', color: 'var(--primary)' }}>
                        Selected: {selectedFile.name}
                      </span>
                    ) : (
                      <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                        Drag & drop or click to upload a new resume file
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '14px', marginTop: '16px' }}
              disabled={submitting || uploading}
            >
              {submitting || uploading ? 'Saving Changes...' : 'Save Profile & Resume'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
