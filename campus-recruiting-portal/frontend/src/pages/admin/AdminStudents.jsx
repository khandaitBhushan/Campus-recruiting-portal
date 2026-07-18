import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Upload, Check, FileSpreadsheet, Search, RefreshCw } from 'lucide-react';

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Bulk Import CSV states
  const [selectedFile, setSelectedFile] = useState(null);
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState('');
  const [importSuccess, setImportSuccess] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const fetchStudents = async () => {
    try {
      const response = await api.get('/api/admin/students');
      setStudents(response.data);
      setFilteredStudents(response.data);
    } catch (err) {
      console.error('Error fetching students list:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const result = students.filter(
        (s) =>
          s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.branch.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredStudents(result);
    } else {
      setFilteredStudents(students);
    }
  }, [searchTerm, students]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleImportCsv = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    setImporting(true);
    setImportError('');
    setImportSuccess('');

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      await api.post('/api/admin/students/import', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setImportSuccess('Students imported successfully!');
      setSelectedFile(null);
      await fetchStudents();
    } catch (err) {
      setImportError(err.response?.data?.message || 'CSV Import failed. Check formatting.');
    } finally {
      setImporting(false);
    }
  };

  const handleTogglePlacement = async (studentId, currentPlacedStatus) => {
    setUpdatingId(studentId);
    try {
      await api.put(`/api/admin/students/${studentId}/placement?placed=${!currentPlacedStatus}`);
      await fetchStudents();
    } catch (err) {
      console.error('Error toggling placement status:', err);
    } finally {
      setUpdatingId(null);
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
      <h1 style={{ fontSize: '26px', fontWeight: '700', marginBottom: '24px' }}>Manage Student Records</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px', marginBottom: '32px' }}>
        {/* Student Search and Table List */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700' }}>Student Roster</h3>
            <div style={{ position: 'relative', width: '220px' }}>
              <Search size={16} style={{
                position: 'absolute',
                left: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)'
              }} />
              <input
                type="text"
                className="form-control"
                style={{ paddingLeft: '34px', padding: '8px 12px 8px 34px', fontSize: '13px' }}
                placeholder="Search by name, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Branch / CGPA</th>
                  <th>Grad Year</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <div style={{ fontWeight: '600' }}>{s.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{s.email}</div>
                    </td>
                    <td>{s.branch} ({s.cgpa})</td>
                    <td>{s.graduationYear}</td>
                    <td>
                      <span className={`badge ${s.placed ? 'badge-approved' : 'badge-pending'}`}>
                        {s.placed ? 'Placed' : 'Unplaced'}
                      </span>
                    </td>
                    <td>
                      {updatingId === s.id ? (
                        <span style={{ fontSize: '12px', color: 'var(--primary)' }}>Saving...</span>
                      ) : (
                        <button
                          onClick={() => handleTogglePlacement(s.id, s.placed)}
                          className="btn btn-outline"
                          style={{
                            padding: '6px 12px',
                            fontSize: '12px',
                            borderColor: s.placed ? 'var(--warning)' : 'var(--success)',
                            color: s.placed ? 'var(--warning)' : 'var(--success)'
                          }}
                        >
                          Mark as {s.placed ? 'Unplaced' : 'Placed'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* CSV Import Panel */}
        <div className="glass-panel" style={{ height: 'fit-content' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileSpreadsheet size={20} color="var(--primary)" /> Bulk Import via CSV
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '20px', lineHeight: '1.4' }}>
            Upload a `.csv` file with standard columns: `Name,Email,Department,Branch,CGPA,ActiveBacklogs,GraduationYear,Password`.
          </p>

          {importError && <div style={{ color: 'var(--danger)', fontSize: '13px', marginBottom: '12px' }}>{importError}</div>}
          {importSuccess && <div style={{ color: 'var(--success)', fontSize: '13px', marginBottom: '12px' }}>{importSuccess}</div>}

          <form onSubmit={handleImportCsv}>
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <div style={{
                border: '2px dashed var(--border)',
                borderRadius: '8px',
                padding: '20px',
                textAlign: 'center',
                cursor: 'pointer',
                position: 'relative'
              }}>
                <input 
                  type="file" 
                  accept=".csv" 
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
                <Upload size={22} color="var(--text-muted)" style={{ margin: '0 auto 8px auto', display: 'block' }} />
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  {selectedFile ? selectedFile.name : 'Select CSV file'}
                </span>
              </div>
            </div>
            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: '100%', padding: '12px' }}
              disabled={importing || !selectedFile}
            >
              {importing ? 'Importing CSV...' : 'Import Students'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminStudents;
