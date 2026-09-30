import React from 'react';
import { Users, Search } from 'lucide-react';
import { GitHubUserItem } from '../../../../api/types/github';
import { UserCard } from '../UserCard/UserCard';
import { Skeleton } from '../../../../components/ui/Skeleton';
import { EmptyState } from '../../../../components/ui/EmptyState';
import { ErrorAlert } from '../../../../components/ui/ErrorAlert';
import { Pagination } from '../../../../components/ui/Pagination';
import { getErrorMessage } from '../../../../api/errors';
import styles from './UserList.module.css';

export interface UserListProps {
  users: GitHubUserItem[];
  totalCount: number;
  currentPage: number;
  pageSize?: number;
  isLoading: boolean;
  error: Error | null;
  query: string;
  onPageChange: (page: number) => void;
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Skeleton variant="circular" width={48} height={48} />
              <div style={{ flex: 1 }}>
                <Skeleton variant="text" width="60%" height={16} />
                <Skeleton variant="text" width="40%" height={12} />
              </div>
            </div>
            <Skeleton variant="text" width="90%" height={14} />
            <Skeleton variant="rectangular" width="100%" height={50} />
            <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between' }}>
              <Skeleton variant="text" width={80} height={14} />
              <Skeleton variant="text" width={40} height={14} />
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
          <UserCard key={user.id} user={user} />
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
