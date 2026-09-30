import { useQuery } from '@tanstack/react-query';
import { getRepositoryDetails } from '../../../api/githubEndpoints';
import { GitHubRepository } from '../../../api/types/github';

export function useRepositoryDetailsQuery(fullName: string | null) {
  const parts = fullName ? fullName.split('/') : [];
  const owner = parts[0] || '';
  const repo = parts[1] || '';
  const enabled = Boolean(owner && repo);

  return useQuery<GitHubRepository, Error>({
    queryKey: ['repository', owner, repo],
    queryFn: ({ signal }) => getRepositoryDetails(owner, repo, signal),
    enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    retry: (failureCount, error) => {
      if ('status' in error && (error.status === 404 || error.status === 403)) {
        return false;
      }
      return failureCount < 2;
    },
  });
}
