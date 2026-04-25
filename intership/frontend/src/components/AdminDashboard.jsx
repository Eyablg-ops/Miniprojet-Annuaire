import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from '../ui/Loading';
import AnnuairePage from './Annuairepage';
import '../styles/AdminDashboard.css';

import { getCompanies, deleteCompany, getCompanyStats } from '../services/api';
import { getUsers, updateUserStatus, deleteUser, getUserStats } from '../services/admin.service';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  const [companies, setCompanies] = useState([]);
  const [users, setUsers] = useState([]);
  const [offers, setOffers] = useState([]);
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({});
  const [userStats, setUserStats] = useState({});

  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [showAppModal, setShowAppModal] = useState(false);

  useEffect(() => {
    const userType = localStorage.getItem('userType');
    const email = localStorage.getItem('email');

    if (!userType || userType !== 'ADMIN') {
      navigate('/login');
      return;
    }

    setAdmin({ email, userType });
    loadData();
  }, [navigate]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [companiesRes, statsRes, usersRes, userStatsRes, offersRes, applicationsRes] = await Promise.all([
        getCompanies(),
        getCompanyStats(),
        getUsers(),
        getUserStats(),
        getAllOffers(),
        getAllApplications()
      ]);

      setCompanies(companiesRes.data);
      setStats(statsRes.data);
      setUsers(usersRes.data);
      setUserStats(userStatsRes.data);
      setOffers(offersRes.data);
      setApplications(applicationsRes.data);

      const currentAdminEmail = localStorage.getItem('email');
      const currentAdminUser = usersRes.data.find(
        (user) => user.email === currentAdminEmail && user.userType === 'ADMIN'
      );
      if (currentAdminUser) {
        setAdmin(currentAdminUser);
      }
    } catch (err) {
      console.error(err);
      alert('Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  // API calls for offers and applications
const getAllOffers = async () => {
  try {
    const response = await fetch('http://localhost:8080/api/offers/public');
    const data = await response.json();
    return { data: Array.isArray(data) ? data : [] };
  } catch (error) {
    console.error('Error fetching offers:', error);
    return { data: [] };
  }
};

const getAllApplications = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:8080/api/postulations/all', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    return { data: Array.isArray(data) ? data : [] };
  } catch (error) {
    console.error('Error fetching applications:', error);
    return { data: [] };
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

  const handleDeleteOffer = async (id) => {
    if (!window.confirm('Supprimer cette offre de stage ?')) return;

    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:8080/api/offers/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      alert('Offre supprimée');
      loadData();
    } catch {
      alert('Erreur lors de la suppression');
    }
  };

  const handleToggleUserStatus = async (userId, currentStatus) => {
    if (userId === admin?.id) {
      alert('Vous ne pouvez pas modifier votre propre statut.');
      return;
    }
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
    if (userId === admin?.id) {
      alert('Vous ne pouvez pas supprimer votre propre compte administrateur.');
      return;
    }
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

  const handleViewOfferDetails = (offer) => {
    setSelectedOffer(offer);
    setShowOfferModal(true);
  };

  const handleViewApplicationDetails = (app) => {
    setSelectedApplication(app);
    setShowAppModal(true);
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
      case 'ENSEIGNANT': return 'role-enseignant';
      default: return '';
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'ADMIN': return '👑 Administrateur';
      case 'RECRUITER': return '🏢 Recruteur';
      case 'STUDENT': return '🎓 Étudiant';
      case 'ENSEIGNANT': return '📚 Enseignant';
      default: return role;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return <span className="status-pending">En attente</span>;
      case 'ACCEPTED':
        return <span className="status-accepted">Acceptée</span>;
      case 'REJECTED':
        return <span className="status-rejected">Rejetée</span>;
      case 'REVIEWED':
        return <span className="status-reviewed">Relue</span>;
      default:
        return <span className="status-pending">{status || 'En attente'}</span>;
    }
  };

  const renderDashboardHome = () => (
  <>
    <div className="admin-hero-card">
      <div>
        <div className="admin-hero-title">
          Bonjour {admin?.email?.split('@')[0] || 'Admin'} 👋
        </div>
        <div className="admin-hero-subtitle">
          Bienvenue sur votre tableau de bord administrateur. Gérez les entreprises, 
          les utilisateurs et supervisez l'ensemble de la plateforme.
        </div>
        <div className="admin-badges">
          <span className="admin-badge">👑 Super Admin</span>
          <span className="admin-badge">📊 Gestion globale</span>
          <span className="admin-badge">🔐 Accès total</span>
        </div>
      </div>

      <div className="admin-stats-mini">
        <div className="admin-stat-mini">
          <div className="admin-stat-mini-value">{stats?.total || 0}</div>
          <div className="admin-stat-mini-label">Entreprises</div>
        </div>
        <div className="admin-stat-mini">
          <div className="admin-stat-mini-value">{userStats?.total || 0}</div>
          <div className="admin-stat-mini-label">Utilisateurs</div>
        </div>
        <div className="admin-stat-mini">
          <div className="admin-stat-mini-value">{offers?.length || 0}</div>
          <div className="admin-stat-mini-label">Offres</div>
        </div>
        <div className="admin-stat-mini">
          <div className="admin-stat-mini-value">{applications?.length || 0}</div>
          <div className="admin-stat-mini-label">Candidatures</div>
        </div>
      </div>
    </div>

    <div className="admin-grid">
      <div className="admin-section-card" onClick={() => setActiveTab('companies')}>
        <div className="admin-section-icon">🏢</div>
        <h3>Gestion des entreprises</h3>
        <p>Consultez, modifiez et supprimez les entreprises partenaires.</p>
        <div className="admin-section-link">Accéder →</div>
      </div>

      <div className="admin-section-card" onClick={() => setActiveTab('users')}>
        <div className="admin-section-icon">👥</div>
        <h3>Gestion des utilisateurs</h3>
        <p>Activez, désactivez ou supprimez les comptes utilisateurs.</p>
        <div className="admin-section-link">Accéder →</div>
      </div>

      <div className="admin-section-card" onClick={() => setActiveTab('offers')}>
        <div className="admin-section-icon">📋</div>
        <h3>Gestion des offres</h3>
        <p>Consultez toutes les offres de stage publiées.</p>
        <div className="admin-section-link">Accéder →</div>
      </div>

      <div className="admin-section-card" onClick={() => setActiveTab('applications')}>
        <div className="admin-section-icon">📥</div>
        <h3>Gestion des candidatures</h3>
        <p>Consultez toutes les candidatures des étudiants.</p>
        <div className="admin-section-link">Accéder →</div>
      </div>

      <div className="admin-section-card" onClick={() => setActiveTab('annuaire')}>
        <div className="admin-section-icon">📚</div>
        <h3>Annuaire des entreprises</h3>
        <p>Consultez l'annuaire complet des entreprises tunisiennes.</p>
        <div className="admin-section-link">Accéder →</div>
      </div>
    </div>
  </>
);

  const renderCompaniesTab = () => (
    <>
      <div className="sd-page-header">
        <h1 className="sd-page-title">🏢 Gestion des entreprises</h1>
        <p className="sd-page-sub">Consultez et gérez toutes les entreprises inscrites sur la plateforme</p>
      </div>

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
      </div>

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
              <p><strong>Services:</strong> {company.services ? company.services.split(',').slice(0, 2).join(', ') : '-'}</p>
            </div>
            <div className="action-buttons">
              <button className="action-btn act" onClick={() => window.open(company.website, '_blank')}>🌐 Site web</button>
              <button className="action-btn delete" onClick={() => handleDeleteCompany(company.id)}>🗑️ Supprimer</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  const renderOffersTab = () => (
  <>
    <div className="sd-page-header">
      <h1 className="sd-page-title">📋 Gestion des offres de stage</h1>
      <p className="sd-page-sub">Consultez toutes les offres de stage publiées sur la plateforme</p>
    </div>

    <div className="offers-stats">
      <div className="stat-box">
        <div className="stat-icon">📋</div>
        <h3>{offers?.length || 0}</h3>
        <p>Total offres</p>
      </div>
      <div className="stat-box">
        <div className="stat-icon">🏢</div>
        <h3>{new Set(offers?.map(o => o.company?.id)).size || 0}</h3>
        <p>Entreprises</p>
      </div>
    </div>

    <div className="offers-table-container">
      <table className="offers-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Titre</th>
            <th>Entreprise</th>
            <th>Domaine</th>
            <th>Type</th>
            <th>Localisation</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {offers?.length > 0 ? (
            offers.map((offer) => (
              <tr key={offer.id}>
                <td>{offer.id}</td>
                <td>{offer.title}</td>
                <td>{offer.company?.name || 'N/A'}</td>
                <td>{offer.domain || '-'}</td>
                <td>{offer.type || '-'}</td>
                <td>{offer.location || '-'}</td>
                <td><span className={`offer-status ${offer.status?.toLowerCase() || 'open'}`}>{offer.status || 'OPEN'}</span></td>
                <td className="actions-cell">
                  <button className="action-btn-small view" onClick={() => handleViewOfferDetails(offer)}>👁️</button>
                  <button className="action-btn-small delete" onClick={() => handleDeleteOffer(offer.id)}>🗑️</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" style={{ textAlign: 'center', padding: '40px' }}>
                Aucune offre trouvée
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>

    {showOfferModal && selectedOffer && (
      <div className="modal-overlay" onClick={() => setShowOfferModal(false)}>
        <div className="modal-content offer-modal" onClick={(e) => e.stopPropagation()}>
          <h2>{selectedOffer.title}</h2>
          <div className="offer-details">
            <p><strong>Entreprise:</strong> {selectedOffer.company?.name}</p>
            <p><strong>Localisation:</strong> {selectedOffer.location || 'Non spécifiée'}</p>
            <p><strong>Type de stage:</strong> {selectedOffer.type || 'Non spécifié'}</p>
            <p><strong>Durée:</strong> {selectedOffer.duration || 'Non spécifiée'} mois</p>
            <p><strong>Domaine:</strong> {selectedOffer.domain || 'Non spécifié'}</p>
            <p><strong>Description:</strong></p>
            <p className="offer-description">{selectedOffer.description}</p>
            <p><strong>Compétences requises:</strong></p>
            <div className="skills-tags">
              {selectedOffer.requiredSkills?.split(',').map((skill, i) => (
                <span key={i} className="skill-tag">{skill.trim()}</span>
              ))}
            </div>
          </div>
          <div className="modal-actions">
            <button className="close-btn" onClick={() => setShowOfferModal(false)}>Fermer</button>
          </div>
        </div>
      </div>
    )}
  </>
);

  const renderApplicationsTab = () => (
  <>
    <div className="sd-page-header">
      <h1 className="sd-page-title">📥 Gestion des candidatures</h1>
      <p className="sd-page-sub">Consultez toutes les candidatures des étudiants</p>
    </div>

    <div className="applications-stats">
      <div className="stat-box">
        <div className="stat-icon">📥</div>
        <h3>{applications?.length || 0}</h3>
        <p>Total candidatures</p>
      </div>
      <div className="stat-box">
        <div className="stat-icon">⏳</div>
        <h3>{applications?.filter(a => a.status === 'PENDING').length || 0}</h3>
        <p>En attente</p>
      </div>
      <div className="stat-box">
        <div className="stat-icon">✅</div>
        <h3>{applications?.filter(a => a.status === 'ACCEPTED').length || 0}</h3>
        <p>Acceptées</p>
      </div>
      <div className="stat-box">
        <div className="stat-icon">❌</div>
        <h3>{applications?.filter(a => a.status === 'REJECTED').length || 0}</h3>
        <p>Rejetées</p>
      </div>
    </div>

    <div className="applications-table-container">
      <table className="applications-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Étudiant</th>
            <th>Offre</th>
            <th>Entreprise</th>
            <th>Date</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {applications?.length > 0 ? (
            applications.map((app) => (
              <tr key={app.id}>
                <td>{app.id}</td>
                <td>
                  <strong>{app.studentFirstName} {app.studentLastName}</strong>
                  <br/>
                  <small>{app.studentEmail}</small>
                </td>
                <td>{app.offerTitle}</td>
                <td>{app.companyName}</td>
                <td>{new Date(app.appliedAt).toLocaleDateString()}</td>
                <td>{getStatusBadge(app.status)}</td>
                <td className="actions-cell">
                  <button className="action-btn-small view" onClick={() => handleViewApplicationDetails(app)}>👁️</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>
                Aucune candidature trouvée
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>

    {showAppModal && selectedApplication && (
      <div className="modal-overlay" onClick={() => setShowAppModal(false)}>
        <div className="modal-content application-modal" onClick={(e) => e.stopPropagation()}>
          <h2>Détails de la candidature</h2>
          <div className="application-details">
            <p><strong>Étudiant:</strong> {selectedApplication.studentFirstName} {selectedApplication.studentLastName}</p>
            <p><strong>Email:</strong> {selectedApplication.studentEmail}</p>
            <p><strong>Filière:</strong> {selectedApplication.studentMajor || 'Non renseignée'}</p>
            <p><strong>Université:</strong> {selectedApplication.studentUniversity || 'Non renseignée'}</p>
            <hr />
            <p><strong>Offre:</strong> {selectedApplication.offerTitle}</p>
            <p><strong>Entreprise:</strong> {selectedApplication.companyName}</p>
            <p><strong>Localisation:</strong> {selectedApplication.offerLocation || 'Non spécifiée'}</p>
            <p><strong>Date de candidature:</strong> {new Date(selectedApplication.appliedAt).toLocaleString()}</p>
            <p><strong>Statut:</strong> {getStatusBadge(selectedApplication.status)}</p>
            {selectedApplication.coverLetter && (
              <>
                <p><strong>Lettre de motivation:</strong></p>
                <p className="cover-letter-text">{selectedApplication.coverLetter}</p>
              </>
            )}
            {selectedApplication.studentSkills && selectedApplication.studentSkills.length > 0 && (
              <>
                <p><strong>Compétences de l'étudiant:</strong></p>
                <div className="skills-tags">
                  {selectedApplication.studentSkills.map((skill, i) => (
                    <span key={i} className="skill-tag">{skill.skillName} ({skill.skillLevel})</span>
                  ))}
                </div>
              </>
            )}
          </div>
          <div className="modal-actions">
            <button className="close-btn" onClick={() => setShowAppModal(false)}>Fermer</button>
          </div>
        </div>
      </div>
    )}
  </>
);

  const renderUsersTab = () => (
    <>
      <div className="sd-page-header">
        <h1 className="sd-page-title">👥 Gestion des utilisateurs</h1>
        <p className="sd-page-sub">Consultez et gérez tous les utilisateurs inscrits sur la plateforme</p>
      </div>

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

      <div className="users-table-container">
        <h3>Liste des utilisateurs</h3>
        <table className="users-table">
          <thead>
            <tr><th>ID</th><th>Email</th><th>Rôle</th><th>Statut</th><th>Date création</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.email}</td>
                <td><span className={`role-badge ${getRoleBadgeClass(user.userType)}`}>{getRoleLabel(user.userType)}</span></td>
                <td><span className={`status-badge ${user.active ? 'active' : 'inactive'}`}>{user.active ? 'Actif' : 'Inactif'}</span></td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td className="actions-cell">
                  <button className="action-btn-small view" onClick={() => handleViewUserDetails(user)}>👁️</button>
                  <button className={`action-btn-small ${user.active ? 'disable' : 'enable'}`} onClick={() => handleToggleUserStatus(user.id, user.active ? 'ACTIVE' : 'INACTIVE')}>{user.active ? '🔒' : '🔓'}</button>
                  {user.id !== admin?.id ? <button className="action-btn-small delete" onClick={() => handleDeleteUser(user.id)}>🗑️</button> : <span className="self-label">Vous</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showUserModal && selectedUser && (
        <div className="modal-overlay" onClick={() => setShowUserModal(false)}>
          <div className="modal-content user-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Détails de l'utilisateur</h2>
            <div className="user-details">
              <div className="detail-row"><strong>ID:</strong> <span>{selectedUser.id}</span></div>
              <div className="detail-row"><strong>Email:</strong> <span>{selectedUser.email}</span></div>
              <div className="detail-row"><strong>Rôle:</strong> <span>{getRoleLabel(selectedUser.userType)}</span></div>
              <div className="detail-row"><strong>Statut:</strong> <span className={`status-badge ${selectedUser.active ? 'active' : 'inactive'}`}>{selectedUser.active ? 'Actif' : 'Inactif'}</span></div>
              <div className="detail-row"><strong>Date de création:</strong> <span>{new Date(selectedUser.createdAt).toLocaleString()}</span></div>
            </div>
            {(selectedUser.userType === 'STUDENT' && selectedUser.student) && (
              <div className="user-extra-details"><h3>Informations étudiant</h3>
                <div className="detail-row"><strong>Nom complet:</strong> <span>{selectedUser.student.firstName} {selectedUser.student.lastName}</span></div>
                <div className="detail-row"><strong>Filière:</strong> <span>{selectedUser.student.major || 'Non renseigné'}</span></div>
                <div className="detail-row"><strong>Université:</strong> <span>{selectedUser.student.university || 'Non renseigné'}</span></div>
              </div>
            )}
            {(selectedUser.userType === 'RECRUITER' && selectedUser.recruiter) && (
              <div className="user-extra-details"><h3>Informations recruteur</h3>
                <div className="detail-row"><strong>Nom complet:</strong> <span>{selectedUser.recruiter.firstName} {selectedUser.recruiter.lastName}</span></div>
                <div className="detail-row"><strong>Poste:</strong> <span>{selectedUser.recruiter.position || 'Non renseigné'}</span></div>
                <div className="detail-row"><strong>Entreprise:</strong> <span>{selectedUser.recruiter.company?.name || 'Non renseigné'}</span></div>
              </div>
            )}
            {selectedUser.userType === 'ENSEIGNANT' && selectedUser.enseignant && (
              <div className="user-extra-details"><h3>Informations enseignant</h3>
                <div className="detail-row"><strong>Nom complet:</strong> <span>{selectedUser.enseignant.firstName} {selectedUser.enseignant.lastName}</span></div>
                <div className="detail-row"><strong>Matière:</strong> <span>{selectedUser.enseignant.subject || 'Non renseigné'}</span></div>
                <div className="detail-row"><strong>Université:</strong> <span>{selectedUser.enseignant.university || 'Non renseigné'}</span></div>
              </div>
            )}
            <div className="modal-actions"><button className="close-btn" onClick={() => setShowUserModal(false)}>Fermer</button></div>
          </div>
        </div>
      )}
    </>
  );

  const renderAnnuaireTab = () => (
    <>
      <div className="sd-page-header">
        <h1 className="sd-page-title">📋 Annuaire des entreprises</h1>
        <p className="sd-page-sub">Consultez l'annuaire complet des entreprises tunisiennes</p>
      </div>
      <AnnuairePage />
    </>
  );

  if (loading) return <Loading />;

  return (
    <div className="admin-dashboard-page">
      <div className="admin-dashboard-shell">
        <div className="admin-topbar">
          <div className="admin-brand"><div className="admin-brand-icon">👑</div><div className="admin-brand-text">Admin Portal</div></div>
          <div className="admin-topbar-right"><span className="admin-user-email">{admin?.email}</span><button className="admin-logout-btn" onClick={handleLogout}>Logout</button></div>
        </div>

        <div className="admin-layout">
          <aside className="admin-sidebar">
            <div className="admin-profile-summary">
              <div className="admin-avatar-circle"><span>👑</span></div>
              <div className="admin-full-name">{admin?.email?.split('@')[0] || 'Administrateur'}</div>
              <div className="admin-mini-text">Super Administrateur</div>
              <div className="admin-mini-text">ISSAT Sousse</div>
            </div>
            <div className="admin-menu">
              <button className={`admin-menu-btn ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>📊 Dashboard</button>
              <button className={`admin-menu-btn ${activeTab === 'companies' ? 'active' : ''}`} onClick={() => setActiveTab('companies')}>🏢 Entreprises</button>
              <button className={`admin-menu-btn ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>👥 Utilisateurs</button>
              <button className={`admin-menu-btn ${activeTab === 'offers' ? 'active' : ''}`} onClick={() => setActiveTab('offers')}>📋 Offres</button>
              <button className={`admin-menu-btn ${activeTab === 'applications' ? 'active' : ''}`} onClick={() => setActiveTab('applications')}>📥 Candidatures</button>
              <button className={`admin-menu-btn ${activeTab === 'annuaire' ? 'active' : ''}`} onClick={() => setActiveTab('annuaire')}>📚 Annuaire</button>
            </div>
          </aside>

          <main className="admin-main">
            {activeTab === 'dashboard' && renderDashboardHome()}
            {activeTab === 'companies' && renderCompaniesTab()}
            {activeTab === 'users' && renderUsersTab()}
            {activeTab === 'offers' && renderOffersTab()}
            {activeTab === 'applications' && renderApplicationsTab()}
            {activeTab === 'annuaire' && renderAnnuaireTab()}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;