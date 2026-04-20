import React from 'react';
import '../styles/OfferDetailModal.css';

export default function OfferDetailModal({ offer, onClose, onApply }) {
  if (!offer) return null;

  const skills = offer.requiredSkills
    ? offer.requiredSkills.split(',').map(s => s.trim()).filter(Boolean)
    : [];

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-container modal-container-md">
        <div className="modal-header">
          <div className="modal-header-accent" />
          <div className="modal-header-content">
            <div className="modal-icon-wrapper">
              📋
            </div>
            <div className="modal-title-section">
              <div className="modal-badges">
                <span className="modal-badge modal-badge-primary">{offer.type || 'Stage'}</span>
                {offer.status === 'PUBLIEE' && (
                  <span className="modal-badge modal-badge-success">✓ Offre ouverte</span>
                )}
              </div>
              <div className="modal-title">{offer.title}</div>
              <div className="modal-subtitle">
                {offer.company?.name && `🏢 ${offer.company.name}`}
                {offer.company?.name && offer.location && ' • '}
                {offer.location && `📍 ${offer.location}`}
              </div>
            </div>
          </div>
        </div>

        <div className="modal-body modal-body-scroll">
          <div className="modal-metrics-grid">
            <div className="modal-metric-card">
              <div className="modal-metric-label">Domaine</div>
              <div className="modal-metric-value">{offer.domain || '—'}</div>
            </div>
            <div className="modal-metric-card">
              <div className="modal-metric-label">Durée</div>
              <div className="modal-metric-value">{offer.duration ? `${offer.duration} mois` : '—'}</div>
            </div>
            {offer.startDate && (
              <div className="modal-metric-card">
                <div className="modal-metric-label">Date de début</div>
                <div className="modal-metric-value">
                  {new Date(offer.startDate).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
                </div>
              </div>
            )}
          </div>

          <div className="modal-section">
            <div className="modal-section-title">Description du poste</div>
            <div className="modal-description">
              {offer.description || 'Aucune description disponible.'}
            </div>
          </div>

          {skills.length > 0 && (
            <div className="modal-section">
              <div className="modal-section-title">Compétences requises</div>
              <div className="modal-skills-list">
                {skills.map(skill => (
                  <span key={skill} className="modal-skill">{skill}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="modal-btn modal-btn-secondary" onClick={onClose}>
            Fermer
          </button>
          <button className="modal-btn modal-btn-primary" onClick={() => onApply(offer)}>
            ✉ Postuler
          </button>
        </div>
      </div>
    </div>
  );
}