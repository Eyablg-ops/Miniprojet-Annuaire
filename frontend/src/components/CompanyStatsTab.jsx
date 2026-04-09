// src/components/CompanyStatsTab.jsx
import React, { useState, useEffect } from 'react';
import { getCompanyStats } from '../services/api';

const CompanyStatsTab = () => {
  const [stats, setStats]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState('');

  useEffect(() => {
    getCompanyStats()
      .then(res => setStats(res.data))
      .catch(() => setError('Erreur chargement statistiques'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ padding: '2rem', color: '#888' }}>Chargement...</p>;
  if (error)   return <div className="error-message">{error}</div>;
  if (!stats)  return null;

  return (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ marginBottom: '1.5rem', color: '#333' }}>📊 Statistiques Entreprises</h2>

      {/* Total */}
      <div className="stats-grid" style={{ marginBottom: '2rem' }}>
        <div className="stat-box">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Entreprises au total</div>
        </div>
        {stats.byStatus && Object.entries(stats.byStatus).map(([status, count]) => (
          <div key={status} className="stat-box">
            <div className="stat-value">{count}</div>
            <div className="stat-label">{status}</div>
          </div>
        ))}
      </div>

      {/* Par ville */}
      {stats.byCity && (
        <div className="dashboard-content">
          <h3 style={{ marginBottom: '1rem', color: '#667eea' }}>📍 Répartition par ville</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {Object.entries(stats.byCity)
              .sort(([, a], [, b]) => b - a)
              .map(([city, count]) => {
                const total = stats.total || 1;
                const pct = Math.round((count / total) * 100);
                return (
                  <div key={city} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ width: '100px', fontWeight: 500, color: '#555' }}>{city}</span>
                    <div style={{
                      flex: 1, height: '10px', background: '#f0f0f0',
                      borderRadius: '10px', overflow: 'hidden'
                    }}>
                      <div style={{
                        height: '100%', width: `${pct}%`,
                        background: 'linear-gradient(135deg, #667eea, #764ba2)',
                        borderRadius: '10px', transition: 'width 0.6s ease'
                      }} />
                    </div>
                    <span style={{ width: '60px', textAlign: 'right', color: '#888', fontSize: '0.85rem' }}>
                      {count} ({pct}%)
                    </span>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyStatsTab;