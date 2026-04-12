import React, { useEffect, useState } from "react";
import Loading from "../../ui/Loading";
import OfferCard from "../OfferCard";
import OfferDetailModal from "../OfferDetailModal";
import ApplyModal from "../ApplyModal";
import { getPublicOffers, searchOffers } from "../../services/api";

const Offers = () => {
  const [loading, set_loading] = useState(true);
  const [fetching, set_fetching] = useState(false);
  const [offers, set_offers] = useState([]);

  const [search, set_search] = useState("");
  const [domaine, set_domaine] = useState("");
  const [ville, set_ville] = useState("");

  const [selected_offer, set_selected_offer] = useState(null);
  const [detail_open, set_detail_open] = useState(false);
  const [apply_open, set_apply_open] = useState(false);

  useEffect(() => {
    const load_initial_offers = async () => {
      await fetch_offers();
      set_loading(false);
    };

    load_initial_offers();
  }, []);

  useEffect(() => {
    if (loading) {
      return;
    }

    const timer = setTimeout(() => {
      fetch_offers();
    }, 400);

    return () => clearTimeout(timer);
  }, [search, domaine, ville, loading]);

  const fetch_offers = async () => {
    set_fetching(true);

    try {
      let response;

      if (!search && !domaine && !ville) {
        response = await getPublicOffers();
      } else {
        response = await searchOffers({
          title: search,
          domain: domaine,
          location: ville,
        });
      }

      set_offers(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching offers:", error);
      set_offers([]);
    } finally {
      set_fetching(false);
    }
  };

  const open_detail = (offer) => {
    set_selected_offer(offer);
    set_detail_open(true);
  };

  const open_apply = (offer) => {
    set_selected_offer(offer);
    set_detail_open(false);
    set_apply_open(true);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="student-section-card">
      <div className="sd-page-header">
        <div className="sd-page-title">💼 Internship Offers</div>
        <div className="sd-page-sub">
          Find the internship that matches your profile.
        </div>
      </div>

      <div className="sd-filters">
        <input
          className="sd-input"
          placeholder="🔍 Search an offer..."
          value={search}
          onChange={(event) => set_search(event.target.value)}
        />

        <input
          className="sd-input"
          placeholder="📂 Domain"
          value={domaine}
          onChange={(event) => set_domaine(event.target.value)}
        />

        <input
          className="sd-input"
          placeholder="📍 City"
          value={ville}
          onChange={(event) => set_ville(event.target.value)}
        />

        <span className="sd-count">
          <span>{offers.length}</span> offer(s)
        </span>
      </div>

      {fetching ? (
        <div className="sd-loading">
          <div className="sd-spinner" />
          Loading offers...
        </div>
      ) : offers.length === 0 ? (
        <div className="sd-empty">
          No offers found. Try changing your filters.
        </div>
      ) : (
        <div className="sd-grid">
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