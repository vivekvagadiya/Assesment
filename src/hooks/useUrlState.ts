import { useState, useEffect, useCallback } from 'react';

export type SearchTabType = 'repos' | 'users';

export interface UrlSearchState {
  query: string;
  tab: SearchTabType;
  page: number;
  selectedRepo: string | null; // e.g. "facebook/react" for details modal
  language: string;
}

function parseUrlState(): UrlSearchState {
  if (typeof window === 'undefined') {
    return {
      query: '',
      tab: 'repos',
      page: 1,
      selectedRepo: null,
      language: '',
    };
  }

  const params = new URLSearchParams(window.location.search);
  const query = params.get('q') || '';
  const tab = (params.get('type') === 'users' ? 'users' : 'repos') as SearchTabType;
  const page = Math.max(1, parseInt(params.get('page') || '1', 10) || 1);
  const selectedRepo = params.get('repo') || null;
  const language = params.get('lang') || '';

  return {
    query,
    tab,
    page,
    selectedRepo,
    language,
  };
}

export function useUrlState() {
  const [state, setState] = useState<UrlSearchState>(parseUrlState);

  // Sync state when browser back/forward buttons are pressed
  useEffect(() => {
    const handlePopState = () => {
      setState(parseUrlState());
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const updateState = useCallback(
    (updates: Partial<UrlSearchState>, options: { replace?: boolean } = {}) => {
      setState((prev) => {
        const next: UrlSearchState = { ...prev, ...updates };

        const params = new URLSearchParams();
        if (next.query.trim()) params.set('q', next.query.trim());
        if (next.tab !== 'repos') params.set('type', next.tab);
        if (next.page > 1) params.set('page', String(next.page));
        if (next.selectedRepo) params.set('repo', next.selectedRepo);
        if (next.language) params.set('lang', next.language);

        const newSearch = params.toString() ? `?${params.toString()}` : window.location.pathname;

        if (options.replace) {
          window.history.replaceState(null, '', newSearch);
        } else {
          window.history.pushState(null, '', newSearch);
        }

        return next;
      });
    },
    []
  );

  return {
    ...state,
    setQuery: (query: string, replace = false) =>
      updateState({ query, page: 1 }, { replace }),
    setTab: (tab: SearchTabType) =>
      updateState({ tab, page: 1 }),
    setPage: (page: number) =>
      updateState({ page }),
    setSelectedRepo: (selectedRepo: string | null) =>
      updateState({ selectedRepo }),
    setLanguage: (language: string) =>
      updateState({ language, page: 1 }),
  };
}
