import { api } from './client';
import type { Utilisateur, Locataire, Proprietaire, Sexe } from '../types';

export interface UpdateUserPayload {
  nom?: string;
  prenom?: string;
  telephone?: string;
  age?: number;
  sexe?: Sexe;
  description?: string;
}

export const usersApi = {
  getById: (id: number) =>
    api.get<Utilisateur>(`/users/${id}`).then(r => r.data),
  update: (id: number, data: UpdateUserPayload) =>
    api.put<{ message: string; user: Utilisateur }>(`/users/${id}`, data).then(r => r.data),
  getLocataires: (params?: { age_min?: number; age_max?: number; sexe?: Sexe }) =>
    api.get<Locataire[]>('/users/locataires', { params }).then(r => r.data),
  getProprietaires: () =>
    api.get<Proprietaire[]>('/users/proprietaires').then(r => r.data),
};
