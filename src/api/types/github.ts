/**
 * GitHub API Models and Interfaces
 * Strongly typed DTOs and domain representations
 */

export interface GitHubOwner {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
  type: string;
}

export interface GitHubRepository {
  id: number;
  node_id: string;
  name: string;
  full_name: string;
  owner: GitHubOwner;
  private: boolean;
  html_url: string;
  description: string | null;
  fork: boolean;
  url: string;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  stargazers_count: number;
  watchers_count: number;
  language: string | null;
  forks_count: number;
  open_issues_count: number;
  default_branch: string;
  topics?: string[];
  license?: {
    key: string;
    name: string;
    spdx_id: string;
    url: string | null;
  } | null;
}

/**
 * GitHub User as returned by GET /search/users
 * Note: /search/users returns a shallow user object without followers/repos.
 */
export interface GitHubUserItem {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
  type: string;
  site_admin: boolean;
  score?: number;
}

/**
 * Detailed GitHub User as returned by GET /users/{username}
 */
export interface GitHubUserDetails extends GitHubUserItem {
  name: string | null;
  company: string | null;
  blog: string | null;
  location: string | null;
  email: string | null;
  bio: string | null;
  twitter_username: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

export interface GitHubIssueUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
}

export interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  user: GitHubIssueUser;
  state: 'open' | 'closed';
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  html_url: string;
  comments: number;
  body: string | null;
  pull_request?: {
    url: string;
    html_url: string;
  };
}

export interface GitHubSearchResponse<T> {
  total_count: number;
  incomplete_results: boolean;
  items: T[];
}

export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: Date;
  used: number;
}

export interface SearchRepositoriesParams {
  query: string;
  page?: number;
  perPage?: number;
  sort?: 'stars' | 'forks' | 'updated';
  order?: 'asc' | 'desc';
}

export interface SearchUsersParams {
  query: string;
  page?: number;
  perPage?: number;
  sort?: 'followers' | 'repositories' | 'joined';
  order?: 'asc' | 'desc';
}

export interface GetIssuesParams {
  state?: 'open' | 'closed' | 'all';
  perPage?: number;
  page?: number;
  sort?: 'created' | 'updated' | 'comments';
}
