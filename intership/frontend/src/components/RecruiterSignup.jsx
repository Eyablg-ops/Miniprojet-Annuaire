import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Loading from '../ui/Loading';
import '../styles/Signup.css';

const RecruiterSignup = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    position: '',
    phone: '',
    companyId: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/public/companies');
      setCompanies(response.data);
    } catch (err) {
      console.error('Error fetching companies:', err);
      setError('Failed to load companies. Please try again later.');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await axios.post('http://localhost:8080/api/auth/recruiter/register', formData);
      console.log('Registration successful:', response.data);
      setSuccess(true);
      
      setTimeout(() => {
        navigate('/login');
      }, 1700);
      
    } catch (err) {
      setError(err.response?.data || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="signup-container">
      <div className="signup-card recruiter-signup">
        <div className="signup-header">
          <div className="logo">
            <span className="logo-icon">🏢</span>
            <h2>Recruiter Registration</h2>
          </div>
          <p className="subtitle">Register your company and find top talent</p>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && (
          <div className="success-message">
            ✅ Account created successfully! Redirecting to login...
          </div>
        )}

        <form onSubmit={handleSubmit} className="signup-form">
          <div className="form-row">
            <div className="form-group">
              <label>First Name *</label>
              <input
                type="text"
                name="firstName"
                placeholder="Enter first name"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Last Name *</label>
              <input
                type="text"
                name="lastName"
                placeholder="Enter last name"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              name="email"
              placeholder="Enter work email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password *</label>
            <input
              type="password"
              name="password"
              placeholder="Create password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Position / Job Title</label>
            <input
              type="text"
              name="position"
              placeholder="e.g., HR Manager, Talent Acquisition"
              value={formData.position}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              name="phone"
              placeholder="Enter phone number"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Select Company *</label>
            <select name="companyId" value={formData.companyId} onChange={handleChange} required>
              <option value="">Select your company</option>
              {companies.map(company => (
                <option key={company.id} value={company.id}>
                  {company.name} - {company.city}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="signup-btn" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Recruiter Account'}
          </button>
        </form>

        <div className="signup-footer">
          <p>Already have an account? <Link to="/login">Sign In</Link></p>
        </div>
      </div>
    </div>
  );
};

export default RecruiterSignup;