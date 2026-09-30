import React from 'react';
import { ExternalLink, MapPin } from 'lucide-react';
import { GitHubUserItem } from '../../../../api/types/github';
import { useEnrichedUser } from '../../hooks/useEnrichedUser';
import { Card } from '../../../../components/ui/Card';
import { Skeleton } from '../../../../components/ui/Skeleton';
import { formatNumber } from '../../../../utils/formatters';
import styles from './UserCard.module.css';

export interface UserCardProps {
  user: GitHubUserItem;
}

export const UserCard: React.FC<UserCardProps> = ({ user }) => {
  const { data: details, isLoading } = useEnrichedUser(user.login);

  const displayName = details?.name || user.login;
  const showUsernameSub = Boolean(details?.name && details.name !== user.login);

  return (
    <Card as="article" padding="md" className={styles.card}>
      <div className={styles.header}>
        <img
          src={user.avatar_url}
          alt={`${user.login}'s avatar`}
          className={styles.avatar}
          loading="lazy"
        />

        <div className={styles.identity}>
          <h3 className={styles.name} title={displayName}>
            {displayName}
          </h3>
          {showUsernameSub && (
            <span className={styles.username}>@{user.login}</span>
          )}
        </div>

        <a
          href={user.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.extLink}
          aria-label={`View @${user.login} on GitHub`}
          title="Open GitHub Profile"
        >
          <ExternalLink size={16} aria-hidden="true" />
        </a>
      </div>

      <p className={styles.bio}>
        {isLoading ? (
          <Skeleton variant="text" width="85%" height={14} />
        ) : (
          details?.bio || 'No bio provided.'
        )}
      </p>

      <div className={styles.statsGrid}>
        <div className={styles.statBlock}>
          <span className={styles.statValue}>
            {isLoading ? (
              <Skeleton variant="text" width={28} height={16} />
            ) : (
              formatNumber(details?.followers ?? 0)
            )}
          </span>
          <span className={styles.statLabel}>Followers</span>
        </div>

        <div className={styles.statBlock}>
          <span className={styles.statValue}>
            {isLoading ? (
              <Skeleton variant="text" width={28} height={16} />
            ) : (
              formatNumber(details?.following ?? 0)
            )}
          </span>
          <span className={styles.statLabel}>Following</span>
        </div>

        <div className={styles.statBlock}>
          <span className={styles.statValue}>
            {isLoading ? (
              <Skeleton variant="text" width={28} height={16} />
            ) : (
              formatNumber(details?.public_repos ?? 0)
            )}
          </span>
          <span className={styles.statLabel}>Repos</span>
        </div>
      </div>

      <div className={styles.footer}>
        {isLoading ? (
          <Skeleton variant="text" width={100} height={14} />
        ) : details?.location ? (
          <span className={styles.location} title={details.location}>
            <MapPin size={13} aria-hidden="true" />
            {details.location}
          </span>
        ) : (
          <span />
        )}

        <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
          ID: #{user.id}
        </span>
      </div>
    </Card>
  );
};
