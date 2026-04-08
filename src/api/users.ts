import { api } from "./client";

export const usersApi = {
  list: () => api.get("/users").then((r) => r.data),
  get: (id: number | string) => api.get(`/users/${id}`).then((r) => r.data),
  update: (id: number | string, data: Record<string, unknown>) =>
    api.put(`/users/${id}`, data).then((r) => r.data),
};
