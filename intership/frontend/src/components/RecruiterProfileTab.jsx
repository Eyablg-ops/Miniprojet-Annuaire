// src/components/RecruiterProfileTab.jsx
import React, { useState, useEffect } from 'react';
import { getRecruiterProfile } from '../services/api';

const RecruiterProfileTab = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await getRecruiterProfile();
      setProfile(res.data);
      // Mettre à jour companyId dans localStorage si pas déjà fait
      if (res.data?.company?.id) {
        localStorage.setItem('companyId', res.data.company.id);
      }
    } catch (err) {
      setError('Erreur lors du chargement du profil');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p style={{ padding: '2rem', color: '#888' }}>Chargement...</p>;
  if (error)   return <div className="error-message">{error}</div>;
  if (!profile) return null;

  const { firstName, lastName, position, phone, isVerified, company } = profile;

  return (
    <div style={{ padding: '2rem', maxWidth: '800px' }}>
      <h2 style={{ marginBottom: '1.5rem', color: '#333' }}>👤 Mon Profil Recruteur</h2>

      {/* ── Infos recruteur ── */}
      <div className="dashboard-content" style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ color: '#667eea', marginBottom: '1rem' }}>Informations personnelles</h3>
        <div className="form-row">
          <div className="form-group">
            <label>Prénom</label>
            <input type="text" value={firstName || ''} readOnly />
          </div>
          <div className="form-group">
            <label>Nom</label>
            <input type="text" value={lastName || ''} readOnly />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Poste</label>
            <input type="text" value={position || ''} readOnly />
          </div>
          <div className="form-group">
            <label>Téléphone</label>
            <input type="text" value={phone || ''} readOnly />
          </div>
        </div>
        <p style={{ fontSize: '0.85rem', color: isVerified ? '#388e3c' : '#f57c00' }}>
          {isVerified ? '✅ Compte vérifié' : '⏳ En attente de vérification'}
        </p>
      </div>

      {/* ── Infos company ── */}
      {company && (
        <div className="dashboard-content">
          <h3 style={{ color: '#667eea', marginBottom: '1rem' }}>🏢 Mon Entreprise</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Nom</label>
              <input type="text" value={company.name || ''} readOnly />
            </div>
            <div className="form-group">
              <label>Ville</label>
              <input type="text" value={company.city || ''} readOnly />
            </div>
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea rows={3} value={company.description || ''} readOnly style={{
              width: '100%', padding: '0.75rem', border: '1px solid #e0e0e0',
              borderRadius: '8px', resize: 'none'
            }} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Site web</label>
              <input type="text" value={company.website || ''} readOnly />
            </div>
            <div className="form-group">
              <label>Statut</label>
              <input type="text" value={company.status || ''} readOnly />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecruiterProfileTab;