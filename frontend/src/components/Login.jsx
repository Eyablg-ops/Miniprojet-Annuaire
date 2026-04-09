import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import '../styles/Login.css';

const Login = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const [formData, setFormData]         = useState({ email: '', password: '' });
  const [error, setError]               = useState('');
  const [loading, setLoading]           = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);

  useEffect(() => {
    if (location.state?.fromSignup) {
      setSignupSuccess(true);
      setTimeout(() => setSignupSuccess(false), 3000);
    }
  }, [location]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  try {
    const response = await axios.post('http://localhost:8080/api/auth/login', formData);
    const { token, userType, userId, email } = response.data;

    localStorage.setItem('token',    token);
    localStorage.setItem('userType', userType);
    localStorage.setItem('userId',   userId);
    localStorage.setItem('email',    email);

   if (userType === 'RECRUITER') {
  try {
    const recruiterRes = await axios.get(
      'http://localhost:8080/api/recruiters/me',
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log('✅ RECRUITER DATA:', JSON.stringify(recruiterRes.data));
    const cId = recruiterRes.data?.company?.id;
    if (cId) {
      localStorage.setItem('companyId', String(cId));
      console.log('✅ companyId sauvegardé:', cId);
    } else {
      console.warn('⚠️ company.id est null:', recruiterRes.data);
    }
  } catch (err) {
    // ← AFFICHE L'ERREUR DANS LA PAGE pour la voir
    console.error('❌ ERREUR getMe status:', err.response?.status);
    console.error('❌ ERREUR getMe data:', err.response?.data);
    console.error('❌ ERREUR getMe message:', err.message);
    alert('Erreur getMe: ' + err.response?.status + ' - ' + JSON.stringify(err.response?.data));
  }
}

    // ── Navigation APRÈS tout ──────────────────────────
    if (userType === 'STUDENT')   navigate('/student/dashboard');
    if (userType === 'RECRUITER') navigate('/recruiter/dashboard');
    if (userType === 'ADMIN')     navigate('/admin/dashboard');

  } catch (err) {
    console.error('Erreur login:', err);
    const data = err.response?.data;
    setError(typeof data === 'string' ? data : 'Email ou mot de passe incorrect');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="logo">
            <span className="logo-icon">🔐</span>
            <h2>Welcome Back</h2>
          </div>
          <p className="subtitle">Sign in to continue your journey</p>
        </div>

        {signupSuccess && (
          <div className="success-message">
            ✅ Account created successfully! Please sign in.
          </div>
        )}

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Email Address</label>
            <div className="input-icon">
              <span>📧</span>
              <input
                type="email" name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange} required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-icon">
              <span>🔒</span>
              <input
                type="password" name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange} required
              />
            </div>
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="login-footer">
          <p>Don't have an account?</p>
          <div className="signup-options">
            <Link to="/signup/student"   className="signup-link student">Sign up as Student</Link>
            <span className="separator">or</span>
            <Link to="/signup/recruiter" className="signup-link recruiter">Sign up as Recruiter</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;