import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Compass, Sparkles, Moon, Sun } from 'lucide-react';
import { GitHubProvider } from './context/GitHubContext';
import { RateLimitBanner } from './components/feedback/RateLimitBanner';
import { SearchBar } from './features/search/components/SearchBar/SearchBar';
import { RepositoryList } from './features/repositories/components/RepositoryList/RepositoryList';
import { UserList } from './features/users/components/UserList/UserList';
import { UserDetailModal } from './features/users/components/UserDetailModal/UserDetailModal';
import { RepositoryDetailModal } from './features/repositories/components/RepositoryDetailModal/RepositoryDetailModal';
import { useUrlState } from './hooks/useUrlState';
import { useDebounce } from './hooks/useDebounce';
import { useSearchRepositoriesQuery } from './features/search/hooks/useSearchRepositoriesQuery';
import { useSearchUsersQuery } from './features/search/hooks/useSearchUsersQuery';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

const DashboardContent: React.FC = () => {
  const {
    query,
    tab,
    page,
    language,
    selectedRepo,
    setQuery,
    setTab,
    setPage,
    setSelectedRepo,
    setLanguage,
  } = useUrlState();

  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  // Debounce search query by 380ms to avoid excessive API requests while typing
  const debouncedQuery = useDebounce(query, 380);

  // Queries
  const {
    data: repoData,
    isLoading: isRepoLoading,
    error: repoError,
    refetch: refetchRepos,
  } = useSearchRepositoriesQuery({
    query: debouncedQuery,
    page,
    language,
    enabled: tab === 'repos',
  });

  const {
    data: userData,
    isLoading: isUserLoading,
    error: userError,
    refetch: refetchUsers,
  } = useSearchUsersQuery({
    query: debouncedQuery,
    page,
    enabled: tab === 'users',
  });

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <RateLimitBanner />

      <header
        style={{
          borderBottom: '1px solid var(--color-border)',
          backgroundColor: 'var(--color-surface)',
          padding: 'var(--space-3) 0',
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <Compass size={24} color="var(--color-accent)" />
            <div>
              <h1 style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-bold)', margin: 0 }}>
                Developer Intelligence
              </h1>
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
                GitHub Search & Insights
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <button
              type="button"
              onClick={toggleTheme}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 'var(--space-2)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--color-text-secondary)',
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-surface)',
                cursor: 'pointer',
              }}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: 'var(--font-size-xs)',
                color: 'var(--color-text-secondary)',
                padding: '4px 8px',
                backgroundColor: 'var(--color-surface-raised)',
                borderRadius: 'var(--radius-full)',
              }}
            >
              <Sparkles size={12} color="var(--color-accent)" />
              Sprint 4: Active
            </span>
          </div>
        </div>
      </header>

      <main
        className="container"
        style={{ flex: 1, padding: 'var(--space-6) var(--space-4)' }}
      >
        <SearchBar
          query={query}
          onQueryChange={(val) => setQuery(val, true)}
          activeTab={tab}
          onTabChange={setTab}
          language={language}
          onLanguageChange={setLanguage}
          repoCount={repoData?.total_count}
          userCount={userData?.total_count}
          isLoading={isRepoLoading || isUserLoading}
        />

        {tab === 'repos' ? (
          <RepositoryList
            repositories={repoData?.items || []}
            totalCount={repoData?.total_count || 0}
            currentPage={page}
            pageSize={20}
            isLoading={isRepoLoading}
            error={repoError}
            query={debouncedQuery}
            onPageChange={setPage}
            onSelectRepo={setSelectedRepo}
            onRetry={refetchRepos}
          />
        ) : (
          <UserList
            users={userData?.items || []}
            totalCount={userData?.total_count || 0}
            currentPage={page}
            pageSize={20}
            isLoading={isUserLoading}
            error={userError}
            query={debouncedQuery}
            onPageChange={setPage}
            onSelectUser={setSelectedUser}
            onRetry={refetchUsers}
          />
        )}

        {/* On-Demand Developer Details Modal */}
        <UserDetailModal
          username={selectedUser}
          onClose={() => setSelectedUser(null)}
        />

        {/* On-Demand Repository Details & Issues Explorer Modal */}
        <RepositoryDetailModal
          fullName={selectedRepo}
          onClose={() => setSelectedRepo(null)}
        />
      </main>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <GitHubProvider>
        <DashboardContent />
      </GitHubProvider>
    </QueryClientProvider>
  );
};

export default App;
