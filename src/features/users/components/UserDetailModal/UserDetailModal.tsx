import React from 'react';
import {
  ExternalLink,
  MapPin,
  Building,
  Link as LinkIcon,
  Calendar,
} from 'lucide-react';
import { useEnrichedUser } from '../../hooks/useEnrichedUser';
import { Modal } from '../../../../components/ui/Modal';
import { Button } from '../../../../components/ui/Button';
import { Skeleton } from '../../../../components/ui/Skeleton';
import { ErrorAlert } from '../../../../components/ui/ErrorAlert';
import { formatNumber } from '../../../../utils/formatters';
import { formatFullDate } from '../../../../utils/dateUtils';
import { getErrorMessage } from '../../../../api/errors';
import styles from './UserDetailModal.module.css';

export interface UserDetailModalProps {
  username: string | null;
  onClose: () => void;
}

export const UserDetailModal: React.FC<UserDetailModalProps> = ({
  username,
  onClose,
}) => {
  const { data: user, isLoading, error, refetch } = useEnrichedUser(
    username || '',
    Boolean(username)
  );

  return (
    <Modal
      isOpen={Boolean(username)}
      onClose={onClose}
      title={username ? `@${username} Profile Details` : 'Developer Profile'}
      maxWidth={580}
      footer={
        user ? (
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', width: '100%' }}>
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
            <a
              href={user.html_url}
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
          title="Could not load developer profile"
          message={getErrorMessage(error)}
          onRetry={refetch}
        />
      )}

      {isLoading && (
        <div className={styles.container}>
          <div className={styles.profileHeader}>
            <Skeleton variant="circular" width={72} height={72} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Skeleton variant="text" width="60%" height={24} />
              <Skeleton variant="text" width="40%" height={16} />
            </div>
          </div>
          <Skeleton variant="text" width="90%" height={16} />
          <Skeleton variant="rectangular" width="100%" height={80} />
          <Skeleton variant="text" width="50%" height={16} />
        </div>
      )}

      {!isLoading && user && (
        <div className={styles.container}>
          <div className={styles.profileHeader}>
            <img
              src={user.avatar_url}
              alt={`${user.login}'s avatar`}
              className={styles.avatar}
            />
            <div className={styles.names}>
              <h3 className={styles.fullName}>{user.name || user.login}</h3>
              <span className={styles.username}>@{user.login}</span>
            </div>
          </div>

          {user.bio && <p className={styles.bio}>{user.bio}</p>}

          <div className={styles.statsGrid}>
            <div className={styles.statItem}>
              <span className={styles.statValue}>
                {formatNumber(user.followers)}
              </span>
              <span className={styles.statLabel}>Followers</span>
            </div>

            <div className={styles.statItem}>
              <span className={styles.statValue}>
                {formatNumber(user.following)}
              </span>
              <span className={styles.statLabel}>Following</span>
            </div>

            <div className={styles.statItem}>
              <span className={styles.statValue}>
                {formatNumber(user.public_repos)}
              </span>
              <span className={styles.statLabel}>Repositories</span>
            </div>
          </div>

          <div className={styles.detailsList}>
            {user.location && (
              <div className={styles.detailRow}>
                <MapPin size={16} className={styles.detailIcon} />
                <span>{user.location}</span>
              </div>
            )}

            {user.company && (
              <div className={styles.detailRow}>
                <Building size={16} className={styles.detailIcon} />
                <span>{user.company}</span>
              </div>
            )}

            {user.blog && (
              <div className={styles.detailRow}>
                <LinkIcon size={16} className={styles.detailIcon} />
                <a
                  href={user.blog.startsWith('http') ? user.blog : `https://${user.blog}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {user.blog}
                </a>
              </div>
            )}

            <div className={styles.detailRow}>
              <Calendar size={16} className={styles.detailIcon} />
              <span>Joined {formatFullDate(user.created_at)}</span>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};
