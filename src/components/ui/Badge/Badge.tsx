import React from 'react';
import styles from './Badge.module.css';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'purple' | 'outline';
  size?: 'sm' | 'md';
  dot?: boolean;
  dotColor?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'sm',
  dot = false,
  dotColor,
  className,
  style,
  ...props
}) => {
  const classNames = [
    styles.badge,
    styles[variant],
    styles[size],
    className || '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={classNames} style={style} {...props}>
      {dot && (
        <span
          className={styles.dot}
          style={dotColor ? { backgroundColor: dotColor } : undefined}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
};
