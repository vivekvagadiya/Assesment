import { useQuery } from '@tanstack/react-query';
import { getUserDetails } from '../../../api/githubEndpoints';
import { GitHubUserDetails } from '../../../api/types/github';

export function useEnrichedUser(username: string, enabled = true) {
  return useQuery<GitHubUserDetails, Error>({
    queryKey: ['user-details', username],
    queryFn: ({ signal }) => getUserDetails(username, signal),
    enabled: enabled && Boolean(username),
    staleTime: 10 * 60 * 1000, // Cache user details for 10 minutes
    gcTime: 30 * 60 * 1000,
    retry: (failureCount, error) => {
      if ('status' in error && (error.status === 404 || error.status === 403)) {
        return false;
      }
      return failureCount < 1;
    },
  });
}
