// ApplyModal.jsx (version améliorée)
import React, { useState, useEffect } from 'react';
import { applyToOffer } from '../services/api';

export default function ApplyModal({ offer, onClose }) {
  const [coverLetter, setCoverLetter] = useState('');
  const [cvFile, setCvFile] = useState(null);
  const [drag, setDrag] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const email = localStorage.getItem('email') || '';
  const userId = localStorage.getItem('userId') || '';

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') handleClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  if (!offer) return null;

  const validateCv = (f) => {
    const allowed = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (!allowed.includes(f.type)) {
      setError('Seuls les fichiers PDF ou Word sont acceptés.');
      return false;
    }
    if (f.size / 1024 / 1024 > 5) {
      setError('Le fichier ne doit pas dépasser 5 Mo.');
      return false;
    }
    return true;
  };

  const handleCvFile = (f) => {
    if (f && validateCv(f)) {
      setCvFile(f);
      setError('');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDrag(false);
    handleCvFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      await applyToOffer(offer.id, coverLetter.trim() || null, cvFile);
      setSuccess(true);
    } catch (err) {
      const data = err.response?.data;
      if (err.response?.status === 400) {
        setError(typeof data === 'string' ? data : 'Vous avez déjà postulé à cette offre.');
      } else {
        setError("Erreur lors de l'envoi. Veuillez réessayer.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setCoverLetter('');
    setCvFile(null);
    setSuccess(false);
    setError('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && !success && handleClose()}>
      <div className="modal-container modal-container-sm">
        <div className="modal-header">
          <div className="modal-header-accent" />
          <div className="modal-header-content">
            <div className="modal-icon-wrapper">
              ✉️
            </div>
            <div className="modal-title-section">
              <div className="modal-title">Postuler à cette offre</div>
              <div className="modal-subtitle">
                {offer.title}
                {offer.company?.name && ` — ${offer.company.name}`}
              </div>
            </div>
          </div>
        </div>

        {success ? (
          <>
            <div className="modal-body">
              <div className="modal-success">
                <div className="modal-success-icon">🎉</div>
                <div className="modal-success-title">Candidature envoyée !</div>
                <div className="modal-success-subtitle">
                  Bonne chance pour <strong>{offer.title}</strong>
                  {offer.company?.name ? ` chez ${offer.company.name}` : ''}.
                </div>
                {cvFile && (
                  <div className="modal-file-preview" style={{ marginTop: '1rem', textAlign: 'left' }}>
                    <div className="modal-file-info">
                      <span>📄</span>
                      <div>
                        <div className="modal-file-name">{cvFile.name}</div>
                        <div className="modal-file-size">{(cvFile.size / 1024).toFixed(0)} Ko</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button className="modal-btn modal-btn-primary" onClick={handleClose}>
                Fermer
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="modal-body modal-body-scroll">
              {error && <div className="modal-error">{error}</div>}

              <div className="modal-section">
                <div className="modal-section-title">Informations de candidature</div>
                <div className="modal-metric-card" style={{ marginBottom: '1rem' }}>
                  <div className="modal-metric-label">Email du candidat</div>
                  <div className="modal-metric-value">{email || '—'}</div>
                </div>
              </div>

              <div className="modal-section">
                <div className="modal-section-title">CV</div>
                {cvFile ? (
                  <div className="modal-file-preview">
                    <div className="modal-file-info">
                      <span style={{ fontSize: '1.25rem' }}>📄</span>
                      <div>
                        <div className="modal-file-name">{cvFile.name}</div>
                        <div className="modal-file-size">{(cvFile.size / 1024).toFixed(0)} Ko</div>
                      </div>
                    </div>
                    <button className="modal-file-remove" onClick={() => setCvFile(null)}>
                      ✕ Retirer
                    </button>
                  </div>
                ) : (
                  <label
                    className={`modal-upload-zone ${drag ? 'drag-over' : ''}`}
                    onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
                    onDragLeave={() => setDrag(false)}
                    onDrop={handleDrop}
                  >
                    <div className="modal-upload-icon">📁</div>
                    <div className="modal-upload-text">
                      Glissez votre CV ici ou <span>parcourez</span>
                    </div>
                    <div className="modal-upload-hint">PDF, DOC, DOCX — max 5 Mo</div>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        handleCvFile(e.target.files[0]);
                        e.target.value = '';
                      }}
                    />
                  </label>
                )}
              </div>

              <div className="modal-form-group">
                <label className="modal-form-label">
                  Lettre de motivation
                  <span className="modal-form-hint">(optionnelle)</span>
                </label>
                <textarea
                  className="modal-form-textarea"
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  maxLength={1000}
                  placeholder="Expliquez pourquoi vous postulez à cette offre, vos motivations et compétences pertinentes..."
                />
                <div style={{
                  fontSize: '0.6875rem',
                  color: '#94a3b8',
                  textAlign: 'right',
                  marginTop: '0.375rem'
                }}>
                  {coverLetter.length}/1000
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="modal-btn modal-btn-secondary" onClick={handleClose} disabled={loading}>
                Annuler
              </button>
              <button className="modal-btn modal-btn-primary" onClick={handleSubmit} disabled={loading}>
                {loading ? '⏳ Envoi...' : '✉️ Envoyer'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}