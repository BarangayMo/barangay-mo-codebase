
import { useQuery, UseQueryOptions } from '@tanstack/react-query';

export function useQueryWithDebug<T>(
  queryKey: (string | number)[],
  queryFn: () => Promise<T>,
  options?: Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'>
) {
  const result = useQuery({
    queryKey,
    queryFn,
    ...options,
  });

  // Debug logging
  console.log(`Query [${queryKey.join(', ')}]:`, {
    isLoading: result.isLoading,
    isError: result.isError,
    error: result.error,
    dataLength: Array.isArray(result.data) ? result.data.length : typeof result.data,
    isFetching: result.isFetching,
    status: result.status
  });

  return result;
}
