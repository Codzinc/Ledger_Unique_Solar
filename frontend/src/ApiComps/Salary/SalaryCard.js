import api from "../Config";

export const getAdvances = async (employeeName) => {
  const params = employeeName ? { employee: employeeName } : {};
  const response = await api.get("/salary/advance/", { params });
  return response.data.results;
};

export const createAdvance = async (advanceData) => {
  const response = await api.post("/salary/advance/", advanceData);
  return response.data.data;
};

export const updateAdvance = async (id, advanceData) => {
  const response = await api.put(`/salary/advance/${id}/`, advanceData);
  return response.data.data;
};

export const deleteAdvance = async (id) => {
  await api.delete(`/salary/advance/${id}/`);
  return true;
};

