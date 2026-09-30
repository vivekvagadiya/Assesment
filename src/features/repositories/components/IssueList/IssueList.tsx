import React, { useState } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { useRepositoryIssuesQuery } from '../../hooks/useRepositoryIssuesQuery';
import { IssueItem } from '../IssueItem/IssueItem';
import { Skeleton } from '../../../../components/ui/Skeleton';
import { ErrorAlert } from '../../../../components/ui/ErrorAlert';
import { getErrorMessage } from '../../../../api/errors';
import styles from './IssueList.module.css';

export interface IssueListProps {
  repoFullName: string;
}

export const IssueList: React.FC<IssueListProps> = ({ repoFullName }) => {
  const [issueState, setIssueState] = useState<'open' | 'closed' | 'all'>('open');

  const {
    data: issues,
    isLoading,
    error,
    refetch,
  } = useRepositoryIssuesQuery({
    fullName: repoFullName,
    state: issueState,
    perPage: 10,
  });

  return (
    <div className={styles.container}>
      <div className={styles.filterHeader}>
        <h4 className={styles.sectionTitle}>Recent Repository Issues</h4>

        <div className={styles.filters} role="group" aria-label="Issue state filter">
          {(['open', 'closed', 'all'] as const).map((filter) => (
            <button
              key={filter}
              type="button"
              className={`${styles.filterButton} ${
                issueState === filter ? styles.activeFilter : ''
              }`}
              onClick={() => setIssueState(filter)}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <ErrorAlert
          title="Could not load repository issues"
          message={getErrorMessage(error)}
          onRetry={refetch}
        />
      )}

      {isLoading && (
        <div className={styles.list}>
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={`issue-skel-${idx}`} className={styles.skeletonRow}>
              <Skeleton variant="circular" width={16} height={16} />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <Skeleton variant="text" width="70%" height={14} />
                <Skeleton variant="text" width="40%" height={11} />
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && issues && issues.length === 0 && (
        <div
          style={{
            padding: 'var(--space-6) var(--space-4)',
            textAlign: 'center',
            backgroundColor: 'var(--color-surface)',
            border: '1px dashed var(--color-border)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--color-text-secondary)',
            fontSize: 'var(--font-size-sm)',
          }}
        >
          <CheckCircle size={24} color="var(--color-success-text)" style={{ margin: '0 auto var(--space-2)' }} />
          No {issueState !== 'all' ? issueState : ''} issues found for this repository.
        </div>
      )}

      {!isLoading && issues && issues.length > 0 && (
        <div className={styles.list}>
          {issues.map((issue) => (
            <IssueItem key={issue.id} issue={issue} />
          ))}
        </div>
      )}
    </div>
  );
};
