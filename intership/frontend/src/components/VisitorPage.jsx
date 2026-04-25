// VisitorPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/VisitorPage.css';

const VisitorPage = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigation = (role = null) => {
    if (role === 'student') {
      navigate('/signup/student');
    } else if (role === 'recruiter') {
      navigate('/signup/recruiter');
    } else if (role === 'enseignant') {
      navigate('/signup/enseignant');
    } else {
      navigate('/login');
    }
  };

  const stats = [
    { icon: 'fas fa-building', value: '500+', label: 'Entreprises partenaires' },
    { icon: 'fas fa-users', value: '10k+', label: 'Étudiants inscrits' },
    { icon: 'fas fa-briefcase', value: '2k+', label: 'Stages proposés chaque année' },
    { icon: 'fas fa-chalkboard-user', value: '150+', label: 'Enseignants accompagnateurs' },
  ];

  const features = [
    {
      icon: 'fas fa-microchip',
      title: 'Matching intelligent',
      description: 'Notre algorithme IA analyse votre profil et vos compétences pour suggérer les stages les plus pertinents.',
    },
    {
      icon: 'fas fa-chart-line',
      title: 'Suivi de progression',
      description: 'Visualisez l’avancement de vos candidatures, recevez des alertes et gérez votre parcours en temps réel.',
    },
    {
      icon: 'fas fa-handshake',
      title: 'Connexion directe',
      description: 'Échangez avec les recruteurs, répondez aux offres et bénéficiez d’un espace messagerie intégré.',
    },
    {
      icon: 'fas fa-chalkboard-user',
      title: 'Développement carrière',
      description: 'Ateliers, conseils CV, webinaires : un accompagnement complet pour booster votre employabilité.',
    },
  ];

  const handleFeatureClick = (featureTitle) => {
    alert(`✨ Module en développement : plus d'informations sur "${featureTitle}" - exclusivité ISSAT.`);
  };

  return (
    <div className="visitor-page">
      {/* Navigation */}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container nav-inner">
          <div className="logo-area">
            <img 
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9a45-KXV32g7AcuYFtRqbas8BMG2Nansr6g&s" 
              alt="ISSAT" 
              className="issat-logo-img"
            />
            <div className="brand-titles">
              <span className="brand-namee">ISSAT Sousse</span>
              <span className="brand-sub">
                Institut Supérieur des Sciences Appliquées et de Technologie
              </span>
            </div>
          </div>
          <button className="btn-login" onClick={() => handleNavigation()}>
            Se connecter <i className="fas fa-arrow-right-to-bracket"></i>
          </button>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="hero">
          <div className="container hero-grid">
            <div className="hero-left">
              <div className="hero-badge">
                <i className="fas fa-graduation-cap"></i> 
                <span>Stage & Alternance</span>
              </div>
              <h1 className="hero-title">
                Trouvez votre <span>stage</span> <br /> et propulsez votre carrière
              </h1>
              <p className="hero-desc">
                Connectez-vous aux meilleures entreprises de la région Sousse, bénéficiez d’un matching intelligent 
                et d’un accompagnement personnalisé. ISSAT Sousse valorise vos talents.
              </p>
              <div className="cta-group">
                <button className="btn-primary" onClick={() => handleNavigation('student')}>
                  <i className="fas fa-user-graduate"></i> Je suis étudiant
                </button>
                <button className="btn-outline-accent" onClick={() => handleNavigation('recruiter')}>
                  <i className="fas fa-building"></i> Je suis recruteur
                </button>
                <button className="btn-outline-teacher" onClick={() => handleNavigation('enseignant')}>
                  <i className="fas fa-chalkboard-user"></i> Je suis enseignant
                </button>
              </div>
            </div>
            <div className="hero-right">
              <div className="floating-stats">
                <i className="fas fa-chalkboard-user" style={{ fontSize: '2.2rem', color: '#3b82f6' }}></i>
                <p style={{ fontWeight: 600, marginTop: '10px', color: '#0b3b5f' }}>+2000 offres actives</p>
                <p style={{ fontSize: '0.8rem', color: '#3b82f6' }}>Mise en relation directe</p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <div className="container">
          <div className="stats-row">
            {stats.map((stat, index) => (
              <div key={index} className="stat-block">
                <div className="stat-icon"><i className={stat.icon}></i></div>
                <div className="stat-number">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <section className="features">
          <div className="container">
            <div className="section-header">
              <div className="section-tag">Pourquoi ISSAT Stage ?</div>
              <h2 className="section-title">Une plateforme taillée pour votre réussite</h2>
              <p className="section-desc">
                Des fonctionnalités innovantes pour faciliter la recherche de stage et le recrutement.
              </p>
            </div>
            <div className="features-grid">
              {features.map((feature, index) => (
                <div key={index} className="feature-card">
                  <div className="feature-icon"><i className={feature.icon}></i></div>
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-text">{feature.description}</p>
                  <div className="learn-more" onClick={() => handleFeatureClick(feature.title)}>
                    En savoir plus <i className="fas fa-arrow-right"></i>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="final-cta">
          <div className="container">
            <div className="cta-card-inner">
              <h2 className="cta-title">Prêt à construire votre avenir ?</h2>
              <p className="cta-text">
                Rejoignez une communauté dynamique de 10 000 étudiants et trouvez le stage qui révélera votre potentiel.
              </p>
              <button className="btn-cta" onClick={() => handleNavigation('student')}>
                S'inscrire maintenant <i className="fas fa-arrow-right"></i>
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-copy">
            © 2026 ISSAT Sousse – Plateforme de stages | Tous droits réservés | Innovation & Excellence
          </div>
        </div>
      </footer>
    </div>
  );
};

export default VisitorPage;