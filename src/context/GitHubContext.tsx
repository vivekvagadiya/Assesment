import React, { createContext, useContext, useEffect, useState } from 'react';
import { RateLimitInfo } from '../api/types/github';
import { subscribeToRateLimit, getCurrentRateLimit } from '../api/rateLimitState';
import { getGitHubToken, setGitHubToken as persistToken } from '../api/tokenStorage';

interface GitHubContextValue {
  rateLimit: RateLimitInfo | null;
  token: string | null;
  setToken: (token: string | null) => void;
  isRateLimited: boolean;
}

const GitHubContext = createContext<GitHubContextValue | undefined>(undefined);

export const GitHubProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [rateLimit, setRateLimit] = useState<RateLimitInfo | null>(getCurrentRateLimit());
  const [token, setTokenState] = useState<string | null>(getGitHubToken());

  useEffect(() => {
    // Subscribe to rate limit updates from API calls
    const unsubscribe = subscribeToRateLimit((info) => {
      setRateLimit(info);
    });

    const handleTokenChange = () => {
      setTokenState(getGitHubToken());
    };

    window.addEventListener('github-token-changed', handleTokenChange);

    return () => {
      unsubscribe();
      window.removeEventListener('github-token-changed', handleTokenChange);
    };
  }, []);

  const handleSetToken = (newToken: string | null) => {
    persistToken(newToken);
    setTokenState(newToken);
  };

  const isRateLimited = Boolean(rateLimit && rateLimit.remaining === 0);

  return (
    <GitHubContext.Provider
      value={{
        rateLimit,
        token,
        setToken: handleSetToken,
        isRateLimited,
      }}
    >
      {children}
    </GitHubContext.Provider>
  );
};

export function useGitHub(): GitHubContextValue {
  const context = useContext(GitHubContext);
  if (!context) {
    throw new Error('useGitHub must be used within a GitHubProvider');
  }
  return context;
}
