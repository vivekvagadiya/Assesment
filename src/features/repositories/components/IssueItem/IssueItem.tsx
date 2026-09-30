import React from 'react';
import { CircleDot, CheckCircle2, MessageSquare, ExternalLink } from '../../../../components/ui/icons';
import { GitHubIssue } from '../../../../api/types/github';
import { formatRelativeTime } from '../../../../utils/dateUtils';
import styles from './IssueItem.module.css';

export interface IssueItemProps {
  issue: GitHubIssue;
}

export const IssueItem: React.FC<IssueItemProps> = ({ issue }) => {
  const isOpen = issue.state === 'open';

  return (
    <div className={styles.issueItem}>
      <div className={styles.stateIcon} aria-label={`Issue state: ${issue.state}`}>
        {isOpen ? (
          <CircleDot size={16} className={styles.openIcon} />
        ) : (
          <CheckCircle2 size={16} className={styles.closedIcon} />
        )}
      </div>

      <div className={styles.content}>
        <div className={styles.titleRow}>
          <a
            href={issue.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.title}
          >
            {issue.title}
          </a>
          <span className={styles.issueNumber}>#{issue.number}</span>
        </div>

        <div className={styles.metaRow}>
          <span>{isOpen ? 'Opened' : 'Closed'} {formatRelativeTime(issue.updated_at || issue.created_at)}</span>
          <span>by</span>
          {issue.user && (
            <span className={styles.author}>
              <img
                src={issue.user.avatar_url}
                alt={`${issue.user.login}'s avatar`}
                className={styles.authorAvatar}
                loading="lazy"
              />
              @{issue.user.login}
            </span>
          )}
        </div>
      </div>

      <div className={styles.rightMeta}>
        {issue.comments > 0 && (
          <span className={styles.comments} title={`${issue.comments} comments`}>
            <MessageSquare size={13} />
            {issue.comments}
          </span>
        )}

        <a
          href={issue.html_url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'var(--color-text-muted)' }}
          aria-label={`Open issue #${issue.number} on GitHub`}
          title="Open issue on GitHub"
        >
          <ExternalLink size={14} />
        </a>
      </div>
    </div>
  );
};
