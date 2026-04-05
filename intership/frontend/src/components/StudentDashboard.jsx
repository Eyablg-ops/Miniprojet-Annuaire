import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Profile from "./student/Profile";
import Skills from "./student/Skills";
import Internships from "./student/Internships";
import Documents from "./student/Documents";
import "../styles/StudentDashboard.css";
import { getProfile } from "../services/student.service";
import Loading from "../ui/Loading";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [active_tab, set_active_tab] = useState("dashboard");
  const [user, set_user] = useState(null);
  const [profile, set_profile] = useState(null);
  const [loading, set_loading] = useState(true);

  useEffect(() => {
    const user_type = localStorage.getItem("userType");
    const email = localStorage.getItem("email");

    if (!user_type || user_type !== "STUDENT") {
      navigate("/login");
      return;
    }

    set_user({ email });

    const load_profile = async () => {
      try {
        const response = await getProfile();
        set_profile(response.data);
      } catch (error) {
        console.error("Erreur chargement dashboard student :", error);
      } finally {
        set_loading(false);
      }
    };

    load_profile();
  }, [navigate]);

  const handle_logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const completion = useMemo(() => {
    if (!profile) return 0;

    const checks = [
      profile.first_name,
      profile.last_name,
      profile.phone,
      profile.address,
      profile.date_of_birth,
      profile.education_level,
      profile.major,
      profile.university,
      profile.graduation_year,
      profile.cv_path,
      profile.profile_picture,
    ];

    const filled_count = checks.filter((value) => value !== null && value !== "").length;
    return Math.round((filled_count / checks.length) * 100);
  }, [profile]);

  const completion_items = [
    { label: "Photo de profil", ok: !!profile?.profile_picture },
    { label: "CV importé", ok: !!profile?.cv_path },
    { label: "Téléphone", ok: !!profile?.phone },
    { label: "Adresse", ok: !!profile?.address },
    { label: "Université", ok: !!profile?.university },
    { label: "Spécialité", ok: !!profile?.major },
  ];

  const render_dashboard_home = () => {
    return (
      <>
        <div className="student-hero-card">
          <div>
            <div className="student-hero-title">
              Bonjour {profile?.first_name || "Étudiant"} 👋
            </div>
            <div className="student-hero-subtitle">
              Gérez votre profil, ajoutez votre CV, mettez à jour vos compétences
              et suivez votre parcours de stage dans un seul espace.
            </div>

            <div className="student-badges">
              <span className="student-badge">
                {profile?.education_level || "Niveau non défini"}
              </span>
              <span className="student-badge">
                {profile?.major || "Spécialité non définie"}
              </span>
              <span className="student-badge">
                {profile?.university || "Université non définie"}
              </span>
            </div>
          </div>

          <div className="student-progress-card">
            <div className="student-progress-header">
              <div className="student-progress-title">Complétude du profil</div>
              <div className="student-progress-value">{completion}%</div>
            </div>

            <div className="student-progress-bar">
              <div
                className="student-progress-fill"
                style={{ width: `${completion}%` }}
              />
            </div>

            <div className="student-check-list">
              {completion_items.map((item) => (
                <div className="student-check-item" key={item.label}>
                  <span>{item.ok ? "✅" : "⬜"}</span>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="student-grid">
          <div className="student-stat-card">
            <div className="student-stat-value">{profile?.cv_path ? 1 : 0}</div>
            <div className="student-stat-label">CV importé</div>
          </div>

          <div className="student-stat-card">
            <div className="student-stat-value">{profile?.profile_picture ? 1 : 0}</div>
            <div className="student-stat-label">Photo de profil</div>
          </div>

          <div className="student-stat-card">
            <div className="student-stat-value">{completion}%</div>
            <div className="student-stat-label">Profil complété</div>
          </div>
        </div>

        <div className="student-grid">
          <div className="student-section-card">
            <h3>Mon profil</h3>
            <p className="student-mini-text">
              Mettez à jour vos informations personnelles et académiques pour
              améliorer votre visibilité.
            </p>
            <div className="student-actions">
              <button
                className="student-primary-btn"
                onClick={() => set_active_tab("profile")}
              >
                Modifier mon profil
              </button>
            </div>
          </div>

          <div className="student-section-card">
            <h3>Mes documents</h3>
            <p className="student-mini-text">
              Importez votre CV et votre photo de profil pour compléter votre dossier.
            </p>
            <div className="student-actions">
              <button
                className="student-primary-btn"
                onClick={() => set_active_tab("documents")}
              >
                Gérer mes documents
              </button>
            </div>
          </div>

          <div className="student-section-card">
            <h3>Mes compétences</h3>
            <p className="student-mini-text">
              Ajoutez les technologies et compétences qui valorisent votre profil.
            </p>
            <div className="student-actions">
              <button
                className="student-primary-btn"
                onClick={() => set_active_tab("skills")}
              >
                Gérer mes compétences
              </button>
            </div>
          </div>
        </div>
      </>
    );
  };

  const render_content = () => {
    switch (active_tab) {
      case "dashboard":
        return render_dashboard_home();
      case "profile":
        return <Profile profile={profile} setProfile={set_profile} />;
      case "documents":
        return <Documents profile={profile} setProfile={set_profile} />;
      case "skills":
        return <Skills />;
      case "internships":
        return <Internships />;
      default:
        return render_dashboard_home();
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="student-dashboard-page">
      <div className="student-dashboard-shell">
        <div className="student-topbar">
          <div className="student-brand">
            <div className="student-brand-icon">🎓</div>
            <div className="student-brand-text">Student Portal</div>
          </div>

          <div className="student-topbar-right">
            <span className="student-user-email">{user?.email}</span>
            <button className="student-logout-btn" onClick={handle_logout}>
              Logout
            </button>
          </div>
        </div>

        <div className="student-layout">
          <aside className="student-sidebar">
            <div className="student-profile-summary">
              <div className="student-avatar">
                {profile?.profile_picture ? (
                  <img
                    src={profile.profile_picture}
                    alt="Profil"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "50%",
                    }}
                  />
                ) : (
                  `${profile?.first_name?.[0] || "S"}${profile?.last_name?.[0] || ""}`
                )}
              </div>

              <div className="student-full-name">
                {profile?.first_name || "Student"} {profile?.last_name || ""}
              </div>

              <div className="student-mini-text">
                {profile?.major || "Spécialité non définie"}
              </div>

              <div className="student-mini-text">
                {profile?.university || "Université non définie"}
              </div>
            </div>

            <div className="student-menu">
              <button
                className={`student-menu-btn ${active_tab === "dashboard" ? "active" : ""}`}
                onClick={() => set_active_tab("dashboard")}
              >
                Tableau de bord
              </button>

              <button
                className={`student-menu-btn ${active_tab === "profile" ? "active" : ""}`}
                onClick={() => set_active_tab("profile")}
              >
                Mon profil
              </button>

              <button
                className={`student-menu-btn ${active_tab === "documents" ? "active" : ""}`}
                onClick={() => set_active_tab("documents")}
              >
                Mon CV & photo
              </button>

              <button
                className={`student-menu-btn ${active_tab === "skills" ? "active" : ""}`}
                onClick={() => set_active_tab("skills")}
              >
                Mes compétences
              </button>

              <button
                className={`student-menu-btn ${active_tab === "internships" ? "active" : ""}`}
                onClick={() => set_active_tab("internships")}
              >
                Mes stages
              </button>
            </div>
          </aside>

          <main className="student-main">{render_content()}</main>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;