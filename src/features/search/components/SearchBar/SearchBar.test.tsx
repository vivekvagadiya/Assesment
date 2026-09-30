import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchBar } from './SearchBar';

describe('SearchBar Component', () => {
  it('renders input with placeholder and calls onQueryChange when typing', async () => {
    const handleQueryChange = vi.fn();
    const user = userEvent.setup();

    render(
      <SearchBar
        query=""
        onQueryChange={handleQueryChange}
        activeTab="repos"
        onTabChange={vi.fn()}
        language=""
        onLanguageChange={vi.fn()}
      />
    );

    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('placeholder', expect.stringContaining('Search repositories'));

    await user.type(input, 'react');
    expect(handleQueryChange).toHaveBeenCalled();
  });

  it('allows switching between Repositories and Developers tabs', async () => {
    const handleTabChange = vi.fn();
    const user = userEvent.setup();

    render(
      <SearchBar
        query="react"
        onQueryChange={vi.fn()}
        activeTab="repos"
        onTabChange={handleTabChange}
        language=""
        onLanguageChange={vi.fn()}
        repoCount={120}
        userCount={45}
      />
    );

    const devTab = screen.getByRole('tab', { name: /developers/i });
    await user.click(devTab);

    expect(handleTabChange).toHaveBeenCalledWith('users');
  });

  it('renders language selector when repositories tab is active and triggers change', async () => {
    const handleLanguageChange = vi.fn();
    const user = userEvent.setup();

    render(
      <SearchBar
        query="react"
        onQueryChange={vi.fn()}
        activeTab="repos"
        onTabChange={vi.fn()}
        language=""
        onLanguageChange={handleLanguageChange}
      />
    );

    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();

    await user.selectOptions(select, 'TypeScript');
    expect(handleLanguageChange).toHaveBeenCalledWith('TypeScript');
  });
});
