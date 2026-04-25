import React, { useEffect, useState } from 'react';
import Loading from '../../ui/Loading';
import OfferCard from '../OfferCard';
import OfferDetailModal from '../OfferDetailModal';
import ApplyModal from '../ApplyModal';
import { getPublicOffers, searchOffers } from '../../services/api';
import '../../styles/Offers.css';

const Offers = () => {
  const [loading, set_loading]         = useState(true);
  const [fetching, set_fetching]       = useState(false);
  const [offers, set_offers]           = useState([]);
  const [applications, setApplications] = useState([]); // Add applications state
  const [search, set_search]           = useState('');
  const [domaine, set_domaine]         = useState('');
  const [ville, set_ville]             = useState('');
  const [selected_offer, set_selected] = useState(null);
  const [detail_open, set_detail_open] = useState(false);
  const [apply_open, set_apply_open]   = useState(false);

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetch_offers(), fetchApplications()]);
      set_loading(false);
    };
    loadData();
  }, []);

  useEffect(() => {
    if (loading) return;
    const timer = setTimeout(() => {
      fetch_offers();
    }, 400);
    return () => clearTimeout(timer);
  }, [search, domaine, ville]);

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/postulations/my', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setApplications(data);
        console.log('Applications loaded:', data);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const fetch_offers = async () => {
    set_fetching(true);
    try {
      const res = (!search && !domaine && !ville)
        ? await getPublicOffers()
        : await searchOffers({ title: search, domain: domaine, location: ville });
      set_offers(Array.isArray(res.data) ? res.data : []);
    } catch {
      set_offers([]);
    } finally {
      set_fetching(false);
    }
  };

  const hasApplied = (offerId) => {
    return applications.some(app => app.offerId === offerId);
  };

  const getApplicationStatus = (offerId) => {
    const application = applications.find(app => app.offerId === offerId);
    return application?.status || null;
  };

  const open_detail = (offer) => { set_selected(offer); set_detail_open(true); };
  
  const open_apply = (offer) => { 
    // Check if already applied
    if (hasApplied(offer.id)) {
      alert('Vous avez déjà postulé à cette offre.');
      return;
    }
    set_selected(offer); 
    set_detail_open(false); 
    set_apply_open(true); 
  };

  const handleApplicationSuccess = () => {
    // Refresh applications after successful application
    fetchApplications();
    set_apply_open(false);
  };

  if (loading) return <Loading />;

  return (
    <div className="offers-page">

      {/* ── En-tête ── */}
      <div className="offers-header">
        <div className="offers-title">
          <span className="offers-title-icon">💼</span>
          Internship offers
        </div>
        <div className="offers-subtitle">Find the internship that matches your profile.</div>
      </div>

      {/* ── Filtres ── */}
      <div className="offers-filters">
        <input
          className="offers-input"
          placeholder="Search an offer…"
          value={search}
          onChange={(e) => set_search(e.target.value)}
        />
        <input
          className="offers-input"
          placeholder="Domain"
          value={domaine}
          onChange={(e) => set_domaine(e.target.value)}
        />
        <input
          className="offers-input"
          placeholder="City"
          value={ville}
          onChange={(e) => set_ville(e.target.value)}
        />
        <span className="offers-count">
          <strong>{offers.length}</strong> offer(s)
        </span>
      </div>

      {/* ── Contenu ── */}
      {fetching ? (
        <div className="offers-loading">
          <div className="offers-spinner" />
          Loading offers…
        </div>
      ) : offers.length === 0 ? (
        <div className="offers-empty">
          No offers found. Try changing your filters.
        </div>
      ) : (
        <div className="offers-grid">
          {offers.map((offer) => (
            <OfferCard
              key={offer.id}
              offer={offer}
              onDetail={open_detail}
              onApply={open_apply}
              hasApplied={hasApplied(offer.id)}
              applicationStatus={getApplicationStatus(offer.id)}
            />
          ))}
        </div>
      )}

      {detail_open && (
        <OfferDetailModal
          offer={selected_offer}
          onClose={() => set_detail_open(false)}
          onApply={open_apply}
          hasApplied={hasApplied(selected_offer?.id)}
          applicationStatus={getApplicationStatus(selected_offer?.id)}
        />
      )}
      {apply_open && (
        <ApplyModal
          offer={selected_offer}
          onClose={() => set_apply_open(false)}
          onSuccess={handleApplicationSuccess}
        />
      )}
    </div>
  );
};

export default Offers;