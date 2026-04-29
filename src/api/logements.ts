import { api } from './client';
import type { Logement, Groupe } from '../types';

export interface LogementPayload {
  code_postal: string;
  ville: string;
  quartier?: string;
  prix: number;
  superficie?: string;
  etage?: number;
  meuble?: boolean;
}

export const logementsApi = {
  list: (params?: { ville?: string; code_postal?: string; prix_min?: number; prix_max?: number; meuble?: boolean }) =>
    api.get<Logement[]>('/logements', { params }).then(r => r.data),
  get: (id: number) =>
    api.get<Logement>(`/logements/${id}`).then(r => r.data),
  create: (data: LogementPayload) =>
    api.post<{ message: string; logement: Logement }>('/logements', data).then(r => r.data),
  update: (id: number, data: Partial<LogementPayload>) =>
    api.put<{ message: string; logement: Logement }>(`/logements/${id}`, data).then(r => r.data),
  remove: (id: number) =>
    api.delete(`/logements/${id}`).then(r => r.data),
  getCandidatures: (logementId: number) =>
    api.get<Groupe[]>(`/logements/${logementId}/candidatures`).then(r => r.data),
  addCandidature: (logementId: number, data: { groupe_id: number; message?: string }) =>
    api.post(`/logements/${logementId}/candidatures`, data).then(r => r.data),
  validateCandidature: (logementId: number, groupeId: number) =>
    api.put(`/logements/${logementId}/candidatures/${groupeId}/valider`).then(r => r.data),
};
