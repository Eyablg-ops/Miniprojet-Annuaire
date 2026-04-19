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
  const [search, set_search]           = useState('');
  const [domaine, set_domaine]         = useState('');
  const [ville, set_ville]             = useState('');
  const [selected_offer, set_selected] = useState(null);
  const [detail_open, set_detail_open] = useState(false);
  const [apply_open, set_apply_open]   = useState(false);

  useEffect(() => {
    fetch_offers().then(() => set_loading(false));
  }, []);

  useEffect(() => {
    if (loading) return;
    const timer = setTimeout(fetch_offers, 400);
    return () => clearTimeout(timer);
  }, [search, domaine, ville]);

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

  const open_detail = (offer) => { set_selected(offer); set_detail_open(true); };
  const open_apply  = (offer) => { set_selected(offer); set_detail_open(false); set_apply_open(true); };

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
            />
          ))}
        </div>
      )}

      {detail_open && (
        <OfferDetailModal
          offer={selected_offer}
          onClose={() => set_detail_open(false)}
          onApply={open_apply}
        />
      )}
      {apply_open && (
        <ApplyModal
          offer={selected_offer}
          onClose={() => set_apply_open(false)}
        />
      )}
    </div>
  );
};

export default Offers;