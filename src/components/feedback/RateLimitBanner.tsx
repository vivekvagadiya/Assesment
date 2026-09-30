import React, { useState, useEffect } from 'react';
import { AlertTriangle, Key, ShieldCheck, Zap } from '../ui/icons';
import { useGitHub } from '../../context/GitHubContext';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import styles from './RateLimitBanner.module.css';

export const RateLimitBanner: React.FC = () => {
  const { rateLimit, token, setToken, isRateLimited } = useGitHub();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputToken, setInputToken] = useState(token || '');
  const [secondsUntilReset, setSecondsUntilReset] = useState<number | null>(null);

  // Live countdown timer for rate limit reset
  useEffect(() => {
    if (!rateLimit) return;

    const updateTimer = () => {
      const now = Date.now();
      const reset = rateLimit.reset.getTime();
      const diff = Math.max(0, Math.ceil((reset - now) / 1000));
      setSecondsUntilReset(diff);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [rateLimit]);

  const handleSaveToken = (e: React.FormEvent) => {
    e.preventDefault();
    setToken(inputToken.trim() ? inputToken.trim() : null);
    setIsModalOpen(false);
  };

  const handleClearToken = () => {
    setInputToken('');
    setToken(null);
    setIsModalOpen(false);
  };

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
  };

  const isLow = Boolean(rateLimit && rateLimit.remaining <= 10 && rateLimit.remaining > 0);

  return (
    <>
      <div
        className={`${styles.banner} ${
          isRateLimited
            ? styles.errorBanner
            : isLow
            ? styles.warningBanner
            : ''
        }`}
      >
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <div className={styles.content}>
            {isRateLimited ? (
              <>
                <AlertTriangle size={15} />
                <span>
                  <strong>GitHub API Rate Limit Exceeded:</strong> Resets in{' '}
                  <strong>{secondsUntilReset ? formatCountdown(secondsUntilReset) : 'shortly'}</strong>.
                </span>
              </>
            ) : isLow ? (
              <>
                <Zap size={14} />
                <span>
                  Rate limit running low: <strong>{rateLimit?.remaining}</strong> of{' '}
                  {rateLimit?.limit} remaining.
                </span>
              </>
            ) : (
              <div className={styles.indicator}>
                <span>GitHub API:</span>
                <Badge
                  variant={token ? 'success' : 'default'}
                  size="sm"
                >
                  {rateLimit
                    ? `${rateLimit.remaining} / ${rateLimit.limit} reqs`
                    : '60 / 60 reqs'}
                </Badge>
                {token && (
                  <Badge variant="purple" size="sm">
                    <ShieldCheck size={12} style={{ marginRight: 3 }} />
                    PAT Active (5,000 req/hr)
                  </Badge>
                )}
              </div>
            )}
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.tokenBtn}
              onClick={() => {
                setInputToken(token || '');
                setIsModalOpen(true);
              }}
            >
              {token ? 'Manage API Token' : 'Add Optional Token (bypasses 60 req/hr)'}
            </button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="GitHub API Access Configuration"
      >
        <form onSubmit={handleSaveToken} className={styles.tokenModalForm}>
          <p className={styles.tokenHelpText}>
            By default, unauthenticated GitHub API requests are limited to <strong>60 requests per hour</strong>.
            Adding a Personal Access Token (classic with zero permissions, or fine-grained) increases your limit to <strong>5,000 requests per hour</strong>.
          </p>

          <Input
            label="Personal Access Token (optional)"
            type="password"
            placeholder="ghp_xxxxxxxxxxxx"
            value={inputToken}
            onChange={(e) => setInputToken(e.target.value)}
            helperText="The token is stored exclusively in your browser's localStorage and only transmitted to api.github.com."
            leftIcon={<Key size={16} />}
          />

          <p className={styles.tokenHelpText}>
            You can generate a token in{' '}
            <a
              href="https://github.com/settings/tokens/new"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub Settings &rarr; Developer Settings &rarr; Personal Access Tokens
            </a>
            . No special scopes are required for public repository searches.
          </p>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
            {token && (
              <Button type="button" variant="danger" size="sm" onClick={handleClearToken}>
                Remove Token
              </Button>
            )}
            <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Save Token
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};
