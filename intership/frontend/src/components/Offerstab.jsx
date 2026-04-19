import React, { useState, useEffect } from 'react';
import {
  getOffersByCompany,
  createOffer,
  updateOffer,
  deleteOffer,
} from '../services/api';
import '../styles/Offerstab.css';

const TYPES   = ['PFE', 'PFA', 'Stage été'];
const DOMAINS = ['Informatique', 'Finance', 'Marketing', 'Data', 'RH', 'Autre'];

const emptyForm = {
  title: '', description: '', domain: '', location: '',
  duration: '', type: '', requiredSkills: '', status: 'OPEN', deadline: '',
};

const STATUS_LABEL = { OPEN: 'Ouvert', CLOSED: 'Fermé', DRAFT: 'Brouillon' };

const OffersTab = () => {
  const companyId = localStorage.getItem('companyId');
  const [offers, setOffers]                   = useState([]);
  const [loading, setLoading]                 = useState(false);
  const [showForm, setShowForm]               = useState(false);
  const [editOffer, setEditOffer]             = useState(null);
  const [form, setForm]                       = useState(emptyForm);
  const [error, setError]                     = useState('');
  const [success, setSuccess]                 = useState('');
  const [manualCompanyId, setManualCompanyId] = useState('');

  const effectiveCompanyId = companyId || manualCompanyId;

  useEffect(() => {
    if (effectiveCompanyId) loadOffers();
  }, [effectiveCompanyId]);

  const loadOffers = async () => {
    setLoading(true);
    try {
      const res = await getOffersByCompany(effectiveCompanyId);
      setOffers(res.data);
    } catch {
      setError('Erreur lors du chargement des offres');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const openCreate = () => {
    setEditOffer(null);
    setForm(emptyForm);
    setShowForm(true);
    setError('');
    setSuccess('');
  };

  const openEdit = (offer) => {
    setEditOffer(offer);
    setForm({
      title:          offer.title          || '',
      description:    offer.description    || '',
      domain:         offer.domain         || '',
      location:       offer.location       || '',
      duration:       offer.duration       || '',
      type:           offer.type           || '',
      requiredSkills: offer.requiredSkills || '',
      status:         offer.status         || 'OPEN',
      deadline:       offer.deadline       || '',
    });
    setShowForm(true);
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!effectiveCompanyId) {
      setError('ID entreprise manquant. Veuillez le saisir ci-dessous.');
      return;
    }

    try {
      const payload = {
        ...form,
        duration: parseInt(form.duration) || 0,
        company: { id: parseInt(effectiveCompanyId) },
      };

      if (editOffer) {
        await updateOffer(editOffer.id, payload);
        setSuccess('Offre modifiée avec succès');
      } else {
        await createOffer(payload);
        setSuccess('Offre publiée avec succès');
      }
      setShowForm(false);
      loadOffers();
    } catch (err) {
      const data = err.response?.data;
      setError(typeof data === 'string' ? data : data?.message || 'Erreur lors de la sauvegarde');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cette offre ?')) return;
    try {
      await deleteOffer(id);
      setSuccess('Offre supprimée');
      loadOffers();
    } catch (err) {
      const data = err.response?.data;
      setError(typeof data === 'string' ? data : data?.message || 'Erreur suppression');
    }
  };

  return (
    <div className="offers-tab">

      {/* ── En-tête ── */}
      <div className="tab-header">
        <h2>
          <span className="header-icon">📋</span>
          Mes offres de stage
        </h2>
        <button className="action-btn" onClick={openCreate}>+ Publier une offre</button>
      </div>

      {/* ── Avertissement ID manquant ── */}
      {!companyId && (
        <div className="warning-box">
          ID entreprise non détecté. Saisissez-le manuellement :
          <input
            type="number"
            placeholder="ID de votre entreprise (ex: 1)"
            value={manualCompanyId}
            onChange={(e) => setManualCompanyId(e.target.value)}
            className="manual-id-input"
          />
          {manualCompanyId && (
            <button className="action-btn-small" onClick={loadOffers}>Charger</button>
          )}
        </div>
      )}

      {error   && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {/* ── Formulaire overlay ── */}
      {showForm && (
        <div className="offer-form-overlay">
          <div className="offer-form-card">
            <div className="form-card-header">
              <h3>{editOffer ? 'Modifier l\'offre' : 'Nouvelle offre'}</h3>
              <button className="close-btn" onClick={() => setShowForm(false)}>✕</button>
            </div>

            <form onSubmit={handleSubmit} className="offer-form">
              <div className="form-group">
                <label>Titre *</label>
                <input name="title" value={form.title} onChange={handleChange}
                  placeholder="Ex: Stage PFE Développement Web" required />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Type *</label>
                  <select name="type" value={form.type} onChange={handleChange} required>
                    <option value="">Choisir un type</option>
                    {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Domaine</label>
                  <select name="domain" value={form.domain} onChange={handleChange}>
                    <option value="">Choisir un domaine</option>
                    {DOMAINS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Localisation</label>
                  <input name="location" value={form.location} onChange={handleChange}
                    placeholder="Ex: Tunis" />
                </div>
                <div className="form-group">
                  <label>Durée (mois)</label>
                  <input name="duration" type="number" value={form.duration}
                    onChange={handleChange} placeholder="Ex: 6" min="1" max="12" />
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea name="description" value={form.description}
                  onChange={handleChange} rows={3}
                  placeholder="Décrivez le stage…" />
              </div>

              <div className="form-group">
                <label>Compétences requises</label>
                <input name="requiredSkills" value={form.requiredSkills}
                  onChange={handleChange}
                  placeholder="Ex: Java, React, MySQL (séparées par virgules)" />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Date limite</label>
                  <input name="deadline" type="date" value={form.deadline}
                    onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Statut</label>
                  <select name="status" value={form.status} onChange={handleChange}>
                    <option value="OPEN">Ouvert</option>
                    <option value="CLOSED">Fermé</option>
                    <option value="DRAFT">Brouillon</option>
                  </select>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>
                  Annuler
                </button>
                <button type="submit" className="submit-btn">
                  {editOffer ? 'Enregistrer' : 'Publier'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Liste des offres ── */}
      {loading ? (
        <p className="loading-text">Chargement…</p>
      ) : !effectiveCompanyId ? (
        <div className="empty-state">
          <span className="empty-icon">🏢</span>
          <p>Veuillez saisir votre ID entreprise ci-dessus</p>
        </div>
      ) : offers.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📭</span>
          <p>Aucune offre publiée pour l'instant</p>
          <button className="action-btn" onClick={openCreate}>Publier ma première offre</button>
        </div>
      ) : (
        <div className="offers-list">
          {offers.map(offer => (
            <div key={offer.id} className="offer-card">
              <div className="offer-card-header">
                <div>
                  <h3>{offer.title}</h3>
                  <span className="offer-meta">
                    {offer.type} · {offer.domain} · {offer.location} · {offer.duration} mois
                  </span>
                </div>
                <span className={`offer-status ${offer.status?.toLowerCase()}`}>
                  {STATUS_LABEL[offer.status] ?? offer.status}
                </span>
              </div>

              {offer.requiredSkills && (
                <div className="offer-skills">
                  {offer.requiredSkills.split(',').map(s => (
                    <span key={s} className="skill-tag">{s.trim()}</span>
                  ))}
                </div>
              )}

              {offer.deadline && (
                <p className="offer-deadline">Date limite : {offer.deadline}</p>
              )}

              <div className="offer-actions">
                <button className="edit-btn" onClick={() => openEdit(offer)}>✏ Modifier</button>
                <button className="delete-btn" onClick={() => handleDelete(offer.id)}>✕ Supprimer</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OffersTab;