/**
 * Normalized HTTP and GitHub API Errors
 */

export class HttpError extends Error {
  public readonly status: number;
  public readonly statusText: string;
  public readonly responseBody?: unknown;

  constructor(status: number, statusText: string, message: string, responseBody?: unknown) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.statusText = statusText;
    this.responseBody = responseBody;
  }
}

export class RateLimitError extends HttpError {
  public readonly resetTime: Date;
  public readonly remaining: number;

  constructor(resetTime: Date, remaining = 0, message?: string) {
    const formattedReset = resetTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const defaultMsg = `GitHub API rate limit exceeded. Limit will reset at ${formattedReset}. You can provide an optional GitHub token in settings to increase the rate limit.`;
    super(403, 'Forbidden (Rate Limited)', message || defaultMsg);
    this.name = 'RateLimitError';
    this.resetTime = resetTime;
    this.remaining = remaining;
  }
}

export class NotFoundError extends HttpError {
  constructor(resource: string = 'Resource') {
    super(404, 'Not Found', `${resource} could not be found.`);
    this.name = 'NotFoundError';
  }
}

export class ValidationError extends HttpError {
  constructor(message = 'The search query was invalid or unprocessable.') {
    super(422, 'Unprocessable Entity', message);
    this.name = 'ValidationError';
  }
}

export class NetworkError extends Error {
  constructor(message = 'Network error: Please check your internet connection and try again.') {
    super(message);
    this.name = 'NetworkError';
  }
}

/**
 * Helper to determine user-friendly message from an unknown error
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof RateLimitError) {
    return error.message;
  }
  if (error instanceof NotFoundError) {
    return error.message;
  }
  if (error instanceof ValidationError) {
    return error.message;
  }
  if (error instanceof HttpError) {
    return `GitHub API error (${error.status}): ${error.message}`;
  }
  if (error instanceof NetworkError) {
    return error.message;
  }
  if (error instanceof Error) {
    if (error.name === 'AbortError') {
      return 'Request was cancelled.';
    }
    return error.message;
  }
  return 'An unexpected error occurred. Please try again.';
}
