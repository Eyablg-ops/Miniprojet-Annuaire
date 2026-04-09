import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from '../ui/Loading';
import OfferCard        from './OfferCard';
import OfferDetailModal from './OfferDetailModal';
import ApplyModal       from './ApplyModal';
import { getPublicOffers, searchOffers } from '../services/api';
import '../styles/Dashboard.css';
import '../styles/StudentDashboard.css';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser]         = useState(null);
  const [loading, setLoading]   = useState(true);
  const [offers, setOffers]     = useState([]);
  const [fetching, setFetching] = useState(false);

  const [search,   setSearch]   = useState('');
  const [domaine,  setDomaine]  = useState('');
  const [ville,    setVille]    = useState('');

  const [selected, setSelected]         = useState(null);
  const [detailOpen, setDetailOpen]     = useState(false);
  const [applyOpen,  setApplyOpen]      = useState(false);

  useEffect(() => {
    const userType = localStorage.getItem('userType');
    const email    = localStorage.getItem('email');
    if (!userType || userType !== 'STUDENT') { navigate('/login'); return; }
    setUser({ email });
    setLoading(false);
  }, [navigate]);

  useEffect(() => {
    if (loading) return;
    const t = setTimeout(() => fetchOffers(), 400);
    return () => clearTimeout(t);
  }, [search, domaine, ville, loading]);

const fetchOffers = async () => {
  setFetching(true);
  try {
    let res;

    // Si aucun filtre, on récupère toutes les offres
    if (!search && !domaine && !ville) {
      res = await getPublicOffers();
    } else {
      // 🔥 on envoie les bons paramètres au backend
      res = await searchOffers({
        title: search,    // le champ de recherche
        domain: domaine,  // domaine du stage
        location: ville,  // ville du stage
      });
    }

    console.log("OFFERS BACK:", res.data);
    setOffers(Array.isArray(res.data) ? res.data : []);
  } catch (e) {
    console.error(e);
    setOffers([]);
  } finally {
    setFetching(false);
  }
};

  const openDetail = (offer) => { setSelected(offer); setDetailOpen(true); };
 const openApply = (offer) => {
  setSelected(offer);
  setDetailOpen(false);
  setApplyOpen(true);
};

  const handleLogout = () => { localStorage.clear(); navigate('/'); };

  if (loading) return <Loading />;

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <div className="nav-brand">
          <span className="brand-icon">🎓</span>
          <span className="brand-name">Student Portal</span>
        </div>
        <div className="nav-user">
          <span className="user-email">{user?.email}</span>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <div className="dashboard-main">
        <div className="sd-main">

          <div className="sd-page-header">
            <div className="sd-page-title">💼 Offres de Stage</div>
            <div className="sd-page-sub">Trouvez votre stage idéal parmi nos offres disponibles</div>
          </div>

          <div className="sd-filters">
            <input className="sd-input" placeholder="🔍 Rechercher une offre..."
              value={search} onChange={e => setSearch(e.target.value)} />
            <input className="sd-input" placeholder="📂 Domaine"
              value={domaine} onChange={e => setDomaine(e.target.value)} />
            <input className="sd-input" placeholder="📍 Ville"
              value={ville} onChange={e => setVille(e.target.value)} />
            <span className="sd-count">
              <span>{offers.length}</span> offre(s) disponible(s)
            </span>
          </div>

          {fetching ? (
            <div className="sd-loading">
              <div className="sd-spinner" />
              Chargement des offres...
            </div>
          ) : offers.length === 0 ? (
            <div className="sd-empty">
              Aucune offre trouvée — essayez de modifier vos filtres.
            </div>
          ) : (
            <div className="sd-grid">
              {offers.map(offer => (
                <OfferCard key={offer.id} offer={offer}
                  onDetail={openDetail} onApply={openApply} />
              ))}
            </div>
          )}

        </div>
      </div>

      {detailOpen && (
        <OfferDetailModal
          offer={selected}
          onClose={() => setDetailOpen(false)}
          onApply={openApply}
        />
      )}
      {applyOpen && (
        <ApplyModal
          offer={selected}
          onClose={() => setApplyOpen(false)}
        />
      )}
    </div>
  );
};

export default StudentDashboard;