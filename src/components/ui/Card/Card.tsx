import React from 'react';
import styles from './Card.module.css';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg';
  isInteractive?: boolean;
  as?: 'div' | 'article' | 'section';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      padding = 'md',
      isInteractive = false,
      as = 'div',
      className,
      ...props
    },
    ref
  ) => {
    const Component = as as React.ElementType;

    const paddingClass = {
      none: styles.paddingNone,
      sm: styles.paddingSm,
      md: styles.paddingMd,
      lg: styles.paddingLg,
    }[padding];

    const classNames = [
      styles.card,
      paddingClass,
      isInteractive ? styles.interactive : '',
      className || '',
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <Component
        ref={ref}
        className={classNames}
        tabIndex={isInteractive ? 0 : undefined}
        role={isInteractive ? 'button' : undefined}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Card.displayName = 'Card';
