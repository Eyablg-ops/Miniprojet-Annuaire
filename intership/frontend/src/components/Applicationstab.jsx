import React, { useState, useEffect, useRef } from 'react';
import {
  getOffersByCompany,
  getApplicationsByOffer,
  updateApplicationStatus,
} from '../services/api';
import '../styles/Applicationstab.css';

const STATUS_OPTIONS = ['PENDING', 'ACCEPTED', 'REJECTED'];

const STATUS_CONFIG = {
  PENDING:  { label: 'En attente', icon: '⏳', className: 'pending',  color: '#e65100', bg: '#fff3e0', border: '#ffcc80' },
  ACCEPTED: { label: 'Acceptée',   icon: '✅', className: 'accepted', color: '#2e7d32', bg: '#e8f5e9', border: '#a5d6a7' },
  REJECTED: { label: 'Rejetée',    icon: '❌', className: 'rejected', color: '#c62828', bg: '#ffebee', border: '#ef9a9a' },
};

const cvBase = 'http://localhost:8080/api/postulations/fichier/';

/* ─── Custom Dropdown Component ─── */
const StatusDropdown = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const current = STATUS_CONFIG[value] || STATUS_CONFIG.PENDING;

  // Fermer si clic extérieur
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const select = (key) => {
    onChange(key);
    setOpen(false);
  };

  return (
    <div className="status-dropdown" ref={ref}>
      {/* Trigger */}
      <button
        className={`status-trigger status-trigger--${current.className}`}
        onClick={() => setOpen(o => !o)}
        type="button"
      >
        <span className="status-trigger__icon">{current.icon}</span>
        <span className="status-trigger__label">{current.label}</span>
        <span className={`status-trigger__chevron ${open ? 'open' : ''}`}>▾</span>
      </button>

      {/* Panel */}
      {open && (
        <div className="status-panel">
          <div className="status-panel__header">Changer le statut</div>
          {STATUS_OPTIONS.map(key => {
            const cfg = STATUS_CONFIG[key];
            const isActive = key === value;
            return (
              <button
                key={key}
                className={`status-option ${isActive ? 'status-option--active' : ''}`}
                onClick={() => select(key)}
                type="button"
                style={{ '--opt-color': cfg.color, '--opt-bg': cfg.bg, '--opt-border': cfg.border }}
              >
                <span className="status-option__dot" />
                <span className="status-option__icon">{cfg.icon}</span>
                <span className="status-option__label">{cfg.label}</span>
                {isActive && <span className="status-option__check">✓</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

/* ─── Offer Dropdown Component ─── */
const OfferDropdown = ({ offers, value, onChange }) => {
  const [open, setOpen]     = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef(null);

  const selected = offers.find(o => String(o.id) === String(value));

  const filtered = offers.filter(o =>
    o.title.toLowerCase().includes(search.toLowerCase()) ||
    (o.type || '').toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const select = (id) => {
    onChange(String(id));
    setOpen(false);
    setSearch('');
  };

  const clear = (e) => {
    e.stopPropagation();
    onChange('');
  };

  return (
    <div className="offer-selector" ref={ref}>
      <span className="offer-selector__label">📋 Filtrer par offre</span>

      {/* Trigger */}
      <button
        className={`offer-trigger ${open ? 'offer-trigger--open' : ''}`}
        onClick={() => setOpen(o => !o)}
        type="button"
      >
        {selected ? (
          <>
            <span className="offer-trigger__title">{selected.title}</span>
            <span className="offer-trigger__type">{selected.type}</span>
            <span className="offer-trigger__clear" onClick={clear}>✕</span>
          </>
        ) : (
          <span className="offer-trigger__placeholder">— Choisir une offre —</span>
        )}
        <span className={`offer-trigger__chevron ${open ? 'open' : ''}`}>▾</span>
      </button>

      {/* Panel */}
      {open && (
        <div className="offer-panel">
          {/* Recherche */}
          <div className="offer-panel__search-wrap">
            <span className="offer-panel__search-icon">🔍</span>
            <input
              className="offer-panel__search"
              type="text"
              placeholder="Rechercher une offre..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              autoFocus
            />
          </div>

          {/* Liste */}
          <div className="offer-panel__list">
            {filtered.length === 0 ? (
              <div className="offer-panel__empty">Aucune offre trouvée</div>
            ) : (
              filtered.map(offer => (
                <button
                  key={offer.id}
                  className={`offer-option ${String(offer.id) === String(value) ? 'offer-option--active' : ''}`}
                  onClick={() => select(offer.id)}
                  type="button"
                >
                  <div className="offer-option__left">
                    <span className="offer-option__title">{offer.title}</span>
                    <span className="offer-option__meta">
                      {offer.location && <span>📍 {offer.location}</span>}
                    </span>
                  </div>
                  <div className="offer-option__right">
                    <span className={`offer-option__badge offer-option__badge--${(offer.status || '').toLowerCase()}`}>
                      {offer.type}
                    </span>
                    {String(offer.id) === String(value) && (
                      <span className="offer-option__check">✓</span>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

/* ─── Main Component ─── */
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
    setLoading(true); setError('');
    try {
      const res = await getApplicationsByOffer(offerId);
      setApplications(res.data);
    } catch {
      setError('Erreur lors du chargement des candidatures');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (appId, newStatus) => {
    setError(''); setSuccess('');
    try {
      await updateApplicationStatus(appId, newStatus);
      setSuccess(`Statut mis à jour : ${STATUS_CONFIG[newStatus]?.label}`);
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
        <OfferDropdown
          offers={offers}
          value={selectedOffer}
          onChange={setSelectedOffer}
        />
      )}

      {!selectedOffer ? (
        <div className="empty-state">
          <span>👆</span>
          <p>Sélectionnez une offre pour afficher les candidatures reçues</p>
        </div>
      ) : loading ? (
        <p className="loading-text">Chargement des candidatures...</p>
      ) : applications.length === 0 ? (
        <div className="empty-state">
          <span>📭</span>
          <p>Aucune candidature reçue pour cette offre</p>
        </div>
      ) : (
        <>
          <p className="applications-count">
            {applications.length} candidature{applications.length > 1 ? 's' : ''} reçue{applications.length > 1 ? 's' : ''}
          </p>

          <div className="applications-list">
            {applications.map(app => {
              const statusCfg = STATUS_CONFIG[app.status] || STATUS_CONFIG.PENDING;
              const initials  = (app.studentFirstName?.[0] ?? '') + (app.studentLastName?.[0] ?? '');

              return (
                <div key={app.id} className="application-card">

                  {/* Zone 1 : identité */}
                  <div className="applicant-info">
                    <div className="applicant-avatar">
                      {initials || '#' + app.studentId}
                    </div>
                    <div className="applicant-details">
                      <h3>
                        {app.studentFirstName && app.studentLastName
                          ? `${app.studentFirstName} ${app.studentLastName}`
                          : `Étudiant #${app.studentId}`}
                      </h3>
                      {app.studentEmail && (
                        <p className="applicant-meta">✉️ {app.studentEmail}</p>
                      )}
                      {app.studentEducationLevel && (
                        <p className="applicant-meta">
                          🎓 {app.studentEducationLevel}
                          {app.studentMajor      ? ` · ${app.studentMajor}`      : ''}
                          {app.studentUniversity ? ` · ${app.studentUniversity}` : ''}
                        </p>
                      )}
                      {app.studentPhone && (
                        <p className="applicant-meta">📞 {app.studentPhone}</p>
                      )}
                      {app.studentSkills?.length > 0 && (
                        <div className="applicant-skills">
                          {app.studentSkills.slice(0, 4).map(s => (
                            <span key={s.id} className="skill-tag">{s.skillName}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Zone 2 : lettre + CV */}
                  {app.coverLetter && (
                    <div className="cover-letter">
                      <strong>Lettre de motivation</strong>
                      <p>{app.coverLetter}</p>
                    </div>
                  )}
                  {app.cvUrl && (
                    <div className="cv-link">
                      <a href={cvBase + app.cvUrl} target="_blank" rel="noreferrer">
                        📄 Voir le CV joint
                      </a>
                    </div>
                  )}

                  {/* Zone 3 : footer date + dropdown statut */}
                  <div className="application-footer">
                    <span className="applied-date">
                      📅 Postulé le {app.appliedAt
                        ? new Date(app.appliedAt).toLocaleDateString('fr-FR', {
                            day: '2-digit', month: 'long', year: 'numeric'
                          })
                        : '—'}
                    </span>
                    <div className="status-controls">
                      <StatusDropdown
                        value={app.status || 'PENDING'}
                        onChange={(newStatus) => handleStatusChange(app.id, newStatus)}
                      />
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default ApplicationsTab;