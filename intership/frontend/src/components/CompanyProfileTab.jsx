import React, { useState, useEffect } from 'react';
import { getRecruiterMe, updateCompanyProfile } from '../services/api';
import '../styles/CompanyProfile.css';

const emptyForm = {
  name: '', city: '', country: '', description: '',
  services: '', website: '', status: 'ACTIVE', source: '',
};

const statusBadgeClass = {
  ACTIVE:   'cp-badge cp-badge-active',
  INACTIVE: 'cp-badge cp-badge-inactive',
  PENDING:  'cp-badge cp-badge-pending',
};

/* ── Bloc info réutilisable ── */
const InfoCard = ({ icon, iconClass, label, value, isLink }) => (
  <div className="cp-info-card">
    <div className={`cp-info-icon ${iconClass}`}>{icon}</div>
    <div style={{ minWidth: 0 }}>
      <div className="cp-info-label">{label}</div>
      {isLink && value
        ? <a href={value} target="_blank" rel="noreferrer" className="cp-info-link">{value}</a>
        : <div className="cp-info-value">{value || '—'}</div>
      }
    </div>
  </div>
);

const CompanyProfileTab = () => {
  const [company,   setCompany]   = useState(null);
  const [recruiter, setRecruiter] = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [saving,    setSaving]    = useState(false);
  const [editing,   setEditing]   = useState(false);
  const [form,      setForm]      = useState(emptyForm);
  const [error,     setError]     = useState('');
  const [success,   setSuccess]   = useState('');

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true); setError('');
    try {
      const res = await getRecruiterMe();
      setRecruiter(res.data);
      setCompany(res.data?.company || null);
      if (res.data?.company?.id)
        localStorage.setItem('companyId', String(res.data.company.id));
    } catch {
      setError('Erreur lors du chargement du profil entreprise');
    } finally {
      setLoading(false);
    }
  };

  const startEditing = () => {
    setForm({
      name:        company?.name        || '',
      city:        company?.city        || '',
      country:     company?.country     || '',
      description: company?.description || '',
      services:    company?.services    || '',
      website:     company?.website     || '',
      status:      company?.status      || 'ACTIVE',
      source:      company?.source      || '',
    });
    setEditing(true); setError(''); setSuccess('');
  };

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true); setError(''); setSuccess('');
    try {
      await updateCompanyProfile(company?.id, form);
      setSuccess('Profil entreprise mis à jour avec succès');
      setEditing(false);
      loadData();
    } catch {
      setError('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const initials = company?.name
    ? company.name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
    : '?';

  const recruiterInitials = [recruiter?.firstName, recruiter?.lastName]
    .filter(Boolean).map(w => w[0]).join('').toUpperCase() || '?';

  const services = company?.services
    ? company.services.split(',').map(s => s.trim()).filter(Boolean)
    : [];

  /* ── Loading ── */
  if (loading) return (
    <div className="cp-shell">
      <div className="cp-hero">
        <div className="cp-cover" />
        <div style={{ padding: '52px 32px 24px' }}>
          {[60, 40, 80, 30].map((w, i) => (
            <div key={i} className="cp-skeleton-line" style={{ width: `${w}%` }} />
          ))}
        </div>
      </div>
    </div>
  );

  /* ════ MODE LECTURE ════ */
  if (!editing) return (
    <div className="cp-shell">
      {error   && <div className="cp-alert cp-alert-error">{error}</div>}
      {success && <div className="cp-alert cp-alert-success">{success}</div>}

      <div className="cp-hero">

        {/* Cover + avatar */}
        <div className="cp-cover">
          <div className="cp-cover-grid" />
          <div className="cp-cover-shine" />
          <div className="cp-avatar">
            {initials}
            <div className="cp-avatar-verified">✓</div>
          </div>
        </div>

        {/* Nom + badges + bouton */}
        <div className="cp-hero-body">
          <div className="cp-hero-top">
            <div>
              <div className="cp-company-name">{company?.name || '—'}</div>
              {(company?.city || company?.country) && (
                <div className="cp-tagline">
                  {[company.city, company.country].filter(Boolean).join(', ')}
                </div>
              )}
            </div>
            <div className="cp-badges-row">
              <span className={statusBadgeClass[company?.status] || 'cp-badge cp-badge-pending'}>
                <span className="cp-badge-dot" />
                {company?.status || '—'}
              </span>
              {company?.source && (
                <span className="cp-badge cp-badge-source">{company.source}</span>
              )}
              <button className="cp-edit-btn" onClick={startEditing}>✏ Modifier</button>
            </div>
          </div>

          {/* Meta : localisation + site */}
          <div className="cp-meta-row">
            {(company?.city || company?.country) && (
              <span className="cp-meta-item">
                📍 {[company.city, company.country].filter(Boolean).join(', ')}
              </span>
            )}
            {company?.website && (
              <a href={company.website} target="_blank" rel="noreferrer" className="cp-meta-link">
                🌐 {company.website}
              </a>
            )}
          </div>
        </div>

        {/* Stats */}
        <hr className="cp-divider cp-divider-mt" />
        <div className="cp-stat-row">
          <div className="cp-stat-box">
            <div className="cp-stat-num">{services.length}</div>
            <div className="cp-stat-lbl">Services</div>
          </div>
          <div className="cp-stat-box">
            <div className="cp-stat-num">—</div>
            <div className="cp-stat-lbl">Offres actives</div>
          </div>
          <div className="cp-stat-box">
            <div className="cp-stat-num">—</div>
            <div className="cp-stat-lbl">Candidatures</div>
          </div>
        </div>

        {/* À propos */}
        <hr className="cp-divider cp-divider-mt" />
        <div className="cp-section">
          <div className="cp-section-header">
            <div className="cp-section-dot" />
            <span className="cp-section-title">À propos</span>
          </div>
          <div className="cp-about-box">
            {company?.description || 'Aucune description renseignée.'}
          </div>
        </div>

        {/* Services */}
        <div className="cp-section-sm">
          <div className="cp-section-header">
            <div className="cp-section-dot" />
            <span className="cp-section-title">Services</span>
          </div>
          {services.length > 0
            ? <div className="cp-services-row">
                {services.map(s => <span key={s} className="cp-chip">{s}</span>)}
              </div>
            : <span className="cp-empty">Non renseigné</span>
          }
        </div>

        {/* Localisation + Web */}
        <hr className="cp-divider" />
        <div className="cp-section">
          <div className="cp-section-header">
            <div className="cp-section-dot" />
            <span className="cp-section-title">Coordonnées</span>
          </div>
          <div className="cp-info-grid">
            <InfoCard icon="🌍" iconClass="ic-purple" label="Pays"   value={company?.country} />
            <InfoCard icon="🏙" iconClass="ic-blue"   label="Ville"  value={company?.city}    />
            <InfoCard icon="📊" iconClass="ic-green"  label="Statut" value={company?.status}  />
            <InfoCard icon="🏷" iconClass="ic-amber"  label="Source" value={company?.source}  />
            <div className="cp-info-grid-full">
              <InfoCard icon="🌐" iconClass="ic-pink" label="Site web" value={company?.website} isLink />
            </div>
          </div>
        </div>

        {/* Recruteur */}
        <hr className="cp-divider" />
        <div className="cp-section">
          <div className="cp-section-header">
            <div className="cp-section-dot" />
            <span className="cp-section-title">Recruteur responsable</span>
          </div>
          <div className="cp-recruiter-card">
            <div className="cp-recruiter-avatar">{recruiterInitials}</div>
            <div>
              <div className="cp-recruiter-name">
                {[recruiter?.firstName, recruiter?.lastName].filter(Boolean).join(' ') || '—'}
              </div>
              <div className="cp-recruiter-email">{recruiter?.email || '—'}</div>
              <div className="cp-recruiter-role">Recruiter</div>
            </div>
            {(recruiter?.position || recruiter?.phone) && (
              <div className="cp-recruiter-extra">
                {recruiter?.position && <div className="cp-recruiter-pos">{recruiter.position}</div>}
                {recruiter?.phone    && <div className="cp-recruiter-phone">{recruiter.phone}</div>}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );

  /* ════ MODE ÉDITION ════ */
  return (
    <div className="cp-shell">
      {error   && <div className="cp-alert cp-alert-error">{error}</div>}
      {success && <div className="cp-alert cp-alert-success">{success}</div>}

      <div className="cp-hero">
        <div className="cp-edit-header">
          <div>
            <div className="cp-edit-title">Modifier le profil entreprise</div>
            <div className="cp-edit-sub">{company?.name}</div>
          </div>
          <div className="cp-edit-actions">
            <button className="cp-cancel-btn" onClick={() => setEditing(false)}>Annuler</button>
            <button className="cp-save-btn" onClick={handleSave} disabled={saving}>
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </div>

        <div className="cp-form-body">

          <div className="cp-form-sec-title">Identité</div>
          <div className="cp-form-row">
            <div className="cp-form-group">
              <label>Nom de l'entreprise *</label>
              <input name="name" value={form.name} onChange={handleChange}
                placeholder="Ex: TechCorp Tunisia" required />
            </div>
            <div className="cp-form-group">
              <label>Statut</label>
              <select name="status" value={form.status} onChange={handleChange}>
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
                <option value="PENDING">PENDING</option>
              </select>
            </div>
          </div>

          <hr className="cp-form-hr" />
          <div className="cp-form-sec-title">Localisation</div>
          <div className="cp-form-row">
            <div className="cp-form-group">
              <label>Ville</label>
              <input name="city" value={form.city} onChange={handleChange} placeholder="Ex: Tunis" />
            </div>
            <div className="cp-form-group">
              <label>Pays</label>
              <input name="country" value={form.country} onChange={handleChange} placeholder="Ex: Tunisia" />
            </div>
          </div>

          <hr className="cp-form-hr" />
          <div className="cp-form-sec-title">Web</div>
          <div className="cp-form-row">
            <div className="cp-form-group">
              <label>Site web</label>
              <input name="website" value={form.website} onChange={handleChange} placeholder="https://..." />
            </div>
            <div className="cp-form-group">
              <label>Source</label>
              <input name="source" value={form.source} onChange={handleChange} placeholder="Ex: techbehemoths" />
            </div>
          </div>

          <hr className="cp-form-hr" />
          <div className="cp-form-sec-title">À propos</div>
          <div className="cp-form-group">
            <label>Description</label>
            <textarea name="description" value={form.description} onChange={handleChange}
              rows={4} placeholder="Décrivez votre entreprise..." />
          </div>

          <div className="cp-form-group">
            <label>
              Services{' '}
              <span className="cp-form-hint">(séparés par virgules)</span>
            </label>
            <input name="services" value={form.services} onChange={handleChange}
              placeholder="Ex: Web, Mobile, Cloud, IA" />
          </div>

        </div>
      </div>
    </div>
  );
};

export default CompanyProfileTab;