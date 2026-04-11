import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from '../ui/Loading';
import '../styles/AdminDashboard.css';

import { getCompanies, deleteCompany, getCompanyStats } from '../services/api';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  const [companies, setCompanies] = useState([]);
  const [stats, setStats] = useState({});

  useEffect(() => {
    const userType = localStorage.getItem('userType');
    const email = localStorage.getItem('email');

    if (!userType || userType !== 'ADMIN') {
      navigate('/login');
      return;
    }

    setAdmin({ email });
    loadData();
  }, [navigate]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [companiesRes, statsRes] = await Promise.all([
        getCompanies(),
        getCompanyStats()
      ]);

      setCompanies(companiesRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error(err);
      alert('Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };
  

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cette entreprise ?')) return;

    try {
      await deleteCompany(id);
      alert('Entreprise supprimée');
      loadData();
    } catch {
      alert('Erreur lors de la suppression');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  if (loading) return <Loading />;

  return (
    <div className="dashboard-container admin-dashboard">

      {/* NAVBAR */}
      <nav className="dashboard-nav">
        <div className="nav-brand">
          <span className="brand-icon">👑</span>
          <span className="brand-name">Admin Portal</span>
        </div>

        <div className="nav-user">
          <span className="user-email">{admin?.email}</span>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      {/* MAIN */}
      <div className="dashboard-main">

        {/* ───── STATS ───── */}
        <div className="stats-grid">

          <div className="stat-box">
            <div className="stat-icon">🏢</div>
            <h3>{stats.total || 0}</h3>
            <p>Total Entreprises</p>
          </div>

          <div className="stat-box">
            <div className="stat-icon">✅</div>
            <h3>
              {companies.filter(c => c.status === 'ACTIVE').length}
            </h3>
            <p>Actives</p>
          </div>

          <div className="stat-box">
            <div className="stat-icon">📍</div>
            <h3>
              {new Set(companies.map(c => c.city)).size}
            </h3>
            <p>Villes couvertes</p>
          </div>

          <div className="stat-box">
            <div className="stat-icon">🌐</div>
            <h3>TechBehemoths</h3>
            <p>Source</p>
          </div>

        </div>

        {/* ───── ACTIONS ───── */}
        <div className="quick-actions">
          <h3>Actions rapides</h3>
          <div className="action-buttons">
            <button className="action-btn" onClick={loadData}>
              🔄 Actualiser
            </button>
          </div>
        </div>

        {/* ───── COMPANIES ───── */}
        <div className="companies-grid">

          {companies.map((company) => (
            <div className="company-card" key={company.id}>

              <div className="company-header">
                <h3>{company.name}</h3>
                <span className={`company-status ${company.status.toLowerCase()}`}>
                  {company.status}
                </span>
              </div>

              <div className="company-details">
                <p><strong>Ville:</strong> {company.city}</p>

                <p>
                  <strong>Services:</strong>{' '}
                  {company.services
                    ? company.services.split(',').slice(0, 2).join(', ')
                    : '-'}
                </p>
              </div>

              <div className="action-buttons">
                <button className="action-btn">
                  ✏️ Modifier
                </button>

                <button
                  className="action-btn"
                  style={{ background: '#f44336' }}
                  onClick={() => handleDelete(company.id)}
                >
                  🗑️ Supprimer
                </button>
              </div>

            </div>
          ))}

        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;