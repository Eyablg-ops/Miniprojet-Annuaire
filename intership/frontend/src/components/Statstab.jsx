import React, { useState, useEffect } from 'react';
import { getCompanyStats, getOffersByCompany, getApplicationsByOffer } from '../services/api';
import '../styles/Statstab.css';

const StatsTab = () => {
  const companyId = localStorage.getItem('companyId');
  const [stats, setStats]         = useState(null);
  const [offers, setOffers]       = useState([]);
  const [totalApps, setTotalApps] = useState(0);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');

  useEffect(() => { loadStats(); }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      const statsRes = await getCompanyStats();
      setStats(statsRes.data);

      if (companyId) {
        const offersRes = await getOffersByCompany(companyId);
        setOffers(offersRes.data);

        let total = 0;
        for (const offer of offersRes.data) {
          try {
            const appRes = await getApplicationsByOffer(offer.id);
            total += appRes.data.length;
          } catch { /* ignore */ }
        }
        setTotalApps(total);
      }
    } catch {
      setError('Erreur lors du chargement des statistiques');
    } finally {
      setLoading(false);
    }
  };

  const openOffers   = offers.filter(o => o.status === 'OPEN').length;
  const closedOffers = offers.filter(o => o.status === 'CLOSED').length;
  const draftOffers  = offers.filter(o => o.status === 'DRAFT').length;

  const byDomain = offers.reduce((acc, o) => {
    const d = o.domain || 'Autre';
    acc[d] = (acc[d] || 0) + 1;
    return acc;
  }, {});

  if (loading) return <div className="loading-text">Chargement des statistiques…</div>;

  return (
    <div className="stats-tab">

      {/* ── En-tête ── */}
      <div className="tab-header">
        <h2>
          <span className="header-icon">📊</span>
          Statistiques entreprise
        </h2>
        <button className="action-btn" onClick={loadStats}>↺ Actualiser</button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* ── KPIs ── */}
      <div className="stats-grid">
        <div className="stat-box">
          <span className="kpi-label">Total offres</span>
          <span className="kpi-value">{offers.length}</span>
          <span className="kpi-indicator blue">
            <span className="kpi-dot blue" />
            Toutes catégories
          </span>
        </div>
        <div className="stat-box">
          <span className="kpi-label">Offres ouvertes</span>
          <span className="kpi-value">{openOffers}</span>
          <span className="kpi-indicator green">
            <span className="kpi-dot green" />
            En recrutement
          </span>
        </div>
        <div className="stat-box">
          <span className="kpi-label">Offres fermées</span>
          <span className="kpi-value">{closedOffers}</span>
          <span className="kpi-indicator red">
            <span className="kpi-dot red" />
            Clôturées
          </span>
        </div>
        <div className="stat-box">
          <span className="kpi-label">Candidatures</span>
          <span className="kpi-value">{totalApps}</span>
          <span className="kpi-indicator purple">
            <span className="kpi-dot purple" />
            Total reçues
          </span>
        </div>
      </div>

      {/* ── Offres par domaine ── */}
      {Object.keys(byDomain).length > 0 && (
        <div className="stats-card">
          <div className="card-header">
            <h3>Offres par domaine</h3>
            <span className="count-badge">{Object.keys(byDomain).length} domaines</span>
          </div>
          <div className="domain-bars">
            {Object.entries(byDomain).map(([domain, count]) => (
              <div key={domain} className="domain-bar-row">
                <span className="domain-name">{domain}</span>
                <div className="bar-wrapper">
                  <div
                    className="bar-fill"
                    style={{ width: `${(count / offers.length) * 100}%` }}
                  />
                </div>
                <span className="domain-count">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Liste offres ── */}
      {offers.length > 0 && (
        <div className="stats-card">
          <div className="card-header">
            <h3>Détail par offre</h3>
            <span className="count-badge">{offers.length} offres</span>
          </div>
          <div className="offers-stats-list">
            {offers.map(offer => (
              <div key={offer.id} className="offer-stat-row">
                <div className="offer-stat-info">
                  <span className="offer-stat-title">{offer.title}</span>
                  <span className="offer-stat-meta">{offer.type} · {offer.location}</span>
                </div>
                <span className={`offer-status-badge ${offer.status?.toLowerCase()}`}>
                  {offer.status === 'OPEN'   ? 'Ouvert'    :
                   offer.status === 'CLOSED' ? 'Fermé'     : 'Brouillon'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Annuaire global ── */}
      {stats && (
        <div className="stats-card">
          <div className="card-header">
            <h3>Annuaire global</h3>
          </div>
          <div className="stats-grid-small">
            <div className="stat-box-small">
              <span className="stat-number-small">{stats.total}</span>
              <span className="stat-label-small">Entreprises enregistrées</span>
            </div>
            {stats.byCity && Object.entries(stats.byCity).slice(0, 3).map(([city, count]) => (
              <div key={city} className="stat-box-small">
                <span className="stat-number-small">{count}</span>
                <span className="stat-label-small">à {city}</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default StatsTab;