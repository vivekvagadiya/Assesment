import {
  HttpError,
  RateLimitError,
  NotFoundError,
  ValidationError,
  NetworkError,
} from './errors';
import { updateRateLimitFromHeaders } from './rateLimitState';
import { getGitHubToken } from './tokenStorage';

const GITHUB_API_BASE_URL = 'https://api.github.com';

export interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

/**
 * Robust fetch wrapper for GitHub REST API
 */
export async function githubFetch<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { params, headers: customHeaders, signal, ...restOptions } = options;

  // Construct URL with query parameters
  const url = new URL(
    endpoint.startsWith('http') ? endpoint : `${GITHUB_API_BASE_URL}${endpoint}`
  );

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.append(key, String(value));
      }
    });
  }

  // Construct headers
  const headers = new Headers(customHeaders);
  headers.set('Accept', 'application/vnd.github.v3+json');

  // Inject optional personal access token if present
  const token = getGitHubToken();
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  let response: Response;

  try {
    response = await fetch(url.toString(), {
      ...restOptions,
      headers,
      signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      // Re-throw abort error for query cancellation
      throw error;
    }
    throw new NetworkError(
      error instanceof Error ? error.message : 'Failed to connect to GitHub API'
    );
  }

  // Always update rate limit telemetry from response headers
  const rateLimit = updateRateLimitFromHeaders(response.headers);

  // Handle non-2xx status codes
  if (!response.ok) {
    let responseBody: unknown;
    let message = response.statusText;

    try {
      responseBody = await response.json();
      if (
        responseBody &&
        typeof responseBody === 'object' &&
        'message' in responseBody
      ) {
        message = String((responseBody as { message: unknown }).message);
      }
    } catch {
      // Ignore JSON parse error on non-JSON body
    }

    if (response.status === 403 && (response.headers.get('x-ratelimit-remaining') === '0' || message.toLowerCase().includes('rate limit'))) {
      const resetTime = rateLimit?.reset || new Date(Date.now() + 60 * 60 * 1000);
      throw new RateLimitError(resetTime, rateLimit?.remaining ?? 0, message);
    }

    if (response.status === 404) {
      throw new NotFoundError(endpoint);
    }

    if (response.status === 422) {
      throw new ValidationError(message);
    }

    throw new HttpError(response.status, response.statusText, message, responseBody);
  }

  return (await response.json()) as T;
}
