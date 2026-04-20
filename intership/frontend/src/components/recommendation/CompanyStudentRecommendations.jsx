import React, { useState, useEffect } from 'react';
import '../../styles/CompanyStudentRecommendations.css';

const CompanyStudentRecommendations = ({ companyId }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('CompanyStudentRecommendations mounted with companyId:', companyId);
    if (companyId) {
      fetchData();
    } else {
      console.error('No companyId provided!');
      setError('No company ID found. Please make sure you are logged in as a recruiter.');
      setLoading(false);
    }
  }, [companyId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch AI recommendations
      console.log('Fetching AI recommendations for company ID:', companyId);
      const recommendationsResponse = await fetch('http://localhost:8000/recommend/company-to-students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company_id: parseInt(companyId), limit: 50 })
      });
      
      if (!recommendationsResponse.ok) {
        throw new Error(`HTTP error! status: ${recommendationsResponse.status}`);
      }
      
      const recommendationsData = await recommendationsResponse.json();
      console.log('AI Recommendations data:', recommendationsData);
      
      // Fetch actual applications (postulations) for this company
      const token = localStorage.getItem('token');
      const applicationsResponse = await fetch('http://localhost:8080/api/postulations/recruiter', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!applicationsResponse.ok) {
        throw new Error(`HTTP error! status: ${applicationsResponse.status}`);
      }
      
      const applicationsData = await applicationsResponse.json();
      console.log('Applications data:', applicationsData);
      
      setApplications(applicationsData);
      
      // Create a map of student IDs that have applied
      const appliedStudentIds = new Set(applicationsData.map(app => app.studentId));
      console.log('Applied student IDs:', Array.from(appliedStudentIds));
      
      // Filter recommendations to only show students who have applied
      const filteredRecommendations = (recommendationsData.recommendations || [])
        .filter(rec => appliedStudentIds.has(rec.item_id))
        .map(rec => {
          // Find the corresponding application data
          const application = applicationsData.find(app => app.studentId === rec.item_id);
          return {
            ...rec,
            applicationStatus: application?.status || 'PENDING',
            applicationId: application?.id,
            coverLetter: application?.coverLetter,
            appliedAt: application?.appliedAt,
            offerTitle: application?.offerTitle
          };
        });
      
      console.log('Filtered recommendations (only applied students):', filteredRecommendations);
      setRecommendations(filteredRecommendations);
      
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (applicationId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/postulations/${applicationId}/statut?statut=${newStatus}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        // Refresh data
        fetchData();
        alert(`Application ${newStatus.toLowerCase()} successfully!`);
      } else {
        throw new Error('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update application status');
    }
  };

  const downloadCV = async (cvUrl) => {
    if (!cvUrl) {
      alert('No CV available for this candidate');
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      window.open(`http://localhost:8080/api/postulations/fichier/${cvUrl}`, '_blank');
    } catch (error) {
      console.error('Error downloading CV:', error);
      alert('Failed to download CV');
    }
  };

  const getScoreColor = (score) => {
    if (score >= 70) return '#4caf50';
    if (score >= 50) return '#ff9800';
    if (score >= 35) return '#ffc107';
    return '#9e9e9e';
  };

  const getScoreLabel = (score) => {
    if (score >= 70) return 'Excellent Match 🌟';
    if (score >= 50) return 'Good Match 👍';
    if (score >= 35) return 'Potential Match 📌';
    return 'Low Match ⚠️';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACCEPTED': return '#4caf50';
      case 'REJECTED': return '#f44336';
      case 'REVIEWED': return '#ff9800';
      default: return '#9e9e9e';
    }
  };

  const filteredRecommendations = recommendations.filter(rec => {
    if (filter === '70plus') return rec.match_percentage >= 70;
    if (filter === '50plus') return rec.match_percentage >= 50;
    if (filter === 'pending') return rec.applicationStatus === 'PENDING';
    if (filter === 'accepted') return rec.applicationStatus === 'ACCEPTED';
    return true;
  });

  if (loading) {
    return (
      <div className="recommendations-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Finding top talent for your company...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="recommendations-container">
        <div className="error-message">
          <p>Error: {error}</p>
          <button onClick={fetchData} className="retry-btn">Try Again</button>
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="recommendations-container">
        <div className="recommendations-header">
          <h1>Candidates Who Applied</h1>
          <p>Students who have applied to your offers</p>
        </div>
        <div className="empty-state">
          <p>No students have applied to your offers yet.</p>
          <button onClick={fetchData} className="retry-btn">Refresh</button>
        </div>
      </div>
    );
  }

  return (
    <div className="recommendations-container">
      <div className="recommendations-header">
        <h2>Candidates Who Applied</h2>
        <p>AI-powered ranking of students who applied to your offers</p>
        {companyId && <p className="company-id-info">Company ID: {companyId}</p>}
      </div>

      <div className="filters-section">
        <h3>Filter Candidates</h3>
        <div className="filters-grid">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({recommendations.length})
          </button>
          <button 
            className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            Pending Review
          </button>
          <button 
            className={`filter-btn ${filter === '70plus' ? 'active' : ''}`}
            onClick={() => setFilter('70plus')}
          >
            Excellent Match (70%+)
          </button>
          <button 
            className={`filter-btn ${filter === '50plus' ? 'active' : ''}`}
            onClick={() => setFilter('50plus')}
          >
            Good Match (50%+)
          </button>
          <button 
            className={`filter-btn ${filter === 'accepted' ? 'active' : ''}`}
            onClick={() => setFilter('accepted')}
          >
            Accepted
          </button>
        </div>
      </div>

      <div className="recommendations-stats">
        <p>Found <strong>{filteredRecommendations.length}</strong> candidates</p>
      </div>

      <div className="recommendations-list">
        {filteredRecommendations.length === 0 ? (
          <div className="empty-state">
            <p>No candidates found matching your criteria. Try adjusting your filters!</p>
          </div>
        ) : (
          filteredRecommendations.map((candidate, index) => (
            <div key={candidate.item_id} className="recommendation-card recruiter-card">
              <div className="rank-badge">#{index + 1}</div>
              
              <div className="candidate-info">
                <div className="card-header">
                  <div className="student-info">
                    <h3>{candidate.student_name}</h3>
                    <p className="student-major">{candidate.student_major}</p>
                    <p className="student-offer">
                      📋 Applied for: <strong>{candidate.offerTitle || 'Unknown Offer'}</strong>
                    </p>
                  </div>
                  <div>
                    <div className="match-badge" style={{ backgroundColor: getScoreColor(candidate.match_percentage) }}>
                      <span className="match-percentage">{candidate.match_percentage}%</span>
                      <span className="match-text">{getScoreLabel(candidate.match_percentage)}</span>
                    </div>
                    <div className="status-badge" style={{ 
                      backgroundColor: getStatusColor(candidate.applicationStatus),
                      marginTop: '8px',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      color: 'white',
                      fontSize: '12px',
                      textAlign: 'center'
                    }}>
                      {candidate.applicationStatus}
                    </div>
                  </div>
                </div>
                
                <div className="score-details">
                  <div className="detail-item">
                    <span className="detail-label">Skills Match:</span>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${candidate.details.skills_match}%` }}>
                        {candidate.details.skills_match}%
                      </div>
                    </div>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Education Match:</span>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${candidate.details.education_match}%` }}>
                        {candidate.details.education_match}%
                      </div>
                    </div>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Experience Level:</span>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${candidate.details.experience_match}%` }}>
                        {candidate.details.experience_match}%
                      </div>
                    </div>
                  </div>
                </div>

                {candidate.coverLetter && (
                  <div className="cover-letter-section">
                    <strong>Cover Letter:</strong>
                    <p className="cover-letter-text">{candidate.coverLetter}</p>
                  </div>
                )}
              </div>

              <div className="card-actions">
                <button className="view-profile-btn" onClick={() => setSelectedStudent(candidate)}>
                  View Profile
                </button>
                {candidate.cvUrl && (
                  <button className="download-cv-btn" onClick={() => downloadCV(candidate.cvUrl)}>
                    Download CV
                  </button>
                )}
                {candidate.applicationStatus === 'PENDING' && (
                  <>
                    <button 
                      className="accept-btn"
                      onClick={() => updateApplicationStatus(candidate.applicationId, 'ACCEPTED')}
                    >
                      Accept
                    </button>
                    <button 
                      className="reject-btn"
                      onClick={() => updateApplicationStatus(candidate.applicationId, 'REJECTED')}
                    >
                      Reject
                    </button>
                  </>
                )}
                {candidate.applicationStatus === 'ACCEPTED' && (
                  <button className="contact-btn">Contact Candidate</button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {selectedStudent && (
        <div className="modal-overlay" onClick={() => setSelectedStudent(null)}>
          <div className="modal-content profile-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Student Profile</h2>
            <div className="profile-details">
              <p><strong>Name:</strong> {selectedStudent.student_name}</p>
              <p><strong>Major:</strong> {selectedStudent.student_major}</p>
              <p><strong>Applied for:</strong> {selectedStudent.offerTitle}</p>
              <p><strong>Application Status:</strong> {selectedStudent.applicationStatus}</p>
              <p><strong>Match Score:</strong> {selectedStudent.match_percentage}%</p>
              <p><strong>Skills Match:</strong> {selectedStudent.details.skills_match}%</p>
              <p><strong>Education Match:</strong> {selectedStudent.details.education_match}%</p>
              <p><strong>Experience Match:</strong> {selectedStudent.details.experience_match}%</p>
              {selectedStudent.coverLetter && (
                <>
                  <p><strong>Cover Letter:</strong></p>
                  <p>{selectedStudent.coverLetter}</p>
                </>
              )}
            </div>
            <div className="modal-actions">
              {selectedStudent.applicationStatus === 'PENDING' && (
                <>
                  <button 
                    className="accept-btn" 
                    onClick={() => {
                      updateApplicationStatus(selectedStudent.applicationId, 'ACCEPTED');
                      setSelectedStudent(null);
                    }}
                  >
                    Accept Candidate
                  </button>
                  <button 
                    className="reject-btn"
                    onClick={() => {
                      updateApplicationStatus(selectedStudent.applicationId, 'REJECTED');
                      setSelectedStudent(null);
                    }}
                  >
                    Reject Candidate
                  </button>
                </>
              )}
              <button className="close-btn" onClick={() => setSelectedStudent(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyStudentRecommendations;