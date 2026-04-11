import React, { useState, useEffect } from 'react';
import {
  getOffersByCompany,
  getApplicationsByOffer,
  updateApplicationStatus,
} from '../services/api';
import '../styles/Applicationstab.css';

const STATUS_OPTIONS = ['PENDING', 'ACCEPTED', 'REJECTED'];

const STATUS_LABELS = {
  PENDING:  { label: 'En attente', className: 'pending'  },
  ACCEPTED: { label: 'Acceptée',   className: 'accepted' },
  REJECTED: { label: 'Rejetée',    className: 'rejected' },
};

const cvBase = 'http://localhost:8080/api/postulations/fichier/';

const ApplicationsTab = () => {
  const companyId = localStorage.getItem('companyId');
  const [offers,        setOffers]        = useState([]);
  const [selectedOffer, setSelectedOffer] = useState('');
  const [applications,  setApplications]  = useState([]);
  const [loading,       setLoading]       = useState(false);
  const [error,         setError]         = useState('');
  const [success,       setSuccess]       = useState('');

  useEffect(() => { if (companyId) loadOffers(); }, [companyId]);
  useEffect(() => { if (selectedOffer) loadApplications(selectedOffer); }, [selectedOffer]);

  const loadOffers = async () => {
    try {
      const res = await getOffersByCompany(companyId);
      setOffers(res.data);
    } catch {
      setError('Erreur lors du chargement des offres');
    }
  };

  const loadApplications = async (offerId) => {
    setLoading(true);
    setError('');
    try {
      const res = await getApplicationsByOffer(offerId);
      console.log('APPLICATIONS:', res.data);
      setApplications(res.data);
    } catch {
      setError('Erreur lors du chargement des candidatures');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (appId, newStatus) => {
    setError('');
    setSuccess('');
    try {
      await updateApplicationStatus(appId, newStatus);
      setSuccess('Statut mis à jour : ' + STATUS_LABELS[newStatus]?.label);
      setApplications(prev =>
        prev.map(a => a.id === appId ? { ...a, status: newStatus } : a)
      );
    } catch {
      setError('Erreur lors de la mise à jour du statut');
    }
  };

  return (
    <div className="applications-tab">
      <div className="tab-header">
        <h2>📥 Candidatures Reçues</h2>
      </div>

      {error   && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {!companyId && (
        <div className="warning-box">
          ⚠️ Connectez-vous en tant que recruteur pour voir les candidatures.
        </div>
      )}

      {companyId && (
        <div className="offer-selector">
          <label>Sélectionner une offre :</label>
          <select
            value={selectedOffer}
            onChange={(e) => setSelectedOffer(e.target.value)}
            className="offer-select"
          >
            <option value="">-- Choisir une offre --</option>
            {offers.map(offer => (
              <option key={offer.id} value={offer.id}>
                {offer.title} ({offer.type})
              </option>
            ))}
          </select>
        </div>
      )}

      {!selectedOffer ? (
        <div className="empty-state">
          <span>👆</span>
          <p>Sélectionnez une offre pour voir ses candidatures</p>
        </div>
      ) : loading ? (
        <p className="loading-text">Chargement des candidatures...</p>
      ) : applications.length === 0 ? (
        <div className="empty-state">
          <span>📭</span>
          <p>Aucune candidature reçue pour cette offre</p>
        </div>
      ) : (
        <div className="applications-list">
          <p className="applications-count">
            {applications.length} candidature(s) reçue(s)
          </p>

          {applications.map(app => {
            const statusInfo = STATUS_LABELS[app.status] || STATUS_LABELS.PENDING;
            const initials   = (app.studentFirstName?.[0] ?? '') +
                               (app.studentLastName?.[0]  ?? '');

            return (
              <div key={app.id} className="application-card">

                {/* ── Infos étudiant ── */}
                <div className="applicant-info">
                  <div className="applicant-avatar">
                    {initials || '#' + app.studentId}
                  </div>
                  <div className="applicant-details">
                    <h3>
                      {app.studentFirstName && app.studentLastName
                        ? app.studentFirstName + ' ' + app.studentLastName
                        : 'Étudiant #' + app.studentId}
                    </h3>
                    {app.studentEmail && (
                      <p className="applicant-meta">✉️ {app.studentEmail}</p>
                    )}
                    {app.studentEducationLevel && (
                      <p className="applicant-meta">
                        🎓 {app.studentEducationLevel}
                        {app.studentMajor      ? ' · ' + app.studentMajor      : ''}
                        {app.studentUniversity ? ' · ' + app.studentUniversity : ''}
                      </p>
                    )}
                    {app.studentPhone && (
                      <p className="applicant-meta">📞 {app.studentPhone}</p>
                    )}
                    {app.studentSkills && app.studentSkills.length > 0 && (
                      <div className="applicant-skills">
                        {app.studentSkills.slice(0, 4).map(s => (
                          <span key={s.id} className="skill-tag">{s.skillName}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* ── Lettre de motivation ── */}
                {app.coverLetter && (
                  <div className="cover-letter">
                    <strong>Lettre de motivation :</strong>
                    <p>{app.coverLetter}</p>
                  </div>
                )}

                {/* ── CV joint ── */}
                {app.cvUrl && (
                  <div className="cv-link" style={{ margin: '8px 0' }}>
                    <a href={cvBase + app.cvUrl} target="_blank" rel="noreferrer">
                      📄 Voir le CV joint
                    </a>
                  </div>
                )}

                {/* ── Footer statut ── */}
                <div className="application-footer">
                  <span className="applied-date">
                    📅 Postulé le : {app.appliedAt
                      ? new Date(app.appliedAt).toLocaleDateString('fr-FR')
                      : '—'}
                  </span>
                  <div className="status-controls">
                    <span className={'status-badge ' + statusInfo.className}>
                      {statusInfo.label}
                    </span>
                    <select
                      value={app.status}
                      onChange={(e) => handleStatusChange(app.id, e.target.value)}
                      className="status-select"
                    >
                      {STATUS_OPTIONS.map(s => (
                        <option key={s} value={s}>{STATUS_LABELS[s]?.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ApplicationsTab;