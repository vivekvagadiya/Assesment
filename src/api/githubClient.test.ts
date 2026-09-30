import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { githubFetch } from './githubClient';
import { RateLimitError, NotFoundError, ValidationError, NetworkError } from './errors';
import { getCurrentRateLimit } from './rateLimitState';
import { setGitHubToken } from './tokenStorage';

describe('githubClient', () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
    setGitHubToken(null);
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('successfully fetches data and parses rate-limit headers', async () => {
    const mockData = { id: 1, name: 'react' };
    const mockHeaders = new Headers({
      'x-ratelimit-limit': '60',
      'x-ratelimit-remaining': '55',
      'x-ratelimit-reset': '1700000000',
      'x-ratelimit-used': '5',
      'content-type': 'application/json',
    });

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: mockHeaders,
      json: async () => mockData,
    });

    const result = await githubFetch<typeof mockData>('/repos/facebook/react');
    expect(result).toEqual(mockData);

    const rateLimit = getCurrentRateLimit();
    expect(rateLimit).not.toBeNull();
    expect(rateLimit?.limit).toBe(60);
    expect(rateLimit?.remaining).toBe(55);
  });

  it('injects Authorization header when token is stored', async () => {
    setGitHubToken('ghp_test_token_123');

    const fetchSpy = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers(),
      json: async () => ({}),
    });
    globalThis.fetch = fetchSpy;

    await githubFetch('/users/octocat');

    expect(fetchSpy).toHaveBeenCalled();
    const callArgs = fetchSpy.mock.calls[0];
    const headers = callArgs[1]?.headers as Headers;
    expect(headers.get('Authorization')).toBe('Bearer ghp_test_token_123');
  });

  it('throws RateLimitError when 403 status is returned with rate limit message', async () => {
    const mockHeaders = new Headers({
      'x-ratelimit-limit': '60',
      'x-ratelimit-remaining': '0',
      'x-ratelimit-reset': '1700000000',
    });

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 403,
      statusText: 'Forbidden',
      headers: mockHeaders,
      json: async () => ({ message: 'API rate limit exceeded for 127.0.0.1' }),
    });

    await expect(githubFetch('/search/repositories?q=react')).rejects.toThrow(RateLimitError);
  });

  it('throws NotFoundError when 404 is returned', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found',
      headers: new Headers(),
      json: async () => ({ message: 'Not Found' }),
    });

    await expect(githubFetch('/repos/nonexistent/repo')).rejects.toThrow(NotFoundError);
  });

  it('throws ValidationError when 422 is returned', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 422,
      statusText: 'Unprocessable Entity',
      headers: new Headers(),
      json: async () => ({ message: 'Validation Failed' }),
    });

    await expect(githubFetch('/search/repositories')).rejects.toThrow(ValidationError);
  });

  it('normalizes network failures into NetworkError', async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new TypeError('Failed to fetch'));

    await expect(githubFetch('/users/octocat')).rejects.toThrow(NetworkError);
  });
});
