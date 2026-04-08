import { api } from "./client";

export const groupesApi = {
  list: () => api.get("/groupes").then((r) => r.data),
  get: (id: number | string) => api.get(`/groupes/${id}`).then((r) => r.data),
  create: (data: Record<string, unknown>) => api.post("/groupes", data).then((r) => r.data),
  join: (id: number | string) => api.post(`/groupes/${id}/join`).then((r) => r.data),
};
