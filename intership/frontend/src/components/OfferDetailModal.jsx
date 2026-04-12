import React from 'react';

export default function OfferDetailModal({ offer, onClose, onApply }) {
  if (!offer) return null;

  const skills = offer.requiredSkills
    ? offer.requiredSkills.split(',').map(s => s.trim()).filter(Boolean)
    : [];

  const fmt = (dt) => dt
    ? new Date(dt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })
    : '—';

  return (
    <div className="sd-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="sd-modal sd-modal-md">

        <div className="sd-modal-header">
          <div className="sd-modal-accent" />
          <div className="sd-modal-badges">
            <span className="sd-modal-badge sd-modal-badge-purple">{offer.type || 'Stage'}</span>
            {offer.status === 'PUBLIEE' && (
              <span className="sd-modal-badge sd-modal-badge-green">✓ Offre ouverte</span>
            )}
          </div>
          <div className="sd-modal-title">{offer.title}</div>
          <div className="sd-modal-meta">
           {offer.company?.name && <span className="sd-modal-meta-item">🏢 {offer.company?.name}</span>}
            {offer.location           && <span className="sd-modal-meta-item">📍 {offer.location}</span>}
          </div>
        </div>

        <div className="sd-modal-body">
          <div className="sd-metrics">
            {[
              { label: 'Domaine',  value: offer.domain },
              { label: 'Durée',    value: offer.duration ? `${offer.duration} mois` : null },
            
            
            ].map(({ label, value }) => (
              <div key={label} className="sd-metric">
                <div className="sd-metric-label">{label}</div>
                <div className="sd-metric-value">{value || '—'}</div>
              </div>
            ))}
          </div>

          <div className="sd-modal-section-title">Description</div>
          <div className="sd-modal-desc">
            {offer.description || 'Aucune description disponible.'}
          </div>

          {skills.length > 0 && (
            <>
              <div className="sd-modal-section-title">Compétences requises</div>
              <div className="sd-modal-skills">
                {skills.map(s => <span key={s} className="sd-modal-skill">{s}</span>)}
              </div>
            </>
          )}

          <div className="sd-modal-footer">
            <button className="sd-modal-btn sd-modal-btn-cancel" onClick={onClose}>Fermer</button>
            <button className="sd-modal-btn sd-modal-btn-primary" onClick={() => onApply(offer)}>
              ✉ Postuler à cette offre
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}