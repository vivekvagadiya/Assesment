import React from 'react';
import { ExternalLink, ChevronRight, Shield } from '../../../../components/ui/icons';
import { GitHubUserItem } from '../../../../api/types/github';
import { Badge } from '../../../../components/ui/Badge';
import styles from './UserCard.module.css';

export interface UserCardProps {
  user: GitHubUserItem;
  onSelect?: (login: string) => void;
}

export const UserCard: React.FC<UserCardProps> = ({ user, onSelect }) => {
  return (
    <div
      role="button"
      tabIndex={0}
      className={styles.card}
      onClick={() => onSelect?.(user.login)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect?.(user.login);
        }
      }}
      aria-label={`View profile details for ${user.login}`}
    >
      <div className={styles.left}>
        <img
          src={user.avatar_url}
          alt={`${user.login}'s avatar`}
          className={styles.avatar}
          loading="lazy"
        />

        <div className={styles.info}>
          <h3 className={styles.login}>@{user.login}</h3>
          <div className={styles.metaRow}>
            <Badge variant="default" size="sm">
              {user.type}
            </Badge>
            {user.site_admin && (
              <Badge variant="purple" size="sm">
                <Shield size={10} style={{ marginRight: 2 }} />
                Staff
              </Badge>
            )}
            <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
              ID: #{user.id}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.right}>
        <a
          href={user.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.extLink}
          onClick={(e) => e.stopPropagation()}
          aria-label={`Open @${user.login} on GitHub`}
          title="Open GitHub Profile"
        >
          <ExternalLink size={15} aria-hidden="true" />
        </a>

        {onSelect && (
          <ChevronRight size={18} color="var(--color-text-muted)" aria-hidden="true" />
        )}
      </div>
    </div>
  );
};
