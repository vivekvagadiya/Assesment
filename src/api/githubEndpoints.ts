import { githubFetch } from './githubClient';
import {
  GitHubRepository,
  GitHubSearchResponse,
  GitHubUserDetails,
  GitHubUserItem,
  GitHubIssue,
  SearchRepositoriesParams,
  SearchUsersParams,
  GetIssuesParams,
} from './types/github';

/**
 * 5.1 & 5.2: Search GitHub Repositories
 */
export async function searchRepositories(
  params: SearchRepositoriesParams,
  signal?: AbortSignal
): Promise<GitHubSearchResponse<GitHubRepository>> {
  const { query, page = 1, perPage = 20, sort, order } = params;

  return githubFetch<GitHubSearchResponse<GitHubRepository>>('/search/repositories', {
    params: {
      q: query,
      page,
      per_page: perPage,
      sort,
      order,
    },
    signal,
  });
}

/**
 * 5.1 & 5.3: Search GitHub Users
 */
export async function searchUsers(
  params: SearchUsersParams,
  signal?: AbortSignal
): Promise<GitHubSearchResponse<GitHubUserItem>> {
  const { query, page = 1, perPage = 20, sort, order } = params;

  return githubFetch<GitHubSearchResponse<GitHubUserItem>>('/search/users', {
    params: {
      q: query,
      page,
      per_page: perPage,
      sort,
      order,
    },
    signal,
  });
}

/**
 * 5.3: Fetch full details for a GitHub User (needed for followers, repos, bio, location)
 */
export async function getUserDetails(
  username: string,
  signal?: AbortSignal
): Promise<GitHubUserDetails> {
  return githubFetch<GitHubUserDetails>(`/users/${encodeURIComponent(username)}`, {
    signal,
  });
}

/**
 * 5.4: Fetch detailed repository metadata
 */
export async function getRepositoryDetails(
  owner: string,
  repo: string,
  signal?: AbortSignal
): Promise<GitHubRepository> {
  return githubFetch<GitHubRepository>(
    `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`,
    {
      signal,
    }
  );
}

/**
 * 5.5: Fetch recent repository issues
 */
export async function getRepositoryIssues(
  owner: string,
  repo: string,
  params: GetIssuesParams = {},
  signal?: AbortSignal
): Promise<GitHubIssue[]> {
  const { state = 'open', perPage = 10, page = 1, sort = 'updated' } = params;

  return githubFetch<GitHubIssue[]>(
    `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/issues`,
    {
      params: {
        state,
        per_page: perPage,
        page,
        sort,
      },
      signal,
    }
  );
}
