import api from "./api";

/**
 * Profile
 */
export const getProfile = () => {
  return api.get("/student/profile");
};

export const updateProfile = (data) => {
  return api.put("/student/profile", data);
};

/**
 * Documents
 */
export const uploadCv = (form_data) => {
  return api.post("/student/upload-cv", form_data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const uploadProfilePicture = (form_data) => {
  return api.post("/student/upload-profile-picture", form_data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const downloadMyCv = () => {
  return api.get("/student/cv", {
    responseType: "blob",
  });
};

export const downloadProfilePicture = () => {
  return api.get("/student/profile-picture", {
    responseType: "blob",
  });
};

/**
 * Skills
 */
export const getSkills = () => {
  return api.get("/student/skills");
};

export const addSkill = (data) => {
  return api.post("/student/skills", data);
};

export const deleteSkill = (skill_id) => {
  return api.delete(`/student/skills/${skill_id}`);
};

/**
 * Internships
 */
export const getInternships = () => {
  return api.get("/student/internships");
};

export const addInternship = (data) => {
  return api.post("/student/internships", data);
};

export const deleteInternship = (internship_id) => {
  return api.delete(`/student/internships/${internship_id}`);
};