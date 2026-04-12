import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from '../ui/Loading';
import '../styles/AdminDashboard.css';

import { getCompanies, deleteCompany, getCompanyStats } from '../services/api';
import { getUsers, updateUserStatus, deleteUser, getUserStats } from '../services/admin.service';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('companies'); // 'companies' or 'users'

  const [companies, setCompanies] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({});
  const [userStats, setUserStats] = useState({});

  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);

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
      const [companiesRes, statsRes, usersRes, userStatsRes] = await Promise.all([
        getCompanies(),
        getCompanyStats(),
        getUsers(),
        getUserStats()
      ]);

      setCompanies(companiesRes.data);
      setStats(statsRes.data);
      setUsers(usersRes.data);
      setUserStats(userStatsRes.data);
    } catch (err) {
      console.error(err);
      alert('Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCompany = async (id) => {
    if (!window.confirm('Supprimer cette entreprise ?')) return;

    try {
      await deleteCompany(id);
      alert('Entreprise supprimée');
      loadData();
    } catch {
      alert('Erreur lors de la suppression');
    }
  };

  const handleToggleUserStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    const action = newStatus === 'ACTIVE' ? 'activer' : 'désactiver';
    
    if (!window.confirm(`Voulez-vous ${action} cet utilisateur ?`)) return;

    try {
      await updateUserStatus(userId, newStatus);
      alert(`Utilisateur ${action} avec succès`);
      loadData();
    } catch {
      alert('Erreur lors de la modification');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Supprimer définitivement cet utilisateur ? Cette action est irréversible.')) return;

    try {
      await deleteUser(userId);
      alert('Utilisateur supprimé');
      loadData();
    } catch {
      alert('Erreur lors de la suppression');
    }
  };

  const handleViewUserDetails = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'ADMIN': return 'role-admin';
      case 'RECRUITER': return 'role-recruiter';
      case 'STUDENT': return 'role-student';
      default: return '';
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'ADMIN': return '👑 Administrateur';
      case 'RECRUITER': return '🏢 Recruteur';
      case 'STUDENT': return '🎓 Étudiant';
      default: return role;
    }
  };

  const renderCompaniesTab = () => (
    <>
      {/* STATS */}
      <div className="stats-grid">
        <div className="stat-box">
          <div className="stat-icon">🏢</div>
          <h3>{stats.total || 0}</h3>
          <p>Total Entreprises</p>
        </div>

        <div className="stat-box">
          <div className="stat-icon">✅</div>
          <h3>{companies.filter(c => c.status === 'ACTIVE').length}</h3>
          <p>Actives</p>
        </div>

        <div className="stat-box">
          <div className="stat-icon">📍</div>
          <h3>{new Set(companies.map(c => c.city)).size}</h3>
          <p>Villes couvertes</p>
        </div>

        <div className="stat-box">
          <div className="stat-icon">🌐</div>
          <h3>TechBehemoths</h3>
          <p>Source</p>
        </div>
      </div>

      {/* COMPANIES GRID */}
      <div className="companies-grid">
        {companies.map((company) => (
          <div className="company-card" key={company.id}>
            <div className="company-header">
              <h3>{company.name}</h3>
              <span className={`company-status ${company.status?.toLowerCase() || 'active'}`}>
                {company.status || 'ACTIVE'}
              </span>
            </div>

            <div className="company-details">
              <p><strong>Ville:</strong> {company.city || 'N/A'}</p>
              <p><strong>Pays:</strong> {company.country || 'N/A'}</p>
              <p>
                <strong>Services:</strong>{' '}
                {company.services
                  ? company.services.split(',').slice(0, 2).join(', ')
                  : '-'}
              </p>
            </div>

            <div className="action-buttons">
              <button className="action-btn" onClick={() => window.open(company.website, '_blank')}>
                🌐 Site web
              </button>
              <button
                className="action-btn delete"
                onClick={() => handleDeleteCompany(company.id)}
              >
                🗑️ Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  const renderUsersTab = () => (
    <>
      {/* USER STATS */}
      <div className="stats-grid">
        <div className="stat-box">
          <div className="stat-icon">👥</div>
          <h3>{userStats.total || 0}</h3>
          <p>Total Utilisateurs</p>
        </div>

        <div className="stat-box">
          <div className="stat-icon">🎓</div>
          <h3>{userStats.students || 0}</h3>
          <p>Étudiants</p>
        </div>

        <div className="stat-box">
          <div className="stat-icon">🏢</div>
          <h3>{userStats.recruiters || 0}</h3>
          <p>Recruteurs</p>
        </div>

        <div className="stat-box">
          <div className="stat-icon">✅</div>
          <h3>{userStats.active || 0}</h3>
          <p>Comptes actifs</p>
        </div>
      </div>

      {/* USERS TABLE */}
      <div className="users-table-container">
        <h3>Gestion des utilisateurs</h3>
        <table className="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Rôle</th>
              <th>Statut</th>
              <th>Date création</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`role-badge ${getRoleBadgeClass(user.userType)}`}>
                    {getRoleLabel(user.userType)}
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${user.active ? 'active' : 'inactive'}`}>
                    {user.active ? 'Actif' : 'Inactif'}
                  </span>
                </td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td className="actions-cell">
                  <button
                    className="action-btn-small view"
                    onClick={() => handleViewUserDetails(user)}
                    title="Voir détails"
                  >
                    👁️
                  </button>
                  <button
                    className={`action-btn-small ${user.active ? 'disable' : 'enable'}`}
                    onClick={() => handleToggleUserStatus(user.id, user.active ? 'ACTIVE' : 'INACTIVE')}
                    title={user.active ? 'Désactiver' : 'Activer'}
                  >
                    {user.active ? '🔒' : '🔓'}
                  </button>
                  <button
                    className="action-btn-small delete"
                    onClick={() => handleDeleteUser(user.id)}
                    title="Supprimer"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* USER DETAILS MODAL */}
      {showUserModal && selectedUser && (
        <div className="modal-overlay" onClick={() => setShowUserModal(false)}>
          <div className="modal-content user-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Détails de l'utilisateur</h2>
            
            <div className="user-details">
              <div className="detail-row">
                <strong>ID:</strong> <span>{selectedUser.id}</span>
              </div>
              <div className="detail-row">
                <strong>Email:</strong> <span>{selectedUser.email}</span>
              </div>
              <div className="detail-row">
                <strong>Rôle:</strong> <span>{getRoleLabel(selectedUser.userType)}</span>
              </div>
              <div className="detail-row">
                <strong>Statut:</strong> 
                <span className={`status-badge ${selectedUser.active ? 'active' : 'inactive'}`}>
                  {selectedUser.active ? 'Actif' : 'Inactif'}
                </span>
              </div>
              <div className="detail-row">
                <strong>Date de création:</strong> <span>{new Date(selectedUser.createdAt).toLocaleString()}</span>
              </div>
              <div className="detail-row">
                <strong>Dernière modification:</strong> <span>{new Date(selectedUser.updatedAt).toLocaleString()}</span>
              </div>
            </div>

            {selectedUser.userType === 'STUDENT' && selectedUser.student && (
              <div className="user-extra-details">
                <h3>Informations étudiant</h3>
                <div className="detail-row">
                  <strong>Nom complet:</strong> <span>{selectedUser.student.firstName} {selectedUser.student.lastName}</span>
                </div>
                <div className="detail-row">
                  <strong>Filière:</strong> <span>{selectedUser.student.major || 'Non renseigné'}</span>
                </div>
                <div className="detail-row">
                  <strong>Université:</strong> <span>{selectedUser.student.university || 'Non renseigné'}</span>
                </div>
              </div>
            )}

            {selectedUser.userType === 'RECRUITER' && selectedUser.recruiter && (
              <div className="user-extra-details">
                <h3>Informations recruteur</h3>
                <div className="detail-row">
                  <strong>Nom complet:</strong> <span>{selectedUser.recruiter.firstName} {selectedUser.recruiter.lastName}</span>
                </div>
                <div className="detail-row">
                  <strong>Poste:</strong> <span>{selectedUser.recruiter.position || 'Non renseigné'}</span>
                </div>
                <div className="detail-row">
                  <strong>Entreprise:</strong> <span>{selectedUser.recruiter.company?.name || 'Non renseigné'}</span>
                </div>
              </div>
            )}

            <div className="modal-actions">
              <button className="close-btn" onClick={() => setShowUserModal(false)}>Fermer</button>
            </div>
          </div>
        </div>
      )}
    </>
  );

  if (loading) return <Loading />;

  return (
    <div className="dashboard-container admin-dashboard">

      {/* NAVBAR */}
      <nav className="dashboard-nav">
        <div className="nav-brand">
          <span className="brand-icon">👑</span>
          <span className="brand-name">Admin Portal</span>
        </div>

        <div className="nav-tabs">
          <button
            className={`nav-tab ${activeTab === 'companies' ? 'active' : ''}`}
            onClick={() => setActiveTab('companies')}
          >
            🏢 Entreprises
          </button>
          <button
            className={`nav-tab ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            👥 Utilisateurs
          </button>
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

        {/* QUICK ACTIONS */}
        <div className="quick-actions">
          <h3>Actions rapides</h3>
          <div className="action-buttons">
            <button className="action-btn" onClick={loadData}>
              🔄 Actualiser
            </button>
          </div>
        </div>

        {/* CONTENT */}
        {activeTab === 'companies' && renderCompaniesTab()}
        {activeTab === 'users' && renderUsersTab()}

      </div>
    </div>
  );
};

export default AdminDashboard;