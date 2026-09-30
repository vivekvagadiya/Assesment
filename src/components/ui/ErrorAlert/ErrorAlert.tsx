import React from 'react';
import { AlertCircle, RefreshCw } from '../icons';
import { Button } from '../Button';
import styles from './ErrorAlert.module.css';

export interface ErrorAlertProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  isRetrying?: boolean;
  isRateLimit?: boolean;
  resetTime?: Date | null;
  className?: string;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({
  title = 'Something went wrong',
  message,
  onRetry,
  isRetrying = false,
  isRateLimit = false,
  resetTime,
  className,
}) => {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`${styles.alert} ${className || ''}`}
    >
      <div className={styles.icon} aria-hidden="true">
        <AlertCircle size={22} />
      </div>

      <div className={styles.content}>
        <h4 className={styles.title}>{title}</h4>
        <p className={styles.message}>{message}</p>

        {isRateLimit && resetTime && (
          <p className={styles.rateLimitInfo}>
            Rate limit resets at: {resetTime.toLocaleTimeString()}
          </p>
        )}

        {onRetry && (
          <div className={styles.actions}>
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              isLoading={isRetrying}
              leftIcon={<RefreshCw size={14} />}
            >
              Retry
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
