import React, { useState, useEffect } from 'react';
import { getCompanyStats, getOffersByCompany, getApplicationsByOffer } from '../services/api';
import '../styles/Statstab.css';

const StatsTab = () => {
  const companyId = localStorage.getItem('companyId');
  const [stats, setStats]           = useState(null);
  const [offers, setOffers]         = useState([]);
  const [totalApps, setTotalApps]   = useState(0);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      // Stats globales annuaire
      const statsRes = await getCompanyStats();
      setStats(statsRes.data);

      // Offres de l'entreprise
      if (companyId) {
        const offersRes = await getOffersByCompany(companyId);
        setOffers(offersRes.data);

        // Compter candidatures totales
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

  // Calculs locaux
  const openOffers   = offers.filter(o => o.status === 'OPEN').length;
  const closedOffers = offers.filter(o => o.status === 'CLOSED').length;
  const draftOffers  = offers.filter(o => o.status === 'DRAFT').length;

  // Compter offres par domaine
  const byDomain = offers.reduce((acc, o) => {
    const d = o.domain || 'Autre';
    acc[d] = (acc[d] || 0) + 1;
    return acc;
  }, {});

  if (loading) return <div className="loading-text">Chargement des statistiques...</div>;

  return (
    <div className="stats-tab">
      <div className="tab-header">
        <h2>📊 Statistiques Entreprise</h2>
        <button className="action-btn" onClick={loadStats}>🔄 Actualiser</button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* ── Chiffres clés ── */}
      <div className="stats-grid">
        <div className="stat-box blue">
          <div className="stat-icon">📋</div>
          <div className="stat-number">{offers.length}</div>
          <div className="stat-label">Total Offres</div>
        </div>
        <div className="stat-box green">
          <div className="stat-icon">✅</div>
          <div className="stat-number">{openOffers}</div>
          <div className="stat-label">Offres Ouvertes</div>
        </div>
        <div className="stat-box red">
          <div className="stat-icon">🔒</div>
          <div className="stat-number">{closedOffers}</div>
          <div className="stat-label">Offres Fermées</div>
        </div>
        <div className="stat-box purple">
          <div className="stat-icon">📥</div>
          <div className="stat-number">{totalApps}</div>
          <div className="stat-label">Total Candidatures</div>
        </div>
      </div>

      {/* ── Offres par domaine ── */}
      {Object.keys(byDomain).length > 0 && (
        <div className="stats-card">
          <h3>📌 Offres par Domaine</h3>
          <div className="domain-bars">
            {Object.entries(byDomain).map(([domain, count]) => (
              <div key={domain} className="domain-bar-row">
                <span className="domain-name">{domain}</span>
                <div className="bar-wrapper">
                  <div
                    className="bar-fill"
                    style={{ width: `${(count / offers.length) * 100}%` }}
                  ></div>
                </div>
                <span className="domain-count">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Liste offres avec candidatures ── */}
      {offers.length > 0 && (
        <div className="stats-card">
          <h3>📋 Détail par Offre</h3>
          <div className="offers-stats-list">
            {offers.map(offer => (
              <div key={offer.id} className="offer-stat-row">
                <div className="offer-stat-info">
                  <span className="offer-stat-title">{offer.title}</span>
                  <span className="offer-stat-meta">{offer.type} · {offer.location}</span>
                </div>
                <span className={`offer-status-badge ${offer.status?.toLowerCase()}`}>
                  {offer.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Stats globales annuaire ── */}
      {stats && (
        <div className="stats-card">
          <h3>🌍 Annuaire Global</h3>
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