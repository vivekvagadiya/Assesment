import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RepositoryCard } from './RepositoryCard';
import { GitHubRepository } from '../../../../api/types/github';

const mockRepo: GitHubRepository = {
  id: 10270250,
  node_id: 'MDEwOlJlcG9zaXRvcnkxMDI3MDI1MA==',
  name: 'react',
  full_name: 'facebook/react',
  owner: {
    login: 'facebook',
    id: 69631,
    avatar_url: 'https://avatars.githubusercontent.com/u/69631?v=4',
    html_url: 'https://github.com/facebook',
    type: 'Organization',
  },
  private: false,
  html_url: 'https://github.com/facebook/react',
  description: 'The library for web and native user interfaces.',
  fork: false,
  url: 'https://api.github.com/repos/facebook/react',
  created_at: '2013-05-24T16:15:54Z',
  updated_at: '2026-09-30T12:00:00Z',
  pushed_at: '2026-09-30T12:00:00Z',
  stargazers_count: 220000,
  watchers_count: 220000,
  language: 'JavaScript',
  forks_count: 45000,
  open_issues_count: 1200,
  default_branch: 'main',
};

describe('RepositoryCard Component', () => {
  it('renders repository name, owner, description, language, and stats', () => {
    render(<RepositoryCard repository={mockRepo} onSelect={vi.fn()} />);

    expect(screen.getByText(/facebook \//i)).toBeInTheDocument();
    expect(screen.getByText('react')).toBeInTheDocument();
    expect(screen.getByText(mockRepo.description!)).toBeInTheDocument();
    expect(screen.getByText('JavaScript')).toBeInTheDocument();
    expect(screen.getByText('220k')).toBeInTheDocument(); // 220,000 formatted
    expect(screen.getByText('45k')).toBeInTheDocument();  // 45,000 formatted
  });

  it('triggers onSelect when card is clicked', async () => {
    const handleSelect = vi.fn();
    const user = userEvent.setup();

    render(<RepositoryCard repository={mockRepo} onSelect={handleSelect} />);

    const card = screen.getByRole('button', { name: `Repository ${mockRepo.full_name}` });
    await user.click(card);

    expect(handleSelect).toHaveBeenCalledWith('facebook/react');
  });

  it('contains an external link pointing to GitHub repository', () => {
    render(<RepositoryCard repository={mockRepo} onSelect={vi.fn()} />);

    const extLink = screen.getByRole('link', { name: `View ${mockRepo.full_name} on GitHub` });
    expect(extLink).toHaveAttribute('href', mockRepo.html_url);
    expect(extLink).toHaveAttribute('target', '_blank');
  });
});
