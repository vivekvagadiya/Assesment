import React from 'react';
import { Users, Search } from '../../../../components/ui/icons';
import { GitHubUserItem } from '../../../../api/types/github';
import { UserCard } from '../UserCard/UserCard';
import { Skeleton } from '../../../../components/ui/Skeleton';
import { EmptyState } from '../../../../components/ui/EmptyState';
import { ErrorAlert } from '../../../../components/ui/ErrorAlert';
import { Pagination } from '../../../../components/ui/Pagination';
import { getErrorMessage } from '../../../../api/errors';
import styles from './UserList.module.css';

const DEV_SUGGESTIONS = ['torvalds', 'gaearon', 'sindresorhus', 'yyx990803'];

export interface UserListProps {
  users: GitHubUserItem[];
  totalCount: number;
  currentPage: number;
  pageSize?: number;
  isLoading: boolean;
  error: Error | null;
  query: string;
  onPageChange: (page: number) => void;
  onSelectUser?: (login: string) => void;
  onSelectQuery?: (query: string) => void;
  onRetry?: () => void;
}

export const UserList: React.FC<UserListProps> = ({
  users,
  totalCount,
  currentPage,
  pageSize = 20,
  isLoading,
  error,
  query,
  onPageChange,
  onSelectUser,
  onSelectQuery,
  onRetry,
}) => {
  if (error) {
    return (
      <ErrorAlert
        title="Failed to load developers"
        message={getErrorMessage(error)}
        onRetry={onRetry}
      />
    );
  }

  if (isLoading && users.length === 0) {
    return (
      <div className={styles.grid}>
        {Array.from({ length: 6 }).map((_, idx) => (
          <div key={`user-skeleton-${idx}`} className={styles.skeletonCard}>
            <Skeleton variant="circular" width={44} height={44} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <Skeleton variant="text" width="60%" height={16} />
              <Skeleton variant="text" width="40%" height={12} />
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
        title="Find GitHub Developers"
        description="Search for open-source contributors, engineers, and creators by username or keywords."
        action={
          onSelectQuery ? (
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '4px' }}>
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', width: '100%', marginBottom: '4px' }}>
                Popular developer handles:
              </span>
              {DEV_SUGGESTIONS.map((handle) => (
                <button
                  key={handle}
                  type="button"
                  onClick={() => onSelectQuery(handle)}
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
                  @{handle}
                </button>
              ))}
            </div>
          ) : undefined
        }
      />
    );
  }

  if (users.length === 0) {
    return (
      <EmptyState
        icon={<Users size={28} />}
        title="No developers found"
        description={`No GitHub users matched your query for "${query}". Try searching by their GitHub handle or exact name.`}
      />
    );
  }

  return (
    <div>
      <div className={styles.grid}>
        {users.map((user) => (
          <UserCard
            key={user.id}
            user={user}
            onSelect={onSelectUser}
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
