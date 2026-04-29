import { api } from './client';
import type { Utilisateur, UserType, Sexe } from '../types';

export interface LoginPayload {
  mail: string;
  password: string;
}

export interface RegisterPayload {
  mail: string;
  password: string;
  nom: string;
  prenom: string;
  type: UserType;
  telephone?: string;
  age?: number;
  sexe?: Sexe;
  description?: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token?: string;
  user: Utilisateur;
  message?: string;
}

export const authApi = {
  login: (data: LoginPayload) =>
    api.post<LoginResponse>('/auth/login', data).then(r => r.data),
  register: (data: RegisterPayload) =>
    api.post<{ message: string; user: Utilisateur }>('/auth/register', data).then(r => r.data),
  me: () => api.get<Utilisateur>('/auth/me').then(r => r.data),
};
