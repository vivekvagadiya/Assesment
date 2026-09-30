import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { searchRepositories } from '../../../api/githubEndpoints';
import { GitHubRepository, GitHubSearchResponse } from '../../../api/types/github';

export interface UseSearchRepositoriesOptions {
  query: string;
  page?: number;
  perPage?: number;
  language?: string;
  enabled?: boolean;
}

export function useSearchRepositoriesQuery({
  query,
  page = 1,
  perPage = 20,
  language,
  enabled = true,
}: UseSearchRepositoriesOptions) {
  // Construct search query with optional language filter
  let fullQuery = query.trim();
  if (language && language.trim() && !fullQuery.includes('language:')) {
    fullQuery = `${fullQuery} language:${language.trim()}`;
  }

  return useQuery<GitHubSearchResponse<GitHubRepository>, Error>({
    queryKey: ['repositories', fullQuery, page, perPage],
    queryFn: ({ signal }) =>
      searchRepositories(
        {
          query: fullQuery,
          page,
          perPage,
        },
        signal
      ),
    enabled: enabled && fullQuery.length > 0,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    gcTime: 15 * 60 * 1000,    // Retain in cache for 15 minutes
    placeholderData: keepPreviousData, // Smooth pagination transitions
    retry: (failureCount, error) => {
      // Do not retry 404, 422, or 403 Rate Limit errors
      if ('status' in error && (error.status === 404 || error.status === 422 || error.status === 403)) {
        return false;
      }
      return failureCount < 2;
    },
  });
}
