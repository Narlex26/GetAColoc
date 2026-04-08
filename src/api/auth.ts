import { api } from "./client";

export interface LoginPayload { email: string; password: string; }
export interface RegisterPayload { email: string; password: string; nom?: string; prenom?: string; }
export interface AuthResponse { access_token: string; user?: unknown; }

export const authApi = {
  login: (data: LoginPayload) => api.post<AuthResponse>("/auth/login", data).then((r) => r.data),
  register: (data: RegisterPayload) => api.post<AuthResponse>("/auth/register", data).then((r) => r.data),
  me: () => api.get("/auth/me").then((r) => r.data),
};
