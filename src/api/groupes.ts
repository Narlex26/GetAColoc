import { api } from './client';
import type { Groupe } from '../types';

export const groupesApi = {
  getAll: () =>
    api.get<Groupe[]>('/groupes').then(r => r.data),
  getById: (id: number) =>
    api.get<Groupe>(`/groupes/${id}`).then(r => r.data),
  getMes: () =>
    api.get<Groupe[]>('/groupes/mes-groupes').then(r => r.data),
  create: (data: { description?: string }) =>
    api.post<{ message: string; groupe: Groupe }>('/groupes', data).then(r => r.data),
  update: (id: number, data: { description?: string }) =>
    api.put<{ message: string; groupe: Groupe }>(`/groupes/${id}`, data).then(r => r.data),
  delete: (id: number) =>
    api.delete(`/groupes/${id}`).then(r => r.data),
  addMembre: (groupeId: number, locataireId: number, isAdmin = false) =>
    api.post(`/groupes/${groupeId}/membres`, { locataire_id: locataireId, is_admin: isAdmin }).then(r => r.data),
  removeMembre: (groupeId: number, locataireId: number) =>
    api.delete(`/groupes/${groupeId}/membres/${locataireId}`).then(r => r.data),
};
