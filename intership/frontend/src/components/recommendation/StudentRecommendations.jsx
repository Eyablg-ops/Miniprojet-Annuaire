import React, { useState, useEffect } from 'react';
import '../../styles/Recommendations.css';

const StudentRecommendations = ({ onApply }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedInternship, setSelectedInternship] = useState(null);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    const studentId = localStorage.getItem('studentId') || localStorage.getItem('userId');
    
    try {
      console.log('Fetching recommendations for student ID:', studentId);
      
      const response = await fetch('http://localhost:8000/recommend/student-to-offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id: parseInt(studentId), limit: 10 })
      });
      
      const data = await response.json();
      console.log('API Response:', data);
      
      if (!response.ok) {
        // Extract error message safely
        let errorMessage = 'Failed to load recommendations';
        if (data && typeof data === 'object') {
          if (data.detail) {
            errorMessage = typeof data.detail === 'string' ? data.detail : JSON.stringify(data.detail);
          } else if (data.message) {
            errorMessage = data.message;
          } else if (data.error) {
            errorMessage = data.error;
          }
        }
        throw new Error(errorMessage);
      }
      
      // Ensure recommendations is an array
      const recommendationsList = Array.isArray(data.recommendations) ? data.recommendations : [];
      console.log('Recommendations found:', recommendationsList.length);
      setRecommendations(recommendationsList);
      
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      setError(err.message || 'Failed to load recommendations. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const getMatchColor = (percentage) => {
    if (percentage >= 70) return '#4caf50';
    if (percentage >= 50) return '#ff9800';
    if (percentage >= 35) return '#ffc107';
    return '#9e9e9e';
  };

  const getMatchText = (percentage) => {
    if (percentage >= 70) return 'Excellent Match 🌟';
    if (percentage >= 50) return 'Good Match 👍';
    if (percentage >= 35) return 'Potential Match 📌';
    return 'Low Match ⚠️';
  };

  const handleApply = (internship) => {
    setSelectedInternship(internship);
  };

  const handleSubmitApplication = () => {
    const coverLetter = document.getElementById('coverLetter')?.value || '';
    if (onApply && selectedInternship) {
      onApply(selectedInternship.item_id, coverLetter);
      setSelectedInternship(null);
    }
  };

  if (loading) {
    return (
      <div className="recommendations-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Finding the best matches for you...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="recommendations-container">
        <div className="error-message">
          <p>⚠️ {error}</p>
          <button onClick={fetchRecommendations} className="retry-btn">Try Again</button>
        </div>
      </div>
    );
  }

  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="recommendations-container">
        <div className="recommendations-header">
        <h1>Recommended internship offers</h1>
        <p>Based on your profile, skills and preferences.</p>
        </div>
        <div className="empty-state">
          <p>No internship recommendations found. Complete your profile to get better matches!</p>
          <button onClick={fetchRecommendations} className="retry-btn">Refresh</button>
        </div>
      </div>
    );
  }

  return (
    <div className="recommendations-container">
      <div className="recommendations-header">
        <h1>🎯 Personalized Internship Recommendations</h1>
        <p>AI-powered matches based on your profile, skills, and preferences</p>
      </div>

      <div className="recommendations-list">
        {recommendations.map((internship, index) => (
          <div key={internship.item_id || index} className="recommendation-card">
            <div className="rank-badge">#{index + 1}</div>
            
            <div className="internship-info">
              <div className="card-header">
                <div>
                  <h3>{internship.title || `Offer #${internship.item_id}`}</h3>
                  <div className="company-info">
                    <span className="company-name">🏢 {internship.company_name || 'Unknown Company'}</span>
                    {internship.company_city && (
                      <span className="company-location">📍 {internship.company_city}</span>
                    )}
                  </div>
                </div>
                <div 
                  className="match-badge" 
                  style={{ backgroundColor: getMatchColor(internship.match_percentage) }}
                >
                  <span className="match-percentage">{internship.match_percentage}%</span>
                  <span className="match-text">{getMatchText(internship.match_percentage)}</span>
                </div>
              </div>
              
              <div className="internship-details">
                {internship.description && (
                  <p className="description">{internship.description}</p>
                )}
                <div className="details-grid">
                  {internship.location && (
                    <div className="detail-item-compact">
                      <span className="detail-icon">📍</span>
                      <span>{internship.location}</span>
                    </div>
                  )}
                  {internship.duration && (
                    <div className="detail-item-compact">
                      <span className="detail-icon">⏱️</span>
                      <span>{internship.duration} months</span>
                    </div>
                  )}
                  {internship.type && (
                    <div className="detail-item-compact">
                      <span className="detail-icon">📋</span>
                      <span>{internship.type}</span>
                    </div>
                  )}
                  {internship.domain && (
                    <div className="detail-item-compact">
                      <span className="detail-icon">🎯</span>
                      <span>{internship.domain}</span>
                    </div>
                  )}
                </div>
                {internship.required_skills && (
                  <div className="required-skills">
                    <strong>Required Skills:</strong>
                    <div className="skills-tags">
                      {typeof internship.required_skills === 'string' 
                        ? internship.required_skills.split(',').map((skill, i) => (
                            <span key={i} className="skill-tag">{skill.trim()}</span>
                          ))
                        : <span className="skill-tag">{String(internship.required_skills)}</span>
                      }
                    </div>
                  </div>
                )}
              </div>
              
              <div className="score-details">
                <div className="detail-item">
                  <span className="detail-label">Skills Match:</span>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${internship.details?.skills_match || 0}%` }}>
                      {internship.details?.skills_match || 0}%
                    </div>
                  </div>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Education Match:</span>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${internship.details?.education_match || 0}%` }}>
                      {internship.details?.education_match || 0}%
                    </div>
                  </div>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Experience Match:</span>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${internship.details?.experience_match || 0}%` }}>
                      {internship.details?.experience_match || 0}%
                    </div>
                  </div>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Location Match:</span>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${internship.details?.location_match || 0}%` }}>
                      {internship.details?.location_match || 0}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="card-actions">
              <button className="view-details-btn" onClick={() => setSelectedInternship(internship)}>
                View Details
              </button>
              <button className="apply-btn" onClick={() => handleApply(internship)}>
                Apply Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedInternship && (
        <div className="modal-overlay" onClick={() => setSelectedInternship(null)}>
          <div className="modal-content internship-modal" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedInternship.title}</h2>
            <div className="modal-company">
              <strong>🏢 {selectedInternship.company_name}</strong>
              {selectedInternship.company_city && <span> - 📍 {selectedInternship.company_city}</span>}
            </div>
            <div className="modal-details">
              <p><strong>Duration:</strong> {selectedInternship.duration} months</p>
              <p><strong>Type:</strong> {selectedInternship.type || 'Internship'}</p>
              <p><strong>Domain:</strong> {selectedInternship.domain || 'General'}</p>
              <p><strong>Location:</strong> {selectedInternship.location || 'Remote possible'}</p>
              <p><strong>Match Score:</strong> {selectedInternship.match_percentage}%</p>
            </div>
            <div className="modal-description">
              <strong>Description:</strong>
              <p>{selectedInternship.description}</p>
            </div>
            <div className="modal-skills">
              <strong>Required Skills:</strong>
              <div className="skills-tags">
                {typeof selectedInternship.required_skills === 'string'
                  ? selectedInternship.required_skills.split(',').map((skill, i) => (
                      <span key={i} className="skill-tag">{skill.trim()}</span>
                    ))
                  : <span className="skill-tag">{String(selectedInternship.required_skills)}</span>
                }
              </div>
            </div>
            <div className="modal-cover-letter">
              <strong>Cover Letter (Optional):</strong>
              <textarea 
                id="coverLetter"
                placeholder="Write a brief introduction about yourself and why you're interested in this position..."
                rows="5"
              />
            </div>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setSelectedInternship(null)}>Close</button>
              <button className="submit-btn" onClick={handleSubmitApplication}>Submit Application</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentRecommendations;