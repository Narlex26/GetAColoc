import { api } from "./client";
import type { Logement } from "../types";

export const logementsApi = {
  list: (params?: Record<string, unknown>) =>
    api.get<Logement[]>("/logements", { params }).then((r) => r.data),
  get: (id: number | string) => api.get<Logement>(`/logements/${id}`).then((r) => r.data),
  create: (data: Partial<Logement>) => api.post<Logement>("/logements", data).then((r) => r.data),
  update: (id: number | string, data: Partial<Logement>) =>
    api.put<Logement>(`/logements/${id}`, data).then((r) => r.data),
  remove: (id: number | string) => api.delete(`/logements/${id}`).then((r) => r.data),
};
