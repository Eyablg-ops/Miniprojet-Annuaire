import { useEffect, useState } from "react";
import {
  addInternship,
  deleteInternship,
  getInternships,
} from "../../services/student.service";

function Internships() {
  const [form, set_form] = useState({
    company_name: "",
    position: "",
    description: "",
    start_date: "",
    end_date: "",
  });

  const [internships, set_internships] = useState([]);
  const [message, set_message] = useState("");
  const [loading, set_loading] = useState(true);

  const load_internships = async () => {
    try {
      const response = await getInternships();
      set_internships(response.data);
    } catch (error) {
      console.error("Error loading internships:", error);
      set_message("Unable to load internship history.");
    } finally {
      set_loading(false);
    }
  };

  useEffect(() => {
    load_internships();
  }, []);

  const handle_change = (event) => {
    const { name, value } = event.target;

    set_form((prev_form) => ({
      ...prev_form,
      [name]: value,
    }));
  };

  const handle_add_internship = async () => {
    if (
      !form.company_name.trim() ||
      !form.position.trim() ||
      !form.start_date ||
      !form.end_date
    ) {
      set_message("Please fill in all required internship fields.");
      return;
    }

    try {
      set_message("");

      await addInternship(form);

      set_form({
        company_name: "",
        position: "",
        description: "",
        start_date: "",
        end_date: "",
      });

      set_message("Internship added successfully.");
      load_internships();
    } catch (error) {
      console.error("Error adding internship:", error);
      set_message("Error while adding internship.");
    }
  };

  const handle_delete_internship = async (internship_id) => {
    try {
      await deleteInternship(internship_id);
      set_message("Internship deleted successfully.");
      load_internships();
    } catch (error) {
      console.error("Error deleting internship:", error);
      set_message("Error while deleting internship.");
    }
  };

  return (
    <div className="student-section-card">
      <h2>Internship History</h2>
      <p className="student-mini-text">
        Add your previous internship experiences here.
      </p>

      {message && (
        <p style={{ marginTop: "12px", fontWeight: 600, color: "#4f46e5" }}>
          {message}
        </p>
      )}

      <div className="student-form-grid" style={{ marginTop: "20px" }}>
        <div className="student-form-group">
          <label>Company Name</label>
          <input
            type="text"
            name="company_name"
            value={form.company_name}
            onChange={handle_change}
          />
        </div>

        <div className="student-form-group">
          <label>Position</label>
          <input
            type="text"
            name="position"
            value={form.position}
            onChange={handle_change}
          />
        </div>

        <div className="student-form-group">
          <label>Start Date</label>
          <input
            type="date"
            name="start_date"
            value={form.start_date}
            onChange={handle_change}
          />
        </div>

        <div className="student-form-group">
          <label>End Date</label>
          <input
            type="date"
            name="end_date"
            value={form.end_date}
            onChange={handle_change}
          />
        </div>

        <div className="student-form-group full">
          <label>Description</label>
          <textarea
            name="description"
            rows="4"
            value={form.description}
            onChange={handle_change}
            placeholder="Describe your internship tasks and experience"
          />
        </div>
      </div>

      <div className="student-actions">
        <button
          className="student-primary-btn"
          onClick={handle_add_internship}
        >
          Add Internship
        </button>
      </div>

      {loading ? (
        <div className="student-empty-box" style={{ marginTop: "20px" }}>
          Loading internship history...
        </div>
      ) : internships.length === 0 ? (
        <div className="student-empty-box" style={{ marginTop: "20px" }}>
          No internship history added yet.
        </div>
      ) : (
        <div style={{ marginTop: "20px", display: "grid", gap: "16px" }}>
          {internships.map((internship) => (
            <div className="student-section-card" key={internship.id}>
              <h3 style={{ marginBottom: "8px" }}>{internship.company_name}</h3>

              <p className="student-mini-text">
                <strong>Position:</strong> {internship.position}
              </p>

              <p className="student-mini-text">
                <strong>Period:</strong> {internship.start_date} -{" "}
                {internship.end_date}
              </p>

              <p className="student-mini-text" style={{ marginTop: "10px" }}>
                {internship.description || "No description provided."}
              </p>

              <div className="student-actions">
                <button
                  className="student-danger-btn"
                  onClick={() => handle_delete_internship(internship.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Internships;