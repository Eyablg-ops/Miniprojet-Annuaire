import React from 'react';
import '../styles/OfferCard.css';

export default function OfferCard({ offer, onDetail, onApply, hasApplied, onApplicationSuccess }) {
    const skills = offer.requiredSkills
        ? offer.requiredSkills.split(',').map(s => s.trim()).filter(Boolean)
        : [];

    const handleApply = () => {
        if (!hasApplied) {
            onApply(offer);
        }
    };

    return (  
        <div className={`oc-card ${hasApplied ? 'applied' : ''}`}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div className="oc-header">
                    <span className="oc-type">{offer.type || 'Stage'}</span>
                    <span className={`oc-status oc-status-${(offer.status || '').toLowerCase()}`}>
                        {offer.status || 'UNKNOWN'}
                    </span>
                </div>
                <div className="oc-title">{offer.title}</div>
                <div className="oc-company">🏢 {offer.company?.name || 'Entreprise inconnue'}</div>
                
                <hr className="oc-divider" />

                <div className="oc-meta">
                    <div className="oc-meta-item"><span className="oc-meta-icon">📂</span> {offer.domain || '-'}</div>
                    <div className="oc-meta-item"><span className="oc-meta-icon">📍</span>{offer.location || '-'}</div>
                    <div className="oc-meta-item"><span className="oc-meta-icon">📅</span>{offer.duration ? `${offer.duration} mois` : '-'}</div>
                </div>

                <div className="oc-desc">{offer.description || 'Aucune description disponible'}</div>

                <div className="oc-skills">
                    {skills.length > 0 ? (
                        <>
                            <span className="oc-skill-label">Compétences :</span>
                            {skills.slice(0, 2).map(s => <span key={s} className="oc-skill-chip">{s}</span>)}
                        </>
                    ) : (
                        <span className="oc-skill-label">—</span>
                    )}
                </div>
            </div>

            <div className="oc-actions">
                <button className="oc-btn oc-btn-outline" onClick={() => onDetail(offer)}>Voir détails</button>
                <button 
                    className={`oc-btn oc-btn-primary ${hasApplied ? 'disabled' : ''}`}
                    onClick={handleApply}
                    disabled={hasApplied}
                >
                    {hasApplied ? '✓ Déjà postulé' : 'Postuler'}
                </button>
            </div>
        </div>
    );
}