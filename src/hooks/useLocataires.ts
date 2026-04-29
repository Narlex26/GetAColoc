import { useQuery } from '@tanstack/react-query';
import { usersApi } from '../api/users';

export const useLocataires = (params?: Parameters<typeof usersApi.getLocataires>[0]) =>
  useQuery({
    queryKey: ['locataires', params],
    queryFn: () => usersApi.getLocataires(params),
  });
