import { useEffect, useState } from "react";
import {
  addSkill,
  deleteSkill,
  getSkills,
} from "../../services/student.service";

function Skills({ onUpdate }) {
  const [skill_name, set_skill_name] = useState("");
  const [skill_level, set_skill_level] = useState("Beginner");
  const [skills, set_skills] = useState([]);
  const [message, set_message] = useState("");
  const [loading, set_loading] = useState(true);

  const load_skills = async () => {
    try {
      const response = await getSkills();
      set_skills(response.data);
    } catch (error) {
      console.error("Error loading skills:", error);
      set_message("Unable to load skills.");
    } finally {
      set_loading(false);
    }
  };

  useEffect(() => {
    load_skills();
  }, []);

  const format_skill_level = (level) => {
    switch (level) {
      case "BEGINNER":
        return "Beginner";
      case "INTERMEDIATE":
        return "Intermediate";
      case "ADVANCED":
        return "Advanced";
      case "EXPERT":
        return "Expert";
      default:
        return level;
    }
  };

  const handle_add_skill = async () => {
    if (!skill_name.trim()) {
      set_message("Please enter a skill name.");
      return;
    }

    try {
      set_message("");

      await addSkill({
        skill_name,
        skill_level,
      });

      set_skill_name("");
      set_skill_level("Beginner");
      set_message("Skill added successfully.");
      await load_skills();

      // Trigger refresh in parent component
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error("Error adding skill:", error);
      set_message("Error while adding skill.");
    }
  };

  const handle_delete_skill = async (skill_id) => {
    try {
      await deleteSkill(skill_id);
      set_message("Skill deleted successfully.");
      await load_skills();

      // Trigger refresh in parent component
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error("Error deleting skill:", error);
      set_message("Error while deleting skill.");
    }
  };

  return (
    <div className="student-section-card">
      <h2>My Skills</h2>
      <p className="student-mini-text">
        Add your technical and professional skills.
      </p>

      {message && (
        <p style={{ marginTop: "12px", fontWeight: 600, color: "#4f46e5" }}>
          {message}
        </p>
      )}

      <div className="student-form-grid" style={{ marginTop: "20px" }}>
        <div className="student-form-group">
          <label>Skill Name</label>
          <input
            type="text"
            value={skill_name}
            onChange={(event) => set_skill_name(event.target.value)}
            placeholder="Example: React, Spring Boot, SQL"
          />
        </div>

        <div className="student-form-group">
          <label>Skill Level</label>
          <select
            value={skill_level}
            onChange={(event) => set_skill_level(event.target.value)}
          >
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
            <option>Expert</option>
          </select>
        </div>
      </div>

      <div className="student-actions">
        <button className="student-primary-btn" onClick={handle_add_skill}>
          Add Skill
        </button>
      </div>

      {loading ? (
        <div className="student-empty-box" style={{ marginTop: "20px" }}>
          Loading skills...
        </div>
      ) : skills.length === 0 ? (
        <div className="student-empty-box" style={{ marginTop: "20px" }}>
          No skills added yet.
        </div>
      ) : (
        <div className="student-skills-list">
          {skills.map((skill) => (
            <div className="student-skill-chip" key={skill.id}>
              {skill.skill_name} - {format_skill_level(skill.skill_level)}
              <button
                onClick={() => handle_delete_skill(skill.id)}
                style={{
                  marginLeft: "10px",
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  color: "#e11d48",
                  fontWeight: "700",
                }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Skills;