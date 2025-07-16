import { useQuery } from '@tanstack/react-query';
import { StoreEntity } from '@salaty/shared';
import { api } from '../fetcher';

export function useStores() {
  return useQuery<StoreEntity[]>({
    queryKey: ['stores'],
    queryFn: () => api('/stores'),
    retry: 1,
  });
}
