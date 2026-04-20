import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Profile from "./student/Profile";
import Skills from "./student/Skills";
import Internships from "./student/Internships";
import Documents from "./student/Documents";
import Offers from "./student/Offers";
import StudentRecommendations from "./recommendation/StudentRecommendations";
import StudentCompanyRecommendations from "./recommendation/StudentCompanyRecommendations";
import "../styles/StudentDashboard.css";
import {
  downloadProfilePicture,
  getProfile,
} from "../services/student.service";
import Loading from "../ui/Loading";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [active_tab, set_active_tab] = useState("dashboard");
  const [user, set_user] = useState(null);
  const [profile, set_profile] = useState(null);
  const [loading, set_loading] = useState(true);
  const [avatar_url, set_avatar_url] = useState(null);

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
        console.error("Error loading student dashboard:", error);
      } finally {
        set_loading(false);
      }
    };

    load_profile();
  }, [navigate]);

  useEffect(() => {
    let object_url = null;

    const load_avatar = async () => {
      if (!profile?.profile_picture) {
        set_avatar_url(null);
        return;
      }

      try {
        const response = await downloadProfilePicture();
        const blob = new Blob([response.data]);
        object_url = URL.createObjectURL(blob);
        set_avatar_url(object_url);
      } catch (error) {
        console.error("Error loading profile picture:", error);
        set_avatar_url(null);
      }
    };

    load_avatar();

    return () => {
      if (object_url) {
        URL.revokeObjectURL(object_url);
      }
    };
  }, [profile?.profile_picture]);

  const handle_logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const completion = useMemo(() => {
    if (!profile) {
      return 0;
    }

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

    const filled_count = checks.filter(
      (value) => value !== null && value !== ""
    ).length;

    return Math.round((filled_count / checks.length) * 100);
  }, [profile]);

  const completion_items = [
    { label: "Profile picture", ok: !!profile?.profile_picture },
    { label: "CV uploaded", ok: !!profile?.cv_path },
    { label: "Phone number", ok: !!profile?.phone },
    { label: "Address", ok: !!profile?.address },
    { label: "University", ok: !!profile?.university },
    { label: "Major", ok: !!profile?.major },
  ];

  const handleApply = async (offerId, coverLetter) => {
    try {
      // Call your API to apply for the offer
      // await applyToOffer(offerId, coverLetter);
      console.log(`Applied to offer ${offerId} with cover letter:`, coverLetter);
      alert("Application submitted successfully!");
    } catch (error) {
      console.error("Error applying:", error);
      alert("Failed to submit application");
    }
  };

  const render_dashboard_home = () => {
    return (
      <>
        <div className="student-hero-card">
          <div>
            <div className="student-hero-title">
              Hello {profile?.first_name || "Student"} 👋
            </div>

            <div className="student-hero-subtitle">
              Manage your profile, upload your CV, update your skills, and keep
              track of your internship journey in one place.
            </div>

            <div className="student-badges">
              <span className="student-badge">
                {profile?.education_level || "Education level not set"}
              </span>
              <span className="student-badge">
                {profile?.major || "Major not set"}
              </span>
              <span className="student-badge">
                {profile?.university || "University not set"}
              </span>
            </div>
          </div>

          <div className="student-progress-card">
            <div className="student-progress-header">
              <div className="student-progress-title">Profile completion</div>
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
            <div className="student-stat-label">CV uploaded</div>
          </div>

          <div className="student-stat-card">
            <div className="student-stat-value">
              {profile?.profile_picture ? 1 : 0}
            </div>
            <div className="student-stat-label">Profile picture</div>
          </div>

          <div className="student-stat-card">
            <div className="student-stat-value">{completion}%</div>
            <div className="student-stat-label">Profile completed</div>
          </div>
        </div>

        <div className="student-grid">
          <div className="student-section-card">
            <h3>My profile</h3>
            <p className="student-mini-text">
              Update your personal and academic information to improve your
              visibility.
            </p>

            <div className="student-actions">
              <button
                className="student-primary-btn"
                onClick={() => set_active_tab("profile")}
              >
                Edit my profile
              </button>
            </div>
          </div>

          <div className="student-section-card">
            <h3>My documents</h3>
            <p className="student-mini-text">
              Upload your CV and your profile picture to complete your student
              account.
            </p>

            <div className="student-actions">
              <button
                className="student-primary-btn"
                onClick={() => set_active_tab("documents")}
              >
                Manage my documents
              </button>
            </div>
          </div>

          <div className="student-section-card">
            <h3>My skills</h3>
            <p className="student-mini-text">
              Add the technologies and skills that make your profile stronger.
            </p>

            <div className="student-actions">
              <button
                className="student-primary-btn"
                onClick={() => set_active_tab("skills")}
              >
                Manage my skills
              </button>
            </div>
          </div>

          <div className="student-section-card">
            <h3>AI Recommendations</h3>
            <p className="student-mini-text">
              Get personalized internship and company recommendations based on
              your skills and profile.
            </p>

            <div className="student-actions">
              <button
                className="student-primary-btn"
                onClick={() => set_active_tab("recommendations")}
              >
                View Recommendations
              </button>
            </div>
          </div>

          <div className="student-section-card">
            <h3>Internship offers</h3>
            <p className="student-mini-text">
              Browse available offers and apply to the internships that match
              your profile.
            </p>

            <div className="student-actions">
              <button
                className="student-primary-btn"
                onClick={() => set_active_tab("offers")}
              >
                View offers
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
      case "offers":
        return <Offers />;
      case "internships":
        return <Internships />;
      case "recommendations":
        return <StudentRecommendations onApply={handleApply} />;
      case "recommended-companies":
        return <StudentCompanyRecommendations />;
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
              <div className="student-avatar-circle">
                {avatar_url ? (
                  <img
                    src={avatar_url}
                    alt="Student avatar"
                    className="student-avatar-img"
                  />
                ) : (
                  <span>
                    {profile?.first_name?.charAt(0) || "S"}
                    {profile?.last_name?.charAt(0) || ""}
                  </span>
                )}
              </div>

              <div className="student-full-name">
                {profile?.first_name || "Student"} {profile?.last_name || ""}
              </div>

              <div className="student-mini-text">
                {profile?.major || "Major not set"}
              </div>

              <div className="student-mini-text">
                {profile?.university || "University not set"}
              </div>
            </div>

            <div className="student-menu">
              <button
                className={`student-menu-btn ${
                  active_tab === "dashboard" ? "active" : ""
                }`}
                onClick={() => set_active_tab("dashboard")}
              >
                Dashboard
              </button>

              <button
                className={`student-menu-btn ${
                  active_tab === "profile" ? "active" : ""
                }`}
                onClick={() => set_active_tab("profile")}
              >
                My profile
              </button>

              <button
                className={`student-menu-btn ${
                  active_tab === "documents" ? "active" : ""
                }`}
                onClick={() => set_active_tab("documents")}
              >
                My CV & photo
              </button>

              <button
                className={`student-menu-btn ${
                  active_tab === "skills" ? "active" : ""
                }`}
                onClick={() => set_active_tab("skills")}
              >
                My skills
              </button>

              <button
                className={`student-menu-btn ${
                  active_tab === "recommendations" ? "active" : ""
                }`}
                onClick={() => set_active_tab("recommendations")}
              >
                Recommended Offers
              </button>

              <button
                className={`student-menu-btn ${
                  active_tab === "recommended-companies" ? "active" : ""
                }`}
                onClick={() => set_active_tab("recommended-companies")}
              >
                Recommended Companies
              </button>

              <button
                className={`student-menu-btn ${
                  active_tab === "offers" ? "active" : ""
                }`}
                onClick={() => set_active_tab("offers")}
              >
                All Offers
              </button>

              <button
                className={`student-menu-btn ${
                  active_tab === "internships" ? "active" : ""
                }`}
                onClick={() => set_active_tab("internships")}
              >
                My internships
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