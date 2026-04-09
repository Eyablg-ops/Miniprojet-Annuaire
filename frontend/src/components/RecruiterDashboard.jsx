import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from '../ui/Loading';
import OffersTab       from './Offerstab';
import ApplicationsTab from './Applicationstab';
import StatsTab        from './Statstab';
import AnnuairePage    from './Annuairepage';
import '../styles/Dashboard.css';
import '../styles/Recruiterdashboard.css';
import CompanyProfileTab from './CompanyProfileTab';
const TABS = [
  { key: 'profile',      label: '🏢 Mon Profil'       },
  { key: 'offers',       label: '📋 Mes Offres'       },
  { key: 'applications', label: '📥 Candidatures'      },
  { key: 'stats',        label: '📊 Statistiques'      },
  { key: 'annuaire',     label: '🏢 Annuaire Sociétés' },
];

const RecruiterDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser]           = useState(null);
  const [loading, setLoading]     = useState(true);
  const [activeTab, setActiveTab] = useState('offers');

  useEffect(() => {
    const userType = localStorage.getItem('userType');
    const email    = localStorage.getItem('email');
    if (!userType || userType !== 'RECRUITER') { navigate('/login'); return; }
    setTimeout(() => { setUser({ email }); setLoading(false); }, 1000);
  }, [navigate]);

  const handleLogout = () => { localStorage.clear(); navigate('/'); };

  if (loading) return <Loading />;

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <div className="nav-brand">
          <span className="brand-icon">🏢</span>
          <span className="brand-name">Recruiter Portal</span>
        </div>
        <div className="nav-tabs">
          {TABS.map(tab => (
            <button key={tab.key}
              className={`nav-item ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}>
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
        {activeTab === 'offers'       && <OffersTab />}
        {activeTab === 'applications' && <ApplicationsTab />}
        {activeTab === 'stats'        && <StatsTab />}
        {activeTab === 'annuaire'     && <AnnuairePage />}
        {activeTab === 'profile' && <CompanyProfileTab />}
      </div>
    </div>
  );
};

export default RecruiterDashboard;