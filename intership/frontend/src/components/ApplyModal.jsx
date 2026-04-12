import React, { useState, useEffect } from 'react';
import { applyToOffer } from '../services/api';

export default function ApplyModal({ offer, onClose }) {
  const [coverLetter, setCoverLetter] = useState('');
  const [cvFile, setCvFile]           = useState(null);
  const [drag, setDrag]               = useState(false);
  const [loading, setLoading]         = useState(false);
  const [success, setSuccess]         = useState(false);
  const [error, setError]             = useState('');

  const email  = localStorage.getItem('email')  || '';
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
    if (f && validateCv(f)) { setCvFile(f); setError(''); }
  };

  const handleDrop = (e) => {
    e.preventDefault(); setDrag(false);
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
    <div className="sd-overlay" onClick={(e) => e.target === e.currentTarget && handleClose()}>
      <div className="sd-modal sd-modal-sm">

        {/* ══════════ SUCCÈS ══════════ */}
        {success ? (
          <div className="sd-modal-body sd-success-banner">
            <div className="sd-success-icon">🎉</div>
            <div className="sd-success-title">Candidature envoyée !</div>
            <div className="sd-success-sub">
              Bonne chance pour <strong>{offer.title}</strong>
              {offer.company?.name ? ` chez ${offer.company.name}` : ''}.
            </div>
            {cvFile && (
              <div style={{
                marginTop: 12, fontSize: '.8rem', color: '#888',
                background: '#f5f3ff', padding: '6px 14px',
                borderRadius: 8, display: 'inline-block',
              }}>
                📄 CV joint : {cvFile.name}
              </div>
            )}
            <div style={{ marginTop: 20 }}>
              <button className="sd-modal-btn sd-modal-btn-primary"
                onClick={handleClose} style={{ minWidth: 120 }}>
                Fermer
              </button>
            </div>
          </div>

        ) : (
          <>
            {/* ── Header ── */}
            <div className="sd-modal-header">
              <div className="sd-modal-accent" />
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{
                  width: 38, height: 38, borderRadius: '50%',
                  background: '#ede9fe', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', fontSize: 16,
                }}>✉️</div>
                <div>
                  <div className="sd-modal-title" style={{ marginBottom: 2 }}>
                    Postuler à cette offre
                  </div>
                  <div style={{ fontSize: '.8rem', color: '#777' }}>
                    {offer.title}
                    {offer.company?.name ? ` — ${offer.company.name}` : ''}
                  </div>
                </div>
              </div>
            </div>

            {/* ── Body ── */}
            <div className="sd-modal-body">

              {/* Erreur */}
              {error && (
                <div style={{
                  background: '#fee2e2', color: '#b91c1c',
                  borderRadius: 8, padding: '8px 12px',
                  fontSize: '.82rem', marginBottom: 14,
                }}>
                  ⚠️ {error}
                </div>
              )}

              {/* Infos étudiant connecté — lecture seule */}
              <div style={{
                background: '#f5f3ff', borderRadius: 10,
                padding: '12px 14px', marginBottom: 16,
                border: '1px solid #ede9fe',
              }}>
                <div style={{
                  fontSize: '.68rem', fontWeight: 600, color: '#9e9e9e',
                  textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 8,
                }}>
                  Votre compte
                </div>
                <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ fontSize: '.7rem', color: '#aaa', marginBottom: 2 }}>Email</div>
                    <div style={{ fontSize: '.85rem', fontWeight: 500, color: '#333' }}>
                      {email || '—'}
                    </div>
                  </div>
                 
                </div>
              </div>

              {/* Récap offre */}
              <div style={{
                background: '#fafafa', borderRadius: 10,
                padding: '10px 14px', marginBottom: 16,
                border: '1px solid rgba(0,0,0,.06)',
              }}>
                <div style={{
                  fontSize: '.68rem', fontWeight: 600, color: '#9e9e9e',
                  textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 6,
                }}>
                  Offre sélectionnée
                </div>
                <div style={{ fontSize: '.88rem', fontWeight: 500, color: '#333', marginBottom: 5 }}>
                  {offer.title}
                </div>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  {offer.type     && <span style={{ fontSize: '.78rem', color: '#666' }}>📋 {offer.type}</span>}
                  {offer.domain   && <span style={{ fontSize: '.78rem', color: '#666' }}>📂 {offer.domain}</span>}
                  {offer.location && <span style={{ fontSize: '.78rem', color: '#666' }}>📍 {offer.location}</span>}
                  {offer.duration && <span style={{ fontSize: '.78rem', color: '#666' }}>⏱️ {offer.duration} mois</span>}
                </div>
              </div>

              {/* ── Upload CV ── */}
              <div style={{ marginBottom: 16 }}>
                <div className="sd-form-label" style={{ marginBottom: 6 }}>
                  📄 Joindre votre CV
                  <span className="sd-form-hint"> — PDF ou Word, max 5 Mo</span>
                </div>

                {cvFile ? (
                  <div className="sd-file-preview">
                    <div className="sd-file-info">
                      <span style={{ fontSize: 20 }}>📄</span>
                      <div>
                        <div className="sd-file-name">{cvFile.name}</div>
                        <div className="sd-file-size">
                          {(cvFile.size / 1024).toFixed(0)} Ko
                        </div>
                      </div>
                    </div>
                    <button className="sd-file-remove" onClick={() => setCvFile(null)}>
                      ✕ Retirer
                    </button>
                  </div>
                ) : (
                  <label
                    className={`sd-upload-zone ${drag ? 'drag-over' : ''}`}
                    onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
                    onDragLeave={() => setDrag(false)}
                    onDrop={handleDrop}
                  >
                    <div className="sd-upload-icon">📁</div>
                    <div className="sd-upload-text">
                      Glissez votre CV ici ou <span>parcourez</span>
                    </div>
                    <div className="sd-upload-hint">PDF, DOC, DOCX — max 5 Mo</div>
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

              {/* ── Lettre de motivation ── */}
              <div className="sd-form-group">
                <label className="sd-form-label">
                  Lettre de motivation
                  <span className="sd-form-hint"> (optionnelle)</span>
                </label>
                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  rows={4}
                  maxLength={1000}
                  placeholder="Expliquez pourquoi vous postulez à cette offre, vos motivations et compétences pertinentes..."
                />
                <div style={{
                  fontSize: '.72rem', color: '#bdbdbd',
                  textAlign: 'right', marginTop: 3,
                }}>
                  {coverLetter.length}/1000
                </div>
              </div>

             

              {/* ── Footer ── */}
              <div className="sd-modal-footer">
                <button className="sd-modal-btn sd-modal-btn-cancel"
                  onClick={handleClose} disabled={loading}>
                  Annuler
                </button>
                <button className="sd-modal-btn sd-modal-btn-primary"
                  onClick={handleSubmit} disabled={loading}>
                  {loading ? '⏳ Envoi...' : '✉️ Envoyer ma candidature'}
                </button>
              </div>

            </div>
          </>
        )}
      </div>
    </div>
  );
}