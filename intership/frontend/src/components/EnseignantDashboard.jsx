import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/EnseignantDashboard.css";
import Loading from "../ui/Loading";

const EnseignantDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userType = localStorage.getItem("userType");
    const email = localStorage.getItem("email");

    if (!userType || userType !== "ENSEIGNANT") {
      navigate("/login");
      return;
    }

    setUser({ email });
    setLoading(false);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="enseignant-dashboard-page">
      <div className="enseignant-dashboard-shell">
        {/* Topbar */}
        <div className="enseignant-topbar">
          <div className="enseignant-brand">
            <div className="enseignant-brand-icon">👨‍🏫</div>
            <div className="enseignant-brand-text">Enseignant Portal</div>
          </div>

          <div className="enseignant-topbar-right">
            <span className="enseignant-user-email">{user?.email}</span>
            <button className="enseignant-logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>

        <div className="enseignant-layout">
          {/* Sidebar */}
          <aside className="enseignant-sidebar">
            <div className="enseignant-profile-summary">
              <div className="enseignant-avatar-circle">
                <span>👨‍🏫</span>
              </div>
              <div className="enseignant-full-name">Espace Enseignant</div>
              <div className="enseignant-mini-text">
                ISSAT Sousse - Pédagogie & Stages
              </div>
            </div>

            <div className="enseignant-menu">
              <button className="enseignant-menu-btn active">
                📊 Dashboard
              </button>
              <button className="enseignant-menu-btn" disabled>
                👨‍🎓 Mes étudiants
              </button>
              <button className="enseignant-menu-btn" disabled>
                📋 Suivi des stages
              </button>
              <button className="enseignant-menu-btn" disabled>
                📝 Conventions
              </button>
              <button className="enseignant-menu-btn" disabled>
                📄 Rapports de stage
              </button>
              <button className="enseignant-menu-btn" disabled>
                🏢 Entreprises partenaires
              </button>
              <button className="enseignant-menu-btn" disabled>
                ⚙️ Paramètres
              </button>
            </div>
          </aside>

          {/* Main Content - Coming Soon */}
          <main className="enseignant-main">
            <div className="enseignant-coming-soon-card">
              <div className="coming-soon-animation">
                <div className="coming-soon-icon">🚀</div>
                <div className="coming-soon-glow"></div>
              </div>
              <h1 className="coming-soon-title">Plateforme en développement</h1>
              <p className="coming-soon-subtitle">
                L'espace enseignant arrive bientôt ! Nous travaillons activement
                pour vous offrir les meilleurs outils de suivi pédagogique.
              </p>

              <div className="coming-soon-features">
                <div className="feature-preview">
                  <div className="feature-icon">👨‍🎓</div>
                  <h4>Suivi des étudiants</h4>
                  <p>Consultez la liste de vos étudiants et leurs stages</p>
                </div>
                <div className="feature-preview">
                  <div className="feature-icon">📋</div>
                  <h4>Validation des conventions</h4>
                  <p>Approuvez les conventions de stage en ligne</p>
                </div>
                <div className="feature-preview">
                  <div className="feature-icon">📊</div>
                  <h4>Tableau de bord</h4>
                  <p>Visualisez les statistiques de vos promotions</p>
                </div>
                <div className="feature-preview">
                  <div className="feature-icon">📄</div>
                  <h4>Rapports IA</h4>
                  <p>Analyse automatique des rapports de stage</p>
                </div>
              </div>

              <div className="coming-soon-progress">
                <div className="progress-info">
                  <span>Développement en cours</span>
                  <span>75%</span>
                </div>
                <div className="progress-bar-track">
                  <div className="progress-bar-fill" style={{ width: "75%" }}></div>
                </div>
                <p className="progress-note">
                  Module enseignant — Disponible pour la rentrée prochaine
                </p>
              </div>

              <button className="back-to-home-btn" onClick={() => navigate("/")}>
                ← Retour à l'accueil
              </button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default EnseignantDashboard;