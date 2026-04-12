import { useEffect, useState } from "react";
import {
  uploadCv,
  uploadProfilePicture,
  downloadMyCv,
  downloadProfilePicture,
} from "../../services/student.service";

function Documents({ profile, setProfile, onUpdate }) {
  const [cv_file, set_cv_file] = useState(null);
  const [image_file, set_image_file] = useState(null);
  const [message, set_message] = useState("");
  const [loading_cv, set_loading_cv] = useState(false);
  const [loading_image, set_loading_image] = useState(false);
  const [preview_image_url, set_preview_image_url] = useState(null);

  useEffect(() => {
    let object_url = null;

    const load_profile_picture = async () => {
      if (!profile?.profile_picture) {
        set_preview_image_url(null);
        return;
      }

      try {
        const response = await downloadProfilePicture();
        const blob = new Blob([response.data]);
        object_url = URL.createObjectURL(blob);
        set_preview_image_url(object_url);
      } catch (error) {
        console.error("Error loading profile picture preview:", error);
        set_preview_image_url(null);
      }
    };

    load_profile_picture();

    return () => {
      if (object_url) {
        URL.revokeObjectURL(object_url);
      }
    };
  }, [profile?.profile_picture]);

  const handle_cv_change = (event) => {
    set_cv_file(event.target.files[0] || null);
  };

  const handle_image_change = (event) => {
    set_image_file(event.target.files[0] || null);
  };

  const handle_cv_upload = async () => {
    if (!cv_file) {
      set_message("Please choose a CV file.");
      return;
    }

    try {
      set_loading_cv(true);
      set_message("");

      const form_data = new FormData();
      form_data.append("file", cv_file);

      const response = await uploadCv(form_data);

      if (setProfile) {
        setProfile(response.data);
      }

      // Trigger refresh in parent component
      if (onUpdate) {
        onUpdate();
      }

      set_message("CV uploaded successfully.");
      set_cv_file(null);
    } catch (error) {
      console.error("CV upload error:", error);
      set_message("Error while uploading the CV.");
    } finally {
      set_loading_cv(false);
    }
  };

  const handle_image_upload = async () => {
    if (!image_file) {
      set_message("Please choose an image file.");
      return;
    }

    try {
      set_loading_image(true);
      set_message("");

      const form_data = new FormData();
      form_data.append("file", image_file);

      const response = await uploadProfilePicture(form_data);

      if (setProfile) {
        setProfile(response.data);
      }

      // Trigger refresh in parent component
      if (onUpdate) {
        onUpdate();
      }

      set_message("Profile picture uploaded successfully.");
      set_image_file(null);
    } catch (error) {
      console.error("Profile picture upload error:", error);
      set_message("Error while uploading the profile picture.");
    } finally {
      set_loading_image(false);
    }
  };

  const handle_cv_download = async () => {
    try {
      const response = await downloadMyCv();
      const blob = new Blob([response.data], { type: "application/pdf" });
      const file_url = window.URL.createObjectURL(blob);
      window.open(file_url, "_blank");
    } catch (error) {
      console.error("CV download error:", error);
      set_message("Unable to open the CV.");
    }
  };

  return (
    <>
      <div className="student-section-card">
        <h2>My CV</h2>
        <p className="student-mini-text">
          Upload your CV in PDF format.
        </p>

        {message && (
          <p style={{ marginTop: "12px", fontWeight: 600, color: "#4f46e5" }}>
            {message}
          </p>
        )}

        <div className="student-upload-box" style={{ marginTop: "20px" }}>
          <p>
            {profile?.cv_path
              ? `Current CV: ${profile.cv_path}`
              : "No CV uploaded yet."}
          </p>

          {profile?.cv_path && (
            <div className="student-actions" style={{ justifyContent: "center" }}>
              <button
                className="student-secondary-btn"
                onClick={handle_cv_download}
              >
                View CV
              </button>
            </div>
          )}

          <div className="student-actions" style={{ justifyContent: "center" }}>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handle_cv_change}
            />
            <button className="student-primary-btn" onClick={handle_cv_upload}>
              {loading_cv ? "Uploading..." : "Upload CV"}
            </button>
          </div>

          {cv_file && <div className="student-file-name">{cv_file.name}</div>}
        </div>
      </div>

      <div className="student-section-card">
        <h2>Profile picture</h2>
        <p className="student-mini-text">
          Add a profile picture to personalize your student account.
        </p>

        <div className="student-upload-box" style={{ marginTop: "20px" }}>
          <p>
            {profile?.profile_picture
              ? "A profile picture is already set."
              : "No profile picture uploaded yet."}
          </p>

          {preview_image_url && (
            <div style={{ margin: "18px 0" }}>
              <img
                src={preview_image_url}
                alt="Student avatar"
                style={{
                  width: "140px",
                  height: "140px",
                  objectFit: "cover",
                  borderRadius: "50%",
                  border: "4px solid #eef2ff",
                }}
              />
            </div>
          )}

          <div className="student-actions" style={{ justifyContent: "center" }}>
            <input type="file" accept="image/*" onChange={handle_image_change} />
            <button
              className="student-primary-btn"
              onClick={handle_image_upload}
            >
              {loading_image ? "Uploading..." : "Upload picture"}
            </button>
          </div>

          {image_file && (
            <div className="student-file-name">{image_file.name}</div>
          )}
        </div>
      </div>
    </>
  );
}

export default Documents;