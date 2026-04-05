import { useState } from "react";

function Skills() {
  const [skill_name, set_skill_name] = useState("");
  const [skill_level, set_skill_level] = useState("Beginner");
  const [skills, set_skills] = useState([]);

  const handle_add_skill = () => {
    if (!skill_name.trim()) {
      return;
    }

    const new_skill = {
      id: Date.now(),
      skill_name,
      skill_level,
    };

    set_skills((prev_skills) => [...prev_skills, new_skill]);
    set_skill_name("");
    set_skill_level("Beginner");
  };

  const handle_delete_skill = (skill_id) => {
    set_skills((prev_skills) =>
      prev_skills.filter((skill) => skill.id !== skill_id)
    );
  };

  return (
    <div className="student-section-card">
      <h2>Mes compétences</h2>
      <p className="student-mini-text">
        Ajoutez vos compétences techniques et leur niveau.
      </p>

      <div className="student-form-grid" style={{ marginTop: "20px" }}>
        <div className="student-form-group">
          <label>Compétence</label>
          <input
            type="text"
            value={skill_name}
            onChange={(event) => set_skill_name(event.target.value)}
            placeholder="Ex: React, Spring Boot, SQL..."
          />
        </div>

        <div className="student-form-group">
          <label>Niveau</label>
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
          Ajouter la compétence
        </button>
      </div>

      {skills.length === 0 ? (
        <div className="student-empty-box" style={{ marginTop: "20px" }}>
          Aucune compétence ajoutée pour le moment.
        </div>
      ) : (
        <div className="student-skills-list">
          {skills.map((skill) => (
            <div className="student-skill-chip" key={skill.id}>
              {skill.skill_name} - {skill.skill_level}
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