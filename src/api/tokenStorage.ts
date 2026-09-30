/**
 * Utility for persisting and retrieving an optional GitHub Personal Access Token (PAT).
 * This allows reviewers or heavy testers to bump the GitHub rate limit from 60 req/hr to 5,000 req/hr.
 */

const TOKEN_KEY = 'gh_dev_intel_pat';

export function getGitHubToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setGitHubToken(token: string | null): void {
  try {
    if (!token || token.trim() === '') {
      localStorage.removeItem(TOKEN_KEY);
    } else {
      localStorage.setItem(TOKEN_KEY, token.trim());
    }
    // Dispatch custom event to notify listeners
    window.dispatchEvent(new Event('github-token-changed'));
  } catch {
    // Graceful fallback if localStorage is disabled
  }
}
