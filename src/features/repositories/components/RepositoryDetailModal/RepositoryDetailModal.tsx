import React from 'react';
import {
  ExternalLink,
  Star,
  GitFork,
  Eye,
  AlertCircle,
  GitBranch,
  Calendar,
  Clock,
} from 'lucide-react';
import { useRepositoryDetailsQuery } from '../../hooks/useRepositoryDetailsQuery';
import { IssueList } from '../IssueList/IssueList';
import { Modal } from '../../../../components/ui/Modal';
import { Button } from '../../../../components/ui/Button';
import { Badge } from '../../../../components/ui/Badge';
import { Skeleton } from '../../../../components/ui/Skeleton';
import { ErrorAlert } from '../../../../components/ui/ErrorAlert';
import { formatNumber, getLanguageColor } from '../../../../utils/formatters';
import { formatFullDate, formatRelativeTime } from '../../../../utils/dateUtils';
import { getErrorMessage } from '../../../../api/errors';
import styles from './RepositoryDetailModal.module.css';

export interface RepositoryDetailModalProps {
  fullName: string | null;
  onClose: () => void;
}

export const RepositoryDetailModal: React.FC<RepositoryDetailModalProps> = ({
  fullName,
  onClose,
}) => {
  const {
    data: repo,
    isLoading,
    error,
    refetch,
  } = useRepositoryDetailsQuery(fullName);

  return (
    <Modal
      isOpen={Boolean(fullName)}
      onClose={onClose}
      title={fullName ? fullName : 'Repository Details'}
      maxWidth={720}
      footer={
        repo ? (
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', width: '100%' }}>
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
            <a
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              tabIndex={-1}
            >
              <Button
                variant="primary"
                size="sm"
                rightIcon={<ExternalLink size={14} />}
              >
                View on GitHub
              </Button>
            </a>
          </div>
        ) : undefined
      }
    >
      {error && (
        <ErrorAlert
          title="Could not load repository details"
          message={getErrorMessage(error)}
          onRetry={refetch}
        />
      )}

      {isLoading && (
        <div className={styles.container}>
          <div className={styles.header}>
            <Skeleton variant="rectangular" width={48} height={48} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Skeleton variant="text" width="60%" height={24} />
              <Skeleton variant="text" width="40%" height={16} />
            </div>
          </div>
          <Skeleton variant="text" width="95%" height={16} />
          <Skeleton variant="rectangular" width="100%" height={60} />
          <Skeleton variant="rectangular" width="100%" height={140} />
        </div>
      )}

      {!isLoading && repo && (
        <div className={styles.container}>
          <div className={styles.header}>
            <img
              src={repo.owner.avatar_url}
              alt={`${repo.owner.login}'s avatar`}
              className={styles.avatar}
            />

            <div className={styles.headerTitles}>
              <h3 className={styles.repoFullName}>{repo.full_name}</h3>
              <div className={styles.badgesRow}>
                {repo.language && (
                  <Badge
                    variant="default"
                    size="sm"
                    dot
                    dotColor={getLanguageColor(repo.language)}
                  >
                    {repo.language}
                  </Badge>
                )}

                <Badge variant="outline" size="sm">
                  <GitBranch size={12} style={{ marginRight: 3 }} />
                  {repo.default_branch}
                </Badge>

                {repo.fork && (
                  <Badge variant="warning" size="sm">
                    Fork
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <p className={styles.description}>
            {repo.description || 'No description provided.'}
          </p>

          <div className={styles.statsGrid}>
            <div className={styles.statItem} title={`${repo.stargazers_count.toLocaleString()} stars`}>
              <span className={styles.statValue}>
                <Star size={14} color="var(--color-warning-text)" style={{ display: 'inline', marginRight: 4 }} />
                {formatNumber(repo.stargazers_count)}
              </span>
              <span className={styles.statLabel}>Stars</span>
            </div>

            <div className={styles.statItem} title={`${repo.forks_count.toLocaleString()} forks`}>
              <span className={styles.statValue}>
                <GitFork size={14} color="var(--color-text-secondary)" style={{ display: 'inline', marginRight: 4 }} />
                {formatNumber(repo.forks_count)}
              </span>
              <span className={styles.statLabel}>Forks</span>
            </div>

            <div className={styles.statItem} title={`${repo.watchers_count.toLocaleString()} watchers`}>
              <span className={styles.statValue}>
                <Eye size={14} color="var(--color-accent)" style={{ display: 'inline', marginRight: 4 }} />
                {formatNumber(repo.watchers_count)}
              </span>
              <span className={styles.statLabel}>Watchers</span>
            </div>

            <div className={styles.statItem} title={`${repo.open_issues_count.toLocaleString()} open issues`}>
              <span className={styles.statValue}>
                <AlertCircle size={14} color="var(--color-success-text)" style={{ display: 'inline', marginRight: 4 }} />
                {formatNumber(repo.open_issues_count)}
              </span>
              <span className={styles.statLabel}>Open Issues</span>
            </div>
          </div>

          <div className={styles.metadataGrid}>
            <div className={styles.metaItem}>
              <Calendar size={15} color="var(--color-text-muted)" />
              <span>Created: <strong>{formatFullDate(repo.created_at)}</strong></span>
            </div>

            <div className={styles.metaItem}>
              <Clock size={15} color="var(--color-text-muted)" />
              <span>Last updated: <strong>{formatRelativeTime(repo.updated_at)}</strong></span>
            </div>
          </div>

          <div className={styles.issuesSection}>
            <IssueList repoFullName={repo.full_name} />
          </div>
        </div>
      )}
    </Modal>
  );
};
