import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { searchUsers } from '../../../api/githubEndpoints';
import { GitHubSearchResponse, GitHubUserItem } from '../../../api/types/github';

export interface UseSearchUsersOptions {
  query: string;
  page?: number;
  perPage?: number;
  enabled?: boolean;
}

export function useSearchUsersQuery({
  query,
  page = 1,
  perPage = 20,
  enabled = true,
}: UseSearchUsersOptions) {
  const fullQuery = query.trim();

  return useQuery<GitHubSearchResponse<GitHubUserItem>, Error>({
    queryKey: ['users', fullQuery, page, perPage],
    queryFn: ({ signal }) =>
      searchUsers(
        {
          query: fullQuery,
          page,
          perPage,
        },
        signal
      ),
    enabled: enabled && fullQuery.length > 0,
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    placeholderData: keepPreviousData,
    retry: (failureCount, error) => {
      if ('status' in error && (error.status === 404 || error.status === 422 || error.status === 403)) {
        return false;
      }
      return failureCount < 2;
    },
  });
}
