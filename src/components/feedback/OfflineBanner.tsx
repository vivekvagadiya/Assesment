import React from 'react';
import { WifiOff } from '../ui/icons';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';
import styles from './OfflineBanner.module.css';

export const OfflineBanner: React.FC = () => {
  const { isOnline } = useNetworkStatus();

  if (isOnline) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className={styles.banner}
    >
      <WifiOff size={15} />
      <span>You appear to be offline. Live searches and repository details may be unavailable.</span>
    </div>
  );
};
