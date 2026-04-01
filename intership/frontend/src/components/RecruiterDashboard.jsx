import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from '../ui/Loading';
import '../styles/Dashboard.css';

const RecruiterDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading,setLoading] = useState(true);

  useEffect(() => {
    const userType = localStorage.getItem('userType');
    const email = localStorage.getItem('email');
    
    if (!userType || userType !== 'RECRUITER') {
      navigate('/login');
      return;
    }

    setTimeout(() => {
      setUser({ email });
      setLoading(false);
    }, 1000);
  }, [navigate]);


  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <div className="nav-brand">
          <span className="brand-icon">🏢</span>
          <span className="brand-name">Recruiter Portal</span>
        </div>
        <div className="nav-user">
          <span className="user-email">{user?.email}</span>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>
      
      <div className="dashboard-main">
        
      </div>
    </div>
  );
};

export default RecruiterDashboard;