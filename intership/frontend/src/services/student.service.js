import api from "./api";

export const getProfile = () => {
  return api.get("/student/profile");
};

export const updateProfile = (data) => {
  return api.put("/student/profile", data);
};