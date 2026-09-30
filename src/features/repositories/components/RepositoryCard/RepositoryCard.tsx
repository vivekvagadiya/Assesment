import React from 'react';
import { Star, GitFork, AlertCircle, ExternalLink } from 'lucide-react';
import { GitHubRepository } from '../../../../api/types/github';
import { Card } from '../../../../components/ui/Card';
import { Badge } from '../../../../components/ui/Badge';
import { formatNumber, getLanguageColor } from '../../../../utils/formatters';
import { formatRelativeTime } from '../../../../utils/dateUtils';
import styles from './RepositoryCard.module.css';

export interface RepositoryCardProps {
  repository: GitHubRepository;
  onSelect: (fullName: string) => void;
}

export const RepositoryCard: React.FC<RepositoryCardProps> = ({
  repository,
  onSelect,
}) => {
  const {
    full_name,
    name,
    owner,
    description,
    language,
    stargazers_count,
    forks_count,
    open_issues_count,
    updated_at,
    html_url,
  } = repository;

  return (
    <Card
      as="article"
      padding="md"
      className={styles.card}
      onClick={() => onSelect(full_name)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(full_name);
        }
      }}
      aria-label={`Repository ${full_name}`}
    >
      <div className={styles.header}>
        <div className={styles.ownerInfo}>
          <img
            src={owner.avatar_url}
            alt={`${owner.login}'s avatar`}
            className={styles.avatar}
            loading="lazy"
          />
          <h3 className={styles.repoName}>
            <span className={styles.ownerLogin}>{owner.login} / </span>
            {name}
          </h3>
        </div>

        <a
          href={html_url}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.extLink}
          onClick={(e) => e.stopPropagation()}
          aria-label={`View ${full_name} on GitHub`}
          title="Open on GitHub"
        >
          <ExternalLink size={16} aria-hidden="true" />
        </a>
      </div>

      <p className={`${styles.description} ${!description ? styles.noDescription : ''}`}>
        {description || 'No description provided.'}
      </p>

      <div className={styles.metaRow}>
        <div className={styles.stats}>
          {language && (
            <Badge
              variant="default"
              size="sm"
              dot
              dotColor={getLanguageColor(language)}
            >
              {language}
            </Badge>
          )}

          <span className={styles.statItem} title={`${stargazers_count.toLocaleString()} stars`}>
            <Star size={14} color="var(--color-warning-text)" />
            {formatNumber(stargazers_count)}
          </span>

          <span className={styles.statItem} title={`${forks_count.toLocaleString()} forks`}>
            <GitFork size={14} color="var(--color-text-secondary)" />
            {formatNumber(forks_count)}
          </span>

          <span className={styles.statItem} title={`${open_issues_count.toLocaleString()} open issues`}>
            <AlertCircle size={14} color="var(--color-success-text)" />
            {formatNumber(open_issues_count)}
          </span>
        </div>

        <span className={styles.updatedDate}>
          Updated {formatRelativeTime(updated_at)}
        </span>
      </div>
    </Card>
  );
};
