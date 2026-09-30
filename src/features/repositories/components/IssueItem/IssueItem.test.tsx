import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { IssueItem } from './IssueItem';
import { GitHubIssue } from '../../../../api/types/github';

const mockIssue: GitHubIssue = {
  id: 101,
  number: 42,
  title: 'Fix hydration mismatch in concurrent mode',
  user: {
    id: 99,
    login: 'sophiebits',
    avatar_url: 'https://avatars.githubusercontent.com/u/99?v=4',
    html_url: 'https://github.com/sophiebits',
  },
  state: 'open',
  created_at: '2026-09-28T10:00:00Z',
  updated_at: '2026-09-29T10:00:00Z',
  closed_at: null,
  html_url: 'https://github.com/facebook/react/issues/42',
  comments: 5,
  body: 'Detailed reproduction...',
};

describe('IssueItem Component', () => {
  it('renders issue title, number, author, and comment count', () => {
    render(<IssueItem issue={mockIssue} />);

    expect(screen.getByText('Fix hydration mismatch in concurrent mode')).toBeInTheDocument();
    expect(screen.getByText('#42')).toBeInTheDocument();
    expect(screen.getByText('@sophiebits')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('provides accessible external link pointing to GitHub issue', () => {
    render(<IssueItem issue={mockIssue} />);

    const link = screen.getByRole('link', { name: 'Fix hydration mismatch in concurrent mode' });
    expect(link).toHaveAttribute('href', mockIssue.html_url);
    expect(link).toHaveAttribute('target', '_blank');
  });

  it('renders closed state correctly', () => {
    const closedIssue: GitHubIssue = {
      ...mockIssue,
      state: 'closed',
      closed_at: '2026-09-30T10:00:00Z',
    };

    render(<IssueItem issue={closedIssue} />);
    expect(screen.getByLabelText(/issue state: closed/i)).toBeInTheDocument();
  });
});
