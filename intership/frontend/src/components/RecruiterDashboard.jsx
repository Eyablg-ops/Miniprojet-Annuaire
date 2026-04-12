import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from '../ui/Loading';
import OffersTab       from './Offerstab';
import ApplicationsTab from './Applicationstab';
import StatsTab        from './Statstab';
import AnnuairePage    from './Annuairepage';
import CompanyProfileTab from './CompanyProfileTab';
import CompanyStudentRecommendations from './recommendation/CompanyStudentRecommendations';
import '../styles/Dashboard.css';
import '../styles/Recruiterdashboard.css';

const TABS = [
  { key: 'profile',         label: '🏢 Mon Profil'       },
  { key: 'offers',          label: '📋 Mes Offres'       },
  { key: 'applications',    label: '📥 Candidatures'     },
  { key: 'stats',           label: '📊 Statistiques'     },
  { key: 'annuaire',        label: '🏢 Annuaire Sociétés' },
  { key: 'recommendations', label: '🎯 AI Talent Finder'  },
];

const RecruiterDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser]           = useState(null);
  const [loading, setLoading]     = useState(true);
  const [activeTab, setActiveTab] = useState('offers');
  const [companyId, setCompanyId] = useState(null);

  useEffect(() => {
    const userType = localStorage.getItem('userType');
    const email    = localStorage.getItem('email');
    const storedCompanyId = localStorage.getItem('companyId');
    
    if (!userType || userType !== 'RECRUITER') { 
      navigate('/login'); 
      return; 
    }
    
    // Get company ID from localStorage
    if (storedCompanyId) {
      setCompanyId(storedCompanyId);
      console.log('Company ID loaded:', storedCompanyId);
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

  // Debug component to show company ID
  const DebugInfo = () => (
    <div style={{
      position: 'fixed',
      bottom: 10,
      right: 10,
      background: '#f0f0f0',
      padding: '8px 12px',
      borderRadius: '8px',
      fontSize: '11px',
      zIndex: 9999,
      fontFamily: 'monospace',
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
    }}>
      <div><strong>Company ID:</strong> {companyId || 'Not set'}</div>
      <div><strong>Active Tab:</strong> {activeTab}</div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'offers':
        return <OffersTab />;
      case 'applications':
        return <ApplicationsTab />;
      case 'stats':
        return <StatsTab />;
      case 'annuaire':
        return <AnnuairePage />;
      case 'profile':
        return <CompanyProfileTab />;
      case 'recommendations':
        if (!companyId) {
          return (
            <div className="dashboard-content">
              <div className="empty-state">
                <p>Loading company information...</p>
                <button 
                  className="retry-btn" 
                  onClick={() => {
                    const id = localStorage.getItem('companyId');
                    setCompanyId(id);
                  }}
                  style={{ marginTop: '1rem' }}
                >
                  Retry
                </button>
              </div>
            </div>
          );
        }
        return <CompanyStudentRecommendations companyId={companyId} />;
      default:
        return <OffersTab />;
    }
  };

  if (loading) return <Loading />;

  return (
    <>
      <DebugInfo />
      <div className="dashboard-container">
        <nav className="dashboard-nav">
          <div className="nav-brand">
            <span className="brand-icon">🏢</span>
            <span className="brand-name">Recruiter Portal</span>
          </div>
          <div className="nav-tabs">
            {TABS.map(tab => (
              <button
                key={tab.key}
                className={`nav-item ${activeTab === tab.key ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="nav-user">
            <span className="user-email">{user?.email}</span>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        </nav>

        <div className="dashboard-main">
          {renderContent()}
        </div>
      </div>
    </>
  );
};

export default RecruiterDashboard;