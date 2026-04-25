import React, { useState, useEffect } from 'react';
import { getCompanies } from '../services/api';
import '../styles/Annuairepage.css'

const VILLES = ['Tunis', 'Sfax', 'Ariana', 'Sousse', 'Kairouan', 'Manouba', 'Bizerte'];

const AnnuairePage = () => {
  const [companies, setCompanies]   = useState([]);
  const [loading, setLoading]       = useState(false);
  const [searchName, setSearchName] = useState('');
  const [filterCity, setFilterCity] = useState('');

  // Debounce : on attend 500ms après la frappe avant d'appeler l'API
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCompanies();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchName, filterCity]);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      // GET /api/annuaire/companies?name=X&city=Y
      const res = await getCompanies({ name: searchName, city: filterCity });
      setCompanies(res.data);
    } catch (err) {
      console.error('Erreur chargement entreprises:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="annuaire-container">
      {/* ── Filtres ── */}
      <div className="annuaire-filters">
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Rechercher une entreprise..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="search-input"
          />
          {searchName && (
            <button className="clear-btn" onClick={() => setSearchName('')}>✕</button>
          )}
        </div>

        <select
          value={filterCity}
          onChange={(e) => setFilterCity(e.target.value)}
          className="city-select"
        >
          <option value="">📍 Toutes les villes</option>
          {VILLES.map(v => (
            <option key={v} value={v}>{v}</option>
          ))}
        </select>

        <span className="results-count">
          {companies.length} résultat(s)
        </span>
      </div>

      {/* ── Résultats ── */}
      {loading ? (
        <div className="annuaire-loading">
          <div className="mini-spinner"></div>
          <span>Chargement...</span>
        </div>
      ) : companies.length === 0 ? (
        <div className="annuaire-empty">
          <span>😕</span>
          <p>Aucune entreprise trouvée</p>
        </div>
      ) : (
        <div className="companies-grid">
          {companies.map(company => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>
      )}
    </div>
  );
};

// ── Carte entreprise ──────────────────────────────────────
const CompanyCard = ({ company }) => {
  const services = company.services
    ? company.services.split(',').slice(0, 3)
    : [];

  return (
    <div className="company-card">
      <div className="company-header">
        <h3>{company.name}</h3>
        <span className={`company-status ${company.status?.toLowerCase()}`}>
          {company.status}
        </span>
      </div>

      <div className="company-details">
        {company.city && (
          <p>📍 {company.city}{company.country ? `, ${company.country}` : ''}</p>
        )}
        {company.website && (
          <p>
            🌐 <a href={company.website} target="_blank" rel="noreferrer">
              {company.website}
            </a>
          </p>
        )}
        {company.description && (
          <p className="company-description">{company.description}</p>
        )}
      </div>

      {services.length > 0 && (
        <div className="company-services">
          {services.map(s => (
            <span key={s} className="service-tag">{s.trim()}</span>
          ))}
        </div>
      )}
    </div>
  );
};

export default AnnuairePage;