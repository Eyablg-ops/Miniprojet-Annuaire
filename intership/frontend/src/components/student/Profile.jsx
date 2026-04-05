import { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../../services/student.service";

function Profile({ profile, setProfile }) {
  const [form, set_form] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
    date_of_birth: "",
    education_level: "",
    major: "",
    university: "",
    graduation_year: "",
  });

  const [editing, set_editing] = useState(false);
  const [saving, set_saving] = useState(false);
  const [message, set_message] = useState("");

  useEffect(() => {
    const load_profile = async () => {
      try {
        const response = await getProfile();
        set_form({
          first_name: response.data.first_name || "",
          last_name: response.data.last_name || "",
          email: response.data.email || "",
          phone: response.data.phone || "",
          address: response.data.address || "",
          date_of_birth: response.data.date_of_birth || "",
          education_level: response.data.education_level || "",
          major: response.data.major || "",
          university: response.data.university || "",
          graduation_year: response.data.graduation_year || "",
        });

        if (setProfile) {
          setProfile(response.data);
        }
      } catch (error) {
        console.error("Erreur chargement profil :", error);
      }
    };

    load_profile();
  }, [setProfile]);

  useEffect(() => {
    if (profile) {
      set_form({
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        email: profile.email || "",
        phone: profile.phone || "",
        address: profile.address || "",
        date_of_birth: profile.date_of_birth || "",
        education_level: profile.education_level || "",
        major: profile.major || "",
        university: profile.university || "",
        graduation_year: profile.graduation_year || "",
      });
    }
  }, [profile]);

  const handle_change = (event) => {
    const { name, value } = event.target;
    set_form((prev_form) => ({
      ...prev_form,
      [name]: value,
    }));
  };

  const handle_save = async () => {
    try {
      set_saving(true);
      set_message("");

      const payload = {
        first_name: form.first_name,
        last_name: form.last_name,
        phone: form.phone,
        address: form.address,
        date_of_birth: form.date_of_birth,
        education_level: form.education_level,
        major: form.major,
        university: form.university,
        graduation_year: form.graduation_year,
      };

      const response = await updateProfile(payload);
      set_editing(false);
      set_message("Profil mis à jour avec succès.");

      if (setProfile) {
        setProfile(response.data);
      }
    } catch (error) {
      console.error("Erreur mise à jour profil :", error);
      set_message("Erreur lors de la mise à jour du profil.");
    } finally {
      set_saving(false);
    }
  };

  return (
    <div className="student-section-card">
      <h2>Mon profil</h2>
      <p className="student-mini-text">
        Complétez vos informations personnelles et académiques.
      </p>

      {message && (
        <p style={{ marginTop: "12px", fontWeight: 600, color: "#4f46e5" }}>
          {message}
        </p>
      )}

      <div className="student-form-grid" style={{ marginTop: "20px" }}>
        <div className="student-form-group">
          <label>Prénom</label>
          <input
            type="text"
            name="first_name"
            value={form.first_name}
            onChange={handle_change}
            disabled={!editing}
          />
        </div>

        <div className="student-form-group">
          <label>Nom</label>
          <input
            type="text"
            name="last_name"
            value={form.last_name}
            onChange={handle_change}
            disabled={!editing}
          />
        </div>

        <div className="student-form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            disabled
          />
        </div>

        <div className="student-form-group">
          <label>Téléphone</label>
          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handle_change}
            disabled={!editing}
          />
        </div>

        <div className="student-form-group">
          <label>Date de naissance</label>
          <input
            type="date"
            name="date_of_birth"
            value={form.date_of_birth}
            onChange={handle_change}
            disabled={!editing}
          />
        </div>

        <div className="student-form-group">
          <label>Niveau d'études</label>
          <input
            type="text"
            name="education_level"
            value={form.education_level}
            onChange={handle_change}
            disabled={!editing}
          />
        </div>

        <div className="student-form-group">
          <label>Spécialité</label>
          <input
            type="text"
            name="major"
            value={form.major}
            onChange={handle_change}
            disabled={!editing}
          />
        </div>

        <div className="student-form-group">
          <label>Université</label>
          <input
            type="text"
            name="university"
            value={form.university}
            onChange={handle_change}
            disabled={!editing}
          />
        </div>

        <div className="student-form-group">
          <label>Année de graduation</label>
          <input
            type="number"
            name="graduation_year"
            value={form.graduation_year}
            onChange={handle_change}
            disabled={!editing}
          />
        </div>

        <div className="student-form-group full">
          <label>Adresse</label>
          <textarea
            name="address"
            rows="4"
            value={form.address}
            onChange={handle_change}
            disabled={!editing}
          />
        </div>
      </div>

      <div className="student-actions">
        {!editing ? (
          <button
            className="student-primary-btn"
            onClick={() => set_editing(true)}
          >
            Modifier mon profil
          </button>
        ) : (
          <>
            <button
              className="student-primary-btn"
              onClick={handle_save}
              disabled={saving}
            >
              {saving ? "Enregistrement..." : "Enregistrer"}
            </button>

            <button
              className="student-secondary-btn"
              onClick={() => set_editing(false)}
            >
              Annuler
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Profile;