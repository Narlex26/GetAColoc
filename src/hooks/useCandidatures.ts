import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { logementsApi } from '../api/logements';

export const useCandidatures = (logementId: number) =>
  useQuery({
    queryKey: ['candidatures', logementId],
    queryFn: () => logementsApi.getCandidatures(logementId),
    enabled: !!logementId,
  });

export const useAddCandidature = (logementId: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { groupe_id: number; message?: string }) =>
      logementsApi.addCandidature(logementId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['candidatures', logementId] }),
  });
};

export const useValidateCandidature = (logementId: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (groupeId: number) => logementsApi.validateCandidature(logementId, groupeId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['candidatures', logementId] }),
  });
};
