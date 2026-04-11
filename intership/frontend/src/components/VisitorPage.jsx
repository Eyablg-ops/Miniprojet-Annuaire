import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/VisitorPage.css';

const VisitorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="visitor-container">
      {/* Navigation */}
      <nav className="visitor-nav">
        <div className="nav-brand">
          <span className="brand-icon">🎓</span>
          <span className="brand-name">InternPlatform</span>
        </div>
        <div className="nav-buttons">
          <button className="nav-login-btn" onClick={() => navigate('/login')}>
            Sign In
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title animate-slide-left">
            Find Your Perfect
            <span className="gradient-text"> Internship</span>
          </h1>
          <p className="hero-subtitle animate-slide-left">
            Connect with top companies and kickstart your career journey.
            Whether you're a student seeking opportunities or a company looking for talent,
            we've got you covered.
          </p>
          <div className="cta-buttons animate-fade-up">
            <button 
              className="cta-btn student-btn"
              onClick={() => navigate('/signup/student')}
            >
              <span className="btn-icon">👨‍🎓</span>
              I'm a Student
            </button>
            <button 
              className="cta-btn recruiter-btn"
              onClick={() => navigate('/signup/recruiter')}
            >
              <span className="btn-icon">🏢</span>
              I'm a Recruiter
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="stats-section animate-fade-up">
          <div className="stat-card">
            <div className="stat-number">500+</div>
            <div className="stat-label">Companies</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">10K+</div>
            <div className="stat-label">Students</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">2K+</div>
            <div className="stat-label">Internships</div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="features-section">
        <h2 className="section-title">Why Choose Us?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Smart Matching</h3>
            <p>AI-powered recommendations to find the best fit for your profile</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Track Progress</h3>
            <p>Monitor your applications and internship journey</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🤝</div>
            <h3>Direct Connect</h3>
            <p>Connect directly with recruiters and companies</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📈</div>
            <h3>Career Growth</h3>
            <p>Access resources and insights for professional development</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisitorPage;