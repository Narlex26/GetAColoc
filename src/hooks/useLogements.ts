import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { logementsApi } from '../api/logements';
import type { LogementPayload } from '../api/logements';

export const useLogements = (params?: Parameters<typeof logementsApi.list>[0]) =>
  useQuery({
    queryKey: ['logements', params],
    queryFn: () => logementsApi.list(params),
  });

export const useLogement = (id: number) =>
  useQuery({
    queryKey: ['logement', id],
    queryFn: () => logementsApi.get(id),
    enabled: !!id,
  });

export const useCreateLogement = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: LogementPayload) => logementsApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['logements'] }),
  });
};

export const useUpdateLogement = (id: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<LogementPayload>) => logementsApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['logements'] });
      qc.invalidateQueries({ queryKey: ['logement', id] });
    },
  });
};

export const useDeleteLogement = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => logementsApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['logements'] }),
  });
};
