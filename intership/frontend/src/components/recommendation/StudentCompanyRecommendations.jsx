import React, { useState, useEffect } from 'react';
import '../../styles/Recommendations.css';

const StudentCompanyRecommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    const studentId = localStorage.getItem('studentId') || localStorage.getItem('userId');
    
    try {
      console.log('Fetching company recommendations for student ID:', studentId);
      
      const response = await fetch('http://localhost:8000/recommend/student-to-companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id: parseInt(studentId), limit: 10 })
      });
      
      const data = await response.json();
      console.log('API Response:', data);
      
      if (!response.ok) {
        let errorMessage = 'Failed to load recommendations';
        if (data && typeof data === 'object') {
          if (data.detail) {
            errorMessage = typeof data.detail === 'string' ? data.detail : 'Server error';
          } else if (data.message) {
            errorMessage = data.message;
          }
        }
        throw new Error(errorMessage);
      }
      
      const recommendationsList = Array.isArray(data.recommendations) ? data.recommendations : [];
      setRecommendations(recommendationsList);
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      setError(err.message || 'Failed to load company recommendations. Please try again later.');
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

  if (loading) {
    return (
      <div className="recommendations-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Finding recommended companies for you...</p>
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
         <h1>Recommended companies</h1>
          <p>Based on your profile, skills and technical relevance.</p>
        </div>
        <div className="empty-state">
          <p>No company recommendations found. Complete your profile to get better matches!</p>
          <button onClick={fetchRecommendations} className="retry-btn">Refresh</button>
        </div>
      </div>
    );
  }

  return (
    <div className="recommendations-container">
      <div className="recommendations-header">
        <h1>🏢 Recommended Companies</h1>
        <p>Based on your skills and profile</p>
      </div>

      <div className="recommendations-list">
        {recommendations.map((company, index) => (
          <div key={company.item_id || index} className="recommendation-card company-card">
            <div className="rank-badge">#{index + 1}</div>
            
            <div className="company-info">
              <div className="card-header">
                <h3>{company.company_name || 'Unknown Company'}</h3>
                <div 
                  className="match-badge" 
                  style={{ backgroundColor: getMatchColor(company.match_percentage) }}
                >
                  <span className="match-percentage">{company.match_percentage}%</span>
                  <span className="match-text">Match Score</span>
                </div>
              </div>
              
              <div className="company-details">
                <p className="company-location">📍 {company.company_city || 'Location not specified'}</p>
                <p className="company-services">{company.company_services || 'No description available'}</p>
              </div>
              
              <div className="score-details">
                <div className="detail-item">
                  <span className="detail-label">Skills Match:</span>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${company.details?.skills_match || 0}%` }}>
                      {company.details?.skills_match || 0}%
                    </div>
                  </div>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Tech Relevance:</span>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${company.details?.tech_relevance || 0}%` }}>
                      {company.details?.tech_relevance || 0}%
                    </div>
                  </div>
                </div>
                {company.details?.matched_skills?.length > 0 && (
                  <div className="matched-skills">
                    <strong>Matched Skills:</strong>
                    <div className="skills-tags">
                      {company.details.matched_skills.map((skill, i) => (
                        <span key={i} className="skill-tag">{skill}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="card-actions">
              <button className="view-company-btn">View Company</button>
              <button className="follow-btn">Follow Company</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentCompanyRecommendations;