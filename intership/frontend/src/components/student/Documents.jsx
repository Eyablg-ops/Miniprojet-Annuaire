import { useState } from "react";

function Documents({ profile }) {
  const [cv_file, set_cv_file] = useState(null);
  const [image_file, set_image_file] = useState(null);

  const handle_cv_change = (event) => {
    set_cv_file(event.target.files[0] || null);
  };

  const handle_image_change = (event) => {
    set_image_file(event.target.files[0] || null);
  };

  const handle_cv_upload = () => {
    alert("Backend upload CV à brancher ici.");
  };

  const handle_image_upload = () => {
    alert("Backend upload image à brancher ici.");
  };

  return (
    <>
      <div className="student-section-card">
        <h2>Mon CV</h2>
        <p className="student-mini-text">
          Importez votre CV au format PDF ou DOCX.
        </p>

        <div className="student-upload-box" style={{ marginTop: "20px" }}>
          <p>
            {profile?.cv_path
              ? `CV actuel : ${profile.cv_path}`
              : "Aucun CV importé pour le moment."}
          </p>

          <div className="student-actions" style={{ justifyContent: "center" }}>
            <input type="file" accept=".pdf,.doc,.docx" onChange={handle_cv_change} />
            <button className="student-primary-btn" onClick={handle_cv_upload}>
              Importer mon CV
            </button>
          </div>

          {cv_file && <div className="student-file-name">{cv_file.name}</div>}
        </div>
      </div>

      <div className="student-section-card">
        <h2>Photo de profil</h2>
        <p className="student-mini-text">
          Ajoutez une photo de profil pour personnaliser votre espace étudiant.
        </p>

        <div className="student-upload-box" style={{ marginTop: "20px" }}>
          <p>
            {profile?.profile_picture
              ? "Une photo de profil est déjà définie."
              : "Aucune photo de profil pour le moment."}
          </p>

          <div className="student-actions" style={{ justifyContent: "center" }}>
            <input type="file" accept="image/*" onChange={handle_image_change} />
            <button className="student-primary-btn" onClick={handle_image_upload}>
              Importer ma photo
            </button>
          </div>

          {image_file && <div className="student-file-name">{image_file.name}</div>}
        </div>
      </div>
    </>
  );
}

export default Documents;