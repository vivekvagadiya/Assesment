import { useQuery } from '@tanstack/react-query';
import { getRepositoryIssues } from '../../../api/githubEndpoints';
import { GitHubIssue } from '../../../api/types/github';

export interface UseRepositoryIssuesOptions {
  fullName: string | null;
  state?: 'open' | 'closed' | 'all';
  perPage?: number;
  page?: number;
}

export function useRepositoryIssuesQuery({
  fullName,
  state = 'open',
  perPage = 10,
  page = 1,
}: UseRepositoryIssuesOptions) {
  const parts = fullName ? fullName.split('/') : [];
  const owner = parts[0] || '';
  const repo = parts[1] || '';
  const enabled = Boolean(owner && repo);

  return useQuery<GitHubIssue[], Error>({
    queryKey: ['repository-issues', owner, repo, state, perPage, page],
    queryFn: ({ signal }) =>
      getRepositoryIssues(
        owner,
        repo,
        {
          state,
          perPage,
          page,
          sort: 'updated',
        },
        signal
      ),
    enabled,
    staleTime: 3 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: (failureCount, error) => {
      if ('status' in error && (error.status === 404 || error.status === 403)) {
        return false;
      }
      return failureCount < 2;
    },
  });
}
