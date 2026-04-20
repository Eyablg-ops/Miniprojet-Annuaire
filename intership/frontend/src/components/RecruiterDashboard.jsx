import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from '../ui/Loading';
import OffersTab       from './Offerstab';
import ApplicationsTab from './Applicationstab';
import StatsTab        from './Statstab';
import CompanyProfileTab from './CompanyProfileTab';
import CompanyStudentRecommendations from './recommendation/CompanyStudentRecommendations';
import '../styles/Recruiterdashboard.css';

const TABS = [
  { key: 'profile',         label: '🏢 Mon Profil'        },
  { key: 'offers',          label: '📋 Mes Offres'        },
  { key: 'applications',    label: '📥 Candidatures'      },
  { key: 'stats',           label: '📊 Statistiques'      },
  { key: 'recommendations', label: '🎯 AI Talent Finder'  },
];

const RecruiterDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser]           = useState(null);
  const [loading, setLoading]     = useState(true);
  const [activeTab, setActiveTab] = useState('stats');
  const [companyId, setCompanyId] = useState(null);

  useEffect(() => {
    const userType        = localStorage.getItem('userType');
    const email           = localStorage.getItem('email');
    const storedCompanyId = localStorage.getItem('companyId');

    if (!userType || userType !== 'RECRUITER') {
      navigate('/login');
      return;
    }

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

  const renderContent = () => {
    switch (activeTab) {
      case 'offers':        return <OffersTab />;
      case 'applications':  return <ApplicationsTab />;
      case 'stats':         return <StatsTab />;
      case 'profile':       return <CompanyProfileTab />;
      case 'recommendations':
        if (!companyId) {
          return (
            <div className="applications-tab">
              <div className="empty-state">
                <span>⏳</span>
                <p>Chargement des informations entreprise...</p>
                <button
                  className="retry-btn"
                  onClick={() => setCompanyId(localStorage.getItem('companyId'))}
                  style={{ marginTop: '1rem' }}
                >
                  Réessayer
                </button>
              </div>
            </div>
          );
        }
        return <CompanyStudentRecommendations companyId={companyId} />;
      default:
        return <StatsTab />;
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="dashboard-container">

      {/* SIDEBAR VERTICALE */}
      <nav className="dashboard-nav">

        {/* Logo / Brand */}
        <div className="nav-brand">
          <span className="brand-icon">🏢</span>
          <span className="brand-name">Recruiter Portal</span>
        </div>

        {/* Onglets verticaux */}
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

        {/* Utilisateur + Déconnexion */}
        <div className="nav-user">
          <span className="user-email">{user?.email}</span>
          <button className="logout-btn" onClick={handleLogout}>
            🚪 Déconnexion
          </button>
        </div>

      </nav>

      {/* CONTENU PRINCIPAL */}
      <div className="dashboard-main">
        {renderContent()}
      </div>

    </div>
  );
};

export default RecruiterDashboard;