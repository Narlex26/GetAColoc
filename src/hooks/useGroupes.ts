import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { groupesApi } from '../api/groupes';

export const useMesGroupes = () =>
  useQuery({
    queryKey: ['mes-groupes'],
    queryFn: () => groupesApi.getMes(),
  });

export const useCreateGroupe = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { description?: string }) => groupesApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['mes-groupes'] }),
  });
};

export const useAddMembre = (groupeId: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (locataireId: number) => groupesApi.addMembre(groupeId, locataireId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['mes-groupes'] }),
  });
};

export const useRemoveMembre = (groupeId: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (locataireId: number) => groupesApi.removeMembre(groupeId, locataireId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['mes-groupes'] }),
  });
};

export const useDeleteGroupe = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => groupesApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['mes-groupes'] }),
  });
};
