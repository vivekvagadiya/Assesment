import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { OfflineBanner } from './OfflineBanner';

describe('OfflineBanner Component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders nothing when browser is online', () => {
    Object.defineProperty(navigator, 'onLine', {
      configurable: true,
      value: true,
    });

    const { container } = render(<OfflineBanner />);
    expect(container.firstChild).toBeNull();
  });

  it('renders banner when browser is offline', () => {
    Object.defineProperty(navigator, 'onLine', {
      configurable: true,
      value: false,
    });

    render(<OfflineBanner />);
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText(/you appear to be offline/i)).toBeInTheDocument();
  });
});
