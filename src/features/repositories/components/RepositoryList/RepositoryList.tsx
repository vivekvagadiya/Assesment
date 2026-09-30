import React from 'react';
import { BookOpen, Search } from '../../../../components/ui/icons';
import { GitHubRepository } from '../../../../api/types/github';
import { RepositoryCard } from '../RepositoryCard/RepositoryCard';
import { Skeleton } from '../../../../components/ui/Skeleton';
import { EmptyState } from '../../../../components/ui/EmptyState';
import { ErrorAlert } from '../../../../components/ui/ErrorAlert';
import { Pagination } from '../../../../components/ui/Pagination';
import { getErrorMessage } from '../../../../api/errors';
import styles from './RepositoryList.module.css';

const REPO_SUGGESTIONS = ['react', 'typescript', 'rust', 'machine-learning', 'vite'];

export interface RepositoryListProps {
  repositories: GitHubRepository[];
  totalCount: number;
  currentPage: number;
  pageSize?: number;
  isLoading: boolean;
  error: Error | null;
  query: string;
  onPageChange: (page: number) => void;
  onSelectRepo: (fullName: string) => void;
  onSelectQuery?: (query: string) => void;
  onRetry?: () => void;
}

export const RepositoryList: React.FC<RepositoryListProps> = ({
  repositories,
  totalCount,
  currentPage,
  pageSize = 20,
  isLoading,
  error,
  query,
  onPageChange,
  onSelectRepo,
  onSelectQuery,
  onRetry,
}) => {
  if (error) {
    return (
      <ErrorAlert
        title="Failed to load repositories"
        message={getErrorMessage(error)}
        onRetry={onRetry}
      />
    );
  }

  if (isLoading && repositories.length === 0) {
    return (
      <div className={styles.grid}>
        {Array.from({ length: 6 }).map((_, idx) => (
          <div key={`repo-skeleton-${idx}`} className={styles.skeletonCard}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Skeleton variant="circular" width={24} height={24} />
              <Skeleton variant="text" width="60%" height={18} />
            </div>
            <Skeleton variant="text" width="90%" height={14} />
            <Skeleton variant="text" width="70%" height={14} />
            <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between' }}>
              <Skeleton variant="text" width={60} height={16} />
              <Skeleton variant="text" width={80} height={16} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!query.trim()) {
    return (
      <EmptyState
        icon={<Search size={28} />}
        title="Explore GitHub Repositories"
        description="Search across millions of open-source projects by typing in keywords, project names, or languages."
        action={
          onSelectQuery ? (
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '4px' }}>
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', width: '100%', marginBottom: '4px' }}>
                Quick suggestions:
              </span>
              {REPO_SUGGESTIONS.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => onSelectQuery(term)}
                  style={{
                    padding: '4px 12px',
                    fontSize: 'var(--font-size-xs)',
                    backgroundColor: 'var(--color-surface-raised)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-full)',
                    color: 'var(--color-accent)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {term}
                </button>
              ))}
            </div>
          ) : undefined
        }
      />
    );
  }

  if (repositories.length === 0) {
    return (
      <EmptyState
        icon={<BookOpen size={28} />}
        title="No repositories found"
        description={`No repositories matched your search for "${query}". Try refining your keywords or changing the language filter.`}
      />
    );
  }

  return (
    <div>
      <div className={styles.grid}>
        {repositories.map((repo) => (
          <RepositoryCard
            key={repo.id}
            repository={repo}
            onSelect={onSelectRepo}
          />
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalCount={totalCount}
        pageSize={pageSize}
        onPageChange={onPageChange}
      />
    </div>
  );
};
